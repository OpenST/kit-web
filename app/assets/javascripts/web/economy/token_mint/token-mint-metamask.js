/*************IMP Note- Currently implemented as singleton, as 2 providers cant live parallelly.*******/

;(function (window,$) {
  var ost = ns("ost"),
    Polling = ost.Polling ,
    utilities = ns("ost.utilities")
  ;
  
  function StakeAndMintMetamask() {
  
  }
  
  StakeAndMintMetamask.prototype = {
  
    initFlow: function () {
      var oThis = this ;
      
      var workflowId = oThis.getWorkflowId() ,
        desiredAccounts = oThis.getWhitelistedAddress()
      ;
      oThis.setupMetamask( desiredAccounts );
      if( workflowId ) {
        oThis.metamask.enable();
      }
      oThis.bindActions();
    },
    
    bindActions : function () {
      var oThis = this ;
      oThis.jClientRetryBtn.off('click').on('click' , function () {
        oThis.approve();
      });
    },
  
    getWalletAddress : function () {
      var oThis = this  ;
      return oThis.walletAddress || oThis.metamask.getWalletAddress();
    },
  
    onMintToken: function () {
      var oThis = this ;
      oThis.metamask.enable();
    },
  
    setupMetamask: function( desiredAccounts ){
      var oThis = this ;
      oThis.metamask = new Metamask({
        desiredNetwork: oThis.chainId,
        desiredAccounts : desiredAccounts , //Handling of undefined is present in Metamask so not to worry.
      
        onNotDapp: function(){
          ost.coverElements.show("#installMetamaskCover");
        },
      
        onNotMetamask: function(){
          ost.coverElements.show("#installMetamaskCover");
        },
      
        onWaitingEnable: function(){
          ost.coverElements.show("#metamaskLockedCover");
        },
      
        onUserRejectedProviderAccess: function(){
          ost.coverElements.show("#metamaskDisabledCover");
        },
      
        onNotDesiredNetwork: function(){
          ost.coverElements.show("#metamaskWrongNetworkCover");
        },
      
        onNotDesiredAccount: function(){
          ost.coverElements.show("#metamaskWrongPrimaryAddressCover");
        },
      
        onDesiredAccount: function(){
          ost.coverElements.hideAll();
          if(oThis.isSuperAdmin) {
            oThis.onDesiredAccount();
          }
        },
      
        onNewAccount: function(){
          ost.coverElements.hideAll();
          if(oThis.isSuperAdmin) {
            oThis.validateAccount();
          }
        },
      
        onSendAsync : function ( options, err, result ) {
          if ( !err && !result ) {
            ost.coverElements.show("#process_failure_error_cover");
          }
        }
      });
    },
  
    onDesiredAccount : function () {
      var oThis = this ;
      oThis.setStakerAddress();
      var workflowId = oThis.getWorkflowId() ;
      if( workflowId ){
        oThis.onWorkFlow( workflowId );
      }else {
        oThis.checkForBal();
      }
    },
  
    validateAccount : function () {
      var oThis = this ;
      var whitelisted = oThis.getWhitelistedAddress(),
        selectedAddress = oThis.getWalletAddress()
      ;
      oThis.setStakerAddress();
      if( !whitelisted || whitelisted.indexOf( selectedAddress.toLowerCase() ) < 0 ){
        oThis.showSection( oThis.jAddressNotWhitelistedSection ) ;
      }
      else{
        oThis.checkForBal();
      }
    },
  
    onConfirmStakeMintSuccess : function ( res ) {
      var oThis =  this ,
        data = res && res.data ,
        ostToStake = utilities.deepGet( res , "data.precise_amounts.OST"),
        btToMint =   utilities.deepGet( res , "data.precise_amounts.BT" )
      ;
      oThis.setDataInDataConfig( "gatewayComposerDetails" ,  data );
      oThis.showSection( oThis.jTokenStakeAndMintSignSection ) ;
      oThis.approve(ostToStake , btToMint );
    },
  
    approve: function (ostToStake , btToMint ) {
      var oThis = this  ;
      
      oThis.resetState();
      
      // Build params for approve
      var params = [
        oThis.getGatewayComposerContractAddress(),
        ostToStake
      ];
    
      // Create Encoded ABI using params
      var data = oThis.metamask.getContractEncodedABI(
        oThis.getSimpleTokenContractAddress(),
        'approve',  //ABI method name
        params,
        oThis.getSimpleTokenABI()
      );
    
      // Create options ABI using data
      var options = {
        method: 'eth_sendTransaction',
        params: [
          {
            "from": oThis.getWalletAddress(),
            "to": oThis.getSimpleTokenContractAddress(),
            "data": data,
            "gas": oThis.getSimpleTokenContractGas(),
            "gasPrice": oThis.getGasPrice()
          }
        ]
      };
    
      // If data then send transaction...
      if(data){
        oThis.metamask.sendAsync(options, function(err, result){
        
          if(  err || ( result && result.error ) ){
            oThis.onApproveError( err );
          }else if( result ){
            oThis.onApprove( result , ostToStake , btToMint );
          }
          err && console.error(err);
          result && console.log(result);
        });
      }
    
    },
  
    onApprove: function ( res , ostToStake , btToMint ) {
      var oThis = this  ;
      oThis.walletAddress = oThis.getWalletAddress(); //Cache once approve transaction is confirmed from metamask.
      oThis.approve_transaction_hash = res['result'] ;
      oThis.bindBeforeUnload(  );
      oThis.updateIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.processing-state-icon');
    
      setTimeout( function () { //Delay so that confirm metamask pop-up is visible
        oThis.sendRequestStakeRequest(ostToStake , btToMint );
      } , 500 )
    },
  
    onApproveError : function () {
      var oThis = this ;
      oThis.updateIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.jSignClientErrorBtnWrap.show();
    },
  
    sendRequestStakeRequest : function (ostToStake , btToMint ) {
      var oThis = this ;
      oThis.updateIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.pre-state-icon');
      oThis.jSignClientErrorBtnWrap.hide();
      oThis.requestStake( ostToStake ,  btToMint );
    },
  
    requestStake: function ( ostToStakeWei , btToMintWei ) {
    
      var oThis = this ;
      
      var gatewayComposerTxParams = oThis.getGatewayComposerTxParams();
    
      // Build params for requestStake
      var params = [
        ostToStakeWei,// OST wei as string
        btToMintWei,  // BT wei as string
        gatewayComposerTxParams['gateway_contract'],
        gatewayComposerTxParams['stake_and_mint_beneficiary'],
        gatewayComposerTxParams['gas_price'],
        gatewayComposerTxParams['gas_limit'],
        gatewayComposerTxParams['staker_gateway_nonce']
      ];
    
      // Create Encoded ABI using params
      var data = oThis.metamask.getContractEncodedABI(
        oThis.getGatewayComposerContractAddress(),
        'requestStake',  //method name
        params,
        oThis.getGatewayComposerABI()
      );
    
      // Create options ABI using data
      var options = {
        method: 'eth_sendTransaction',
        params: [
          {
            "from": oThis.getWalletAddress(),
            "to": oThis.getGatewayComposerContractAddress(),
            "data" : data,
            "gas": oThis.getGatewayComposerContractGas(),
            "gasPrice": oThis.getGasPrice()
          }
        ]
      };
    
      // If data then send transaction...
      if(data){
        oThis.metamask.sendAsync(options, function(err, result){
        
          if(  err || (result && result.error ) ){
            oThis.onRequestStakeError( err );
          }else if(   result && result.result ){
            oThis.onRequestStakeSuccess( result );
          }
        
          err && console.error(err);
          result && console.log(result);
        
        });
      }
    
    },
  
    onRequestStakeSuccess: function ( res ) {
      var oThis = this ;
      oThis.request_stake_transaction_hash = res['result'] ;
      oThis.updateIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.processing-state-icon');
      oThis.mint();
    },
  
    onRequestStakeError : function ( error ) {
      var oThis = this ;
      oThis.updateIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.updateIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.jSignClientErrorBtnWrap.show();
    },
  
    mint : function () {
      var oThis = this ;
      oThis.stakeAndMintPolling = new Polling({
        pollingApi      : oThis.mintApi ,
        pollingMethod   : "POST",
        data            : oThis.getMintData(),
        pollingInterval : 4000,
        onPollSuccess   : oThis.mintSuccess.bind( oThis ),
        onPollError     : oThis.mintError.bind( oThis )
      });
      oThis.stakeAndMintPolling.startPolling();
    },
  
    getMintData : function () {
      var oThis = this ;
      var btToMint = oThis.getBTtoMint() ,
        ostToStake = PriceOracle.btToOstPrecession( btToMint ) //As it goes to backend and comes back as is.
      ;
      return {
        'approve_transaction_hash'       : oThis.approve_transaction_hash,
        'request_stake_transaction_hash' : oThis.request_stake_transaction_hash,
        'staker_address' : oThis.getWalletAddress(),
        'fe_bt_to_mint' : btToMint ,      //JUST FOR FE
        'fe_ost_to_stake' : ostToStake    //JUST FOR FE
      }
    },
  
    mintSuccess : function ( res ) {
      var oThis = this ;
      if( res && res.success ){
        oThis.unbindBeforeUnload();
        setTimeout( function () { //Wait for atleast 0.5sec so that user can see the processing icon
          window.location = oThis.redirectRoute ;
        } , 500 );
      }else {
        oThis.stakeAndMintPolling.currentRetry++ ;
        oThis.mintError.call(oThis,  null, res );
      }
    },
  
    mintError : function (jqXhr ,  error ) {
      var oThis = this ;
      if( oThis.stakeAndMintPolling.isMaxRetries() ){
        oThis.stakeAndMintPolling.stopPolling() ;
        var errorMsg = utilities.deepGet(error, "err.display_text") ;
        if( errorMsg && errorMsg.toLowerCase() == utilities.authorizationErrMsg.toLowerCase()){ //Temp change it later.
          oThis.jTokenSetupAdminErrorModal.modal('show');
        } else {
          oThis.mintErrorUIStateUpdate( error );
        }
      }
    },
  
    mintErrorUIStateUpdate : function ( res ) {
      var oThis = this ;
      $('.jApproveTransactionHash').text( oThis.approve_transaction_hash );
      $('.jRequestStakeTransactionHash').text( oThis.request_stake_transaction_hash );
      oThis.showSection( oThis.jStakeAndMintSignServerError );
    },
  
    //Unused code below.
    
    getEthBal : function () {
      var oThis = this ;
      var walletAddress = oThis.getWalletAddress();
      oThis.defEthBal = $.Deferred();
      oThis.metamask.getBalance( walletAddress  , function ( eth ) {
        oThis.defEthBal.resolve( eth );
      });
    },
  
    getOstBal : function() {
      var oThis = this ;
      var walletAddress = oThis.getWalletAddress(),
        simpleTokenContractAddress  =   oThis.getSimpleTokenContractAddress()
      ;
      oThis.defOstBal = $.Deferred();
      oThis.metamask.balanceOf( walletAddress , simpleTokenContractAddress , function ( ost ) {
        oThis.defOstBal.resolve( ost );
      });
    },
  
    convertToBrandedTokens: function ( sucCallback ,  errCallback ) {
    
      var btToMint      = oThis.getBTtoMint() ,
        ostToStake    = PriceOracle.btToOst( btToMint ) ,
        ostToStakeWei = PriceOracle.toWei( ostToStake )
      ;
    
      var options = {
        method: 'eth_call',
        params: [
          {
            to: oThis.getBrandedTokenContractAddress(),
            data: oThis.metamask.getContractEncodedABI(oThis.getBrandedTokenContractAddress(),
              'convertToBrandedTokens', [ostToStakeWei] ,
              oThis.getBrandedTokenABI())
          }
        ]
      };
    
      oThis.metamask.sendAsync(options, function(err, result){
      
        if( err || ( result && result.error ) ){
          errCallback && errCallback( err );
        }else if( result && result.result ) {
          var btToMintHex = result.result ,
            btToMintWei = window.web3.fromWei( btToMintHex , 'wei')
          ;
          sucCallback && sucCallback( ostToStakeWei, btToMintWei )
        }
      
        err && console.error(err);
        result && console.log(result);
      
      });
    
    }
  
  };
  
  ost.stakeAndMintMetamask  = new StakeAndMintMetamask();
  
})(window , jQuery );