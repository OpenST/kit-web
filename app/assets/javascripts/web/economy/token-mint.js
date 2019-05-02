;
(function (window,$) {
  
  var ost = ns("ost"),
     Polling = ost.Polling ,
     utilities = ost.utilities
  ;
  
  var providerMap = {
    "metamask" : "stakeAndMintMetamask" ,
    "ost": "stakeAndMintOst"
  };

  var ostToStakeWei = null ,
      btToMintWei = null ;
  
  
  var oThis = ost.tokenMint = {

    //Static jQuery elements start
    jMintTokensBtn                  :   $("#mint-tokens"),
    jStakeMintStart                 :   $("#stake-mint-start"),
    jStakeMintProcess               :   $("#stake-mint-process"),
    jAddressNotWhitelistedSection   :   $('#jAddressNotWhitelistedSection') ,
    jInsufficientBalSection         :   $('#jInsufficientBalSection') ,
    jSelectedAddress                :   $("[name='staker_address']"),
    jBtToOstConversion              :   $('.bt_to_ost_conversion'),
    jMintSections                   :   $('.jMintSections'),
    jConfirmStakeMintForm           :   $('#stake-mint-confirm-form'),
    jGetOstForm                     :   $('#get-ost-form'),
    jGetOstBtn                      :   $('#get-ost-btn'),
    jTokenStakeAndMintSignSection   :   $('#jTokenStakeAndMintSignSection'),
    jSignHeaders                    :   $('.jSignHeader'),
    jAllowStakeAndMintMsgWrapper    :   $('.jAllowStakeAndMintWrapper'),
    jAutorizeStakeAndMintMsgWrapper :   $('.jAutorizeStakeAndMintWrapper'),
    jSignClientErrorBtnWrap         :   $('.jSignClientErrorBtnWrap'),
    jStakeAndMintSignServerError    :   $('#jStakeAndMintSignServerError'),
    jGoBackBtn                      :   $('.jGoBackBtn'),
    jClientRetryBtn                 :   $('.jClientRetryBtn'),
    jEtherText                      :   $('.ether-text'),
    jOstText                        :   $('.ost-text'),
    jEthOstText                     :   $('.eth-ost-text'),
    jLowBal                         :   $('.low-bal'),
    jTokenSetupAdminErrorModal      :   $('#token_setup_admin_error'),
    //Static jQuery elements End

    btToMintName                    : null,
    ostToStakeName                  : null,
    jBtToMintWei                    : null,
    jOstToStakeWei                  : null,
  
    //Dynamic jQuery elements start
    jBtToMint                       :   null,
    //Dynamic jQuery elements start
    
    metamask                        :   null,
    walletAddress                   :   null,  //Used only for caching once approve transaction is done.
  
    //FormHelpers start
    confirmStakeMintFormHelper      :   null ,
    getOstFormHelper                :   null ,
    //FormHelpers end
    
    //Polling start
    getOstPolling                   :   null,
    stakeAndMintPolling             :   null,
    //Polling end
  
    //Backend required data with key name start
    approve_transaction_hash        :   null,
    request_stake_transaction_hash  :   null,
    //Backend required data with key name end
    
    //Data from backend start
    mintApi : null,
    workFlowStatusApi: null,
    getBalanceApi : null,
    fetchBalanceCurrencies : null,
    
    chainId : null,
    redirectRoute : null,
    dataConfig: null,
    btToMintId: null,
    isSuperAdmin: false,
    keyProvider : null,
    //Data from backend end
  
    //General error msg start
    genericErrorMessage             :   'Something went wrong!',
    getOstError                     :   'Not able to grant OST-Test right now. Please <a href="https://help.ost.com/support/home" target="_blank">contact support</a>.',
    stakeAndMintError               :   "Looks like there was an issue in the minting process, Please connect with customer support with the 2 transaction hash.",
    //General error msg end

    //Deferred Eth Bal object and Ost Bal obj
    defEthBal : null,
    defOstBal : null,

    init : function (config) {
      console.log("===config====" , config );
      $.extend(oThis,config);
      oThis.setProvider(); //Merge provider
      oThis.initPriceOracle();
      oThis.initUIValues();
      oThis.bindEvents();
      oThis.initFlow()
    },
    
    setProvider : function () {
      var providerName = providerMap[oThis.keyProvider],
          provider = ost[ providerName ] ;
      $.extend(true, oThis, provider );
    },
  
    /*********************************************************************************************************
     *                                  NOTE IMPORTANT : Interface declaration start                         *
     *********************************************************************************************************/
    
      initFlow : function () {
        console.error("No provider specified");
      },
    
      onMintToken: function () {
        console.error("No provider specified");
      },
    
      getWalletAddress : function () {
        console.error("No provider specified");
      },
    
      onConfirmStakeMintSuccess : function ( res ) {
        console.error("No provider specified");
      },
      
      mint: function () {
        console.error("No provider specified");
      },
    
      getMintData : function () {
        console.error("No provider specified");
      },
    
      mintSuccess : function () {
        console.error("No provider specified");
      },
    
      mintError : function () {
        console.error("No provider specified");
      },
    
    /*********************************************************************************************************
     *                                  NOTE IMPORTANT : Interface declaration end                           *
     *********************************************************************************************************/
    
    initPriceOracle : function ( ) {
      PriceOracle.init({
        "ost_to_fiat" : oThis.getPricePoint() ,
        "ost_to_bt"   : oThis.getOstToBTConversion()
      });
    },
    
    initUIValues: function() {
      oThis.jBtToMintWei    = $("[name='" + oThis.btToMintName +"']") ;
      oThis.jOstToStakeWei  = $("[name='" + oThis.ostToStakeName+ "']") ;
      oThis.jBtToMint = $("#"+oThis.btToMintId);
      oThis.jBtToMint.trigger('change');
      oThis.jBtToOstConversion.text(  oThis.getOstToBTConversion() );
      oThis.initConfirmStakeMintFormHelper();
      oThis.initGetOstFormHelper();
    },
    
    initConfirmStakeMintFormHelper : function () {
      oThis.confrimStakeMintFormHelper = oThis.jConfirmStakeMintForm.formHelper({
        success: function (  res ) {
          if( res.success  ){
            oThis.onConfirmStakeMintSuccess( res ) ;
          }
        }
      });
    },
    
    initGetOstFormHelper: function () {
      oThis.getOstFormHelper = oThis.jGetOstForm.formHelper({
        beforeSend : function () {
         oThis.requestingOstUIState();
        },
        success: function ( res ) {
          if( res.success ){
            var workflowId = utilities.deepGet( res , "data.workflow.id") ;
            setTimeout( function () {
              oThis.onWorkFlow( workflowId );
            }, 0 );
          }else {
            oThis.resetGetOstUIState( res );
          }
        },
        error: function ( jqXhr , error ) {
         oThis.resetGetOstUIState( error );
        }
      });
    },
  
    bindEvents : function () {
      
      oThis.jMintTokensBtn.off('click').on("click",function () {
        if(oThis.isSuperAdmin) {
            utilities.btnSubmittingState($(this));
            oThis.onMintToken();
        } else {
            oThis.jTokenSetupAdminErrorModal.modal('show');
        }
      });
      
      oThis.jGoBackBtn.off('click').on('click' , function () {
        oThis.showSection( oThis.jStakeMintProcess );
      });

      $('#'+oThis.btToMintId).on( 'keyup change' ,function () {
        var bt = $(this).val(),
            ostToStake = PriceOracle.btToOst( bt ) ;
        if( !PriceOracle.isNaN( oThis.totalOST ) ) {
          oThis.updateSupplyPieChart( ostToStake ) ;
        }
      } );
      
    },
    
    onWorkFlow : function ( workflowId ) {
      oThis.startGetOstPolling( workflowId )
    },
  
    setStakerAddress : function (  ) {
      var selectedAddress = oThis.getWalletAddress() ;
      oThis.jSelectedAddress.setVal( selectedAddress );
    },

    checkForBal: function () {
      oThis.resetGetOstUIState();
      $.ajax({
        url: oThis.getBalanceApi,
        method: 'GET',
        data: {
          "address" : oThis.getWalletAddress(),
          "currencies": JSON.parse(oThis.fetchBalanceCurrencies)
        },
        success: function ( res ) {
         if( res && res.success){
           oThis.checkForBalSuccess( res );
           return ;
         }
          oThis.checkForBalError();
        },
        error: function ( jqXHr , err ) {
         //TODO Dont know what to do.
        },
        complete : function () {
         utilities.btnSubmitCompleteState(  oThis.jMintTokensBtn );
        }
      });
    },
  
    checkForBalSuccess : function( res ) {
      var eth = utilities.deepGet( res , "data.balance.OST"),
        ost = utilities.deepGet( res , "data.balance.OST"),
        ethBN = eth && BigNumber( eth ),
        ostBN =  ost && ost && BigNumber( ost ),
        minETHRequire = oThis.getMinETHRequired(),
        minOstRequire = oThis.getMinOstRequired(),
        lowEth = !ethBN ||  ethBN.isLessThan( minETHRequire ),
        lowOst = !ostBN || ostBN.isLessThan( minOstRequire )
      ;

      if( lowEth || lowOst ){
        oThis.jLowBal.hide();
        oThis.showSection(  oThis.jInsufficientBalSection ) ;
      }

      if( lowEth && lowOst ) {
        oThis.jEthOstText.show();
      } else if( lowEth ) {
        oThis.jEtherText.show();
      } else if( lowOst ) {
        $('.buy-ost-btn').show();
        oThis.jOstText.show();
      } else{
        ost = PriceOracle.fromWei( ost );
        oThis.onValidationComplete( ost );
      }
    },
  
    checkForBalError : function ( error ) {
      //DOnt know what to do.
    },
   

    /*********************************************************************************************************
     *       NOTE IMPORTANT : OST PASSED AFTER VALIDATION ON BALANCE IS NOT IN WEI , ITS ABSOLUTE VALUE      *
     *********************************************************************************************************/
  
    onValidationComplete : function ( ost ) {
      var btToMint = oThis.getBTtoMint() ,
          ostToStake = PriceOracle.btToOst( btToMint );
      ;
      if( !PriceOracle.isNaN( ost )){
        oThis.totalOST = Number( ost );
      }
      oThis.mintDonuteChart = new GoogleCharts();
      oThis.initSupplyPieChart( ostToStake );
      $('.total-ost-available').text( PriceOracle.toPrecessionOst( ost ) );  //No mocker so set via precession
      var ostBalance = oThis.ostAvailableOnBtChange( btToMint ) ;
      $('.ost-mocker-value.total-ost-available').text( PriceOracle.toPrecessionOst( ostBalance ) ) ;
      oThis.updateSlider( ost );
      oThis.showSection(  oThis.jStakeMintProcess ) ;
    },
  
    requestingOstUIState : function () {
      $('.jStatusWrapper').hide();
      $('.jGetOstLoaderText').show();
      //This will be handled by FormHelper , but its a common function for long polling so dont delete
      utilities.btnSubmittingState( oThis.jGetOstBtn );
    } ,
  
    resetGetOstUIState: function () {
      $('.jStatusWrapper').show();
      $('.jGetOstLoaderText').hide();
      //This will be handled by FormHelper , but its a common function for long polling so dont delete
      utilities.btnSubmitCompleteState( oThis.jGetOstBtn );
    },
  
  
    startGetOstPolling: function ( workflowId ) {
      if( !workflowId ) return ;
      oThis.requestingOstUIState();
      var workflowApi = oThis.getWorkFlowStatusApi( workflowId )
      ;
      oThis.getOstPolling = new Polling({
        pollingApi      : workflowApi ,
        pollingInterval : 4000,
        onPollSuccess   : oThis.getOstPollingSuccess,
        onPollError     : oThis.getOstPollingError
      });
      oThis.getOstPolling.startPolling();
    },
  
    getOstPollingSuccess : function( response ){
      var pollingThis = this ;
      if(response && response.success){
        if( pollingThis.isWorkflowFailed( response ) || pollingThis.isWorkflowCompletedFailed( response ) ){
          oThis.showGetOstPollingError( response );
        }else if( !pollingThis.isWorkFlowInProgress( response ) ){
          pollingThis.stopPolling();
          oThis.checkForBal();
        }
      }else {
        oThis.showGetOstPollingError( response );
      }
    },
  
    getOstPollingError : function( jqXhr , error  ){
      var pollingThis = this ;
      if( pollingThis.isMaxRetries() ){
        oThis.showGetOstPollingError( error );
      }
    },
  
    showGetOstPollingError : function ( res ) {
      oThis.getOstPolling.stopPolling();
      utilities.showGeneralError( oThis.jGetOstForm ,  res ,  oThis.getOstError  );
      oThis.resetGetOstUIState();
    },
    
    updateSlider : function ( ost ) {
      var maxBT = oThis.getMaxBTToMint( ost ),
          jSlider = oThis.jBtToMint.closest( '.form-group' ).find('#'+oThis.btToMintId+"_slider")
      ;
      oThis.jBtToMint.attr("max" , maxBT );
      jSlider.slider({"max" : maxBT }) ;
    },
  
    ostAvailableOnBtChange : function ( val ) {
      if( PriceOracle.isNaN( oThis.totalOST )) {
        return val ;
      }
      var ostToStake = PriceOracle.btToOst( val ) ;
      if( PriceOracle.isNaN( ostToStake )) {
        return oThis.totalOST  ;
      }
      ostToStake = Number( ostToStake ) ;

      var ostAvailable = oThis.totalOST - ostToStake;

      if( ostAvailable < 0 ){
        return 0 ;
      }
      
      return ostAvailable  ;
    },
  
    btToOstWei : function ( val ) {
      return PriceOracle.toWei( PriceOracle.btToOst( val ));
    },
  
    getMinETHRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "min_eth_required" );
    },
    
    getMinOstRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "min_ost_required" );
    },
    
    getPricePoint : function () {
      return utilities.deepGet( oThis.dataConfig , "price_points.OST.USD" ) ;
    },
    
    getOstToBTConversion : function () {
      return  utilities.deepGet( oThis.dataConfig , "token.conversion_factor" ) ;
    },
  
    getSimpleTokenABI : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.simple_token.abi" );
    },
  
    getSimpleTokenContractAddress : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.simple_token.address" );
    },
  
    getBrandedTokenABI : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.branded_token.abi" );
    },
  
    getBrandedTokenContractAddress : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.branded_token.address" );
    },
  
    getGatewayComposerDetails  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails" ) ;
    },
  
    getGatewayComposerTxParams: function(){
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.request_stake_tx_params" ) ;
    },
  
    getGatewayComposerContractAddress  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.contract_details.gateway_composer.address" ) ;
    },
  
    getGatewayComposerABI  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.contract_details.gateway_composer.abi" ) ;
    },
  
    getSimpleTokenContractGas : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.simple_token.gas.approve" );
    },
  
    getGatewayComposerContractGas : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.contract_details.gateway_composer.gas.requestStake" ) ;
    },
  
    getGasPrice : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.gas_price" );
    },
  
    getWhitelistedAddress : function () {
      var whitelistedAddress = utilities.deepGet( oThis.dataConfig , "origin_addresses.whitelisted") ;
      if( whitelistedAddress && whitelistedAddress instanceof Array ){
        whitelistedAddress = whitelistedAddress &&  whitelistedAddress.map( function ( a ) {
          return typeof a == "string" ? a.toLowerCase() : a ;
        });
      }
      return whitelistedAddress ;
    },
    
    getDesiredAccount : function () {
      var whitelistedAddresses = oThis.getWhitelistedAddress();
      return whitelistedAddresses && whitelistedAddresses[ 0 ] ; //For now considering owner address as whitelisted address
    },
    
    getWorkflowId : function () {
      return utilities.deepGet( oThis.dataConfig , "workflow.id" ) ;
    },
  
    getMaxBTToMint : function ( ost ) {
      return PriceOracle.ostToBt(ost );  //Mocker will take care of precession
    },
    
    getWorkFlowStatusApi : function ( id ) {
      id = id || oThis.getWorkflowId();
      return oThis.workFlowStatusApi + "/" + id ;
    },
    
    getBTtoMint: function () {
      return oThis.jBtToMint.val();
    },
    
    setDataInDataConfig : function ( key , data ) {
      if( !key ) return ;
      oThis.dataConfig[ key  ] = data ;
    },

    setOstToStakeWei: function( val ){
      oThis.jOstToStakeWei.val( val );
    },

    getOstToStakeWei: function(  ){
      return oThis.jOstToStakeWei.val( );
    },

    setBtToMintWei: function( val ){
      oThis.jBtToMintWei.val( val );
    },

    getBtToMintWei: function(  ){
      return  oThis.jBtToMintWei.val( );
    },
  
    btToFiat : function (val) {
      return PriceOracle.btToFiat( val ) ;  //Mocker will take care of precession
    },

    showSection : function( jSection ){
      oThis.jMintSections.hide();
      jSection.show();
    },
  
    updateSupplyPieChart: function (  ostToStake ) {
      if( !oThis.mintDonuteChart ) return ;
      
      ostToStake = ostToStake && Number(ostToStake) || 0;
    
      if( ostToStake < 0 ) {
        ostToStake = 0 ;
      }
      
      var ostAvailable  = oThis.totalOST -  ostToStake  ;

      if( ostAvailable < 0){
        ostAvailable = 0;
      }

      var data = [
        ['Type', 'Tokens'],
        ['OSTStaked', ostToStake],
        ['OSTAvailable', ostAvailable]
      ];
     oThis.mintDonuteChart.draw({
        data : data
      });
    },
    
    initSupplyPieChart: function( ostToStake  ){
      
      ostToStake    = ost && Number( ostToStake ) || 0 ;
      
      var ostAvailable  = oThis.totalOST -  ostToStake  ;
      oThis.mintDonuteChart.draw({
        data: [
          ['Type', 'Tokens'],
          ['OSTStaked', ostToStake],
          ['OSTAvailable', ostAvailable]
        ],
        selector: '#ostSupplyInAccountPie',
        type: 'PieChart',
        options: {
          title: 'OST SUPPLY IN ACCOUNT',
          pieHole: 0.7,
          pieSliceText: 'none',
          pieSliceBorderColor: 'none',
          colors: ['88c7ca', '34445b'],
          backgroundColor: 'transparent',
          enableInteractivity: false,
          legend: 'none',
          chartArea: {
            width  : 180,
            height : 180,
            top    : 10,
            left   : 10
          },
          animation  : {
            startup  : true,
            easing   : "out",
            duration : 300
          }
        }
      })
    },
  
    updateIconState: function (jWrapper ,  sSelector  ) {
      if(!jWrapper) return ;
      jWrapper = jWrapper ;
      jWrapper.find('.state-icon').hide();
      jWrapper.find( sSelector ).show();
    },
  
    bindBeforeUnload : function( bindLoad ){
      $(window).on("beforeunload",function(event) {
        return "There are unsaved changes made to this page." ;
      });
    },
  
    unbindBeforeUnload : function () {
      $(window).off("beforeunload");
    },
  
    resetState : function () {
      oThis.updateIconState( $('.jMintMsgWrapper'),  '.pre-state-icon');
      oThis.jSignClientErrorBtnWrap.hide();
    }
    
  }

})(window,jQuery);