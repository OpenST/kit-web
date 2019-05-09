;
(function (window,$) {
  
  var ost = ns("ost"),
     Polling = ost.Polling ,
     utilities = ost.utilities,
     PricerFactory = ost.PricerFactory
  ;
  
  var providerMap = {
    "metamask" : "stakeAndMintMetamask" ,
    "ost": "stakeAndMintOst"
  };

  var ostToStakeWei = null ,
      btToMintWei = null ;

  var Pricer = null;
  
  
  var oThis = ost.tokenMint = {

    //Static jQuery elements start
    jMintTokensBtn                  :   $("#mint-tokens"),
    jStakeMintStart                 :   $("#stake-mint-start"),
    jStakeMintProcess               :   $("#stake-mint-process"),
    jAddressNotWhitelistedSection   :   $('#jAddressNotWhitelistedSection') ,
    jInsufficientBalSection         :   $('#jInsufficientBalSection') ,
    jSelectedAddress                :   $("[name='staker_address']"),
    jBtToStakeCurrencyConversion    :   $('.bt_to_sc_conversion'),
    jMintSections                   :   $('.jMintSections'),
    jConfirmStakeMintForm           :   $('#stake-mint-confirm-form'),
    jGetScForm                      :   $('#get-sc-form'),
    jGetScBtn                       :   $('#get-sc-btn'),
    jTokenStakeAndMintSignSection   :   $('#jTokenStakeAndMintSignSection'),
    jSignHeaders                    :   $('.jSignHeader'),
    jAllowStakeAndMintMsgWrapper    :   $('.jAllowStakeAndMintWrapper'),
    jAutorizeStakeAndMintMsgWrapper :   $('.jAutorizeStakeAndMintWrapper'),
    jSignClientErrorBtnWrap         :   $('.jSignClientErrorBtnWrap'),
    jStakeAndMintSignServerError    :   $('#jStakeAndMintSignServerError'),
    jGoBackBtn                      :   $('.jGoBackBtn'),
    jClientRetryBtn                 :   $('.jClientRetryBtn'),
    jEtherText                      :   $('.ether-text'),
    jScText                         :   $('.sc-text'),
    jEthOstText                     :   $('.eth-sc-text'),
    jLowBal                         :   $('.low-bal'),
    jTokenSetupAdminErrorModal      :   $('#token_setup_admin_error'),
    //Static jQuery elements End

    btToMintName                    : null,
    scToStakeName                   : null,
    jBtToMintWei                    : null,
    jScToStakeWei                   : null,
  
    //Dynamic jQuery elements start
    jBtToMint                       :   null,
    //Dynamic jQuery elements start
    
    metamask                        :   null,
    walletAddress                   :   null,  //Used only for caching once approve transaction is done.
  
    //FormHelpers start
    confirmStakeMintFormHelper      :   null ,
    getScFormHelper                 :   null ,
    //FormHelpers end
    
    //Polling start
    getScPolling                   :   null,
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
    getScError                     :   'Not able to grant OST-Test right now. Please <a href="https://help.ost.com/support/home" target="_blank">contact support</a>.',
    stakeAndMintError               :   "Looks like there was an issue in the minting process, Please connect with customer support with the 2 transaction hash.",
    //General error msg end

    //Deferred Eth Bal object and Ost Bal obj
    defEthBal : null,
    defScBal : null,

    init : function (config) {
      console.log("===config====" , config );
      $.extend(oThis,config);
      oThis.initPricer( oThis.dataConfig );
      oThis.setProvider(); //Merge provider
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



    initPricer : function( config ) {
      var config = oThis.getPricerConfig();
      PricerFactory.init( config );
      Pricer = PricerFactory.getInstance( oThis.scSymbol );
    },

    getPricerConfig : function(){
      var price_points = utilities.deepGet(oThis.dataConfig, 'price_points'),
          stake_currencies = utilities.deepGet(oThis.dataConfig, 'stake_currencies'),
          mergedConfig = {}
      ;
      $.extend(true,mergedConfig,price_points,stake_currencies);
      mergedConfig[oThis.scSymbol].conversion_factor = utilities.deepGet(oThis.dataConfig, 'token.conversion_factor');
      return mergedConfig[oThis.scSymbol];
    },

    initUIValues: function() {
      oThis.jBtToMintWei    = $("[name='" + oThis.btToMintName +"']") ;
      oThis.jScToStakeWei  = $("[name='" + oThis.scToStakeName+ "']") ;
      oThis.jBtToMint = $("#"+oThis.btToMintId);
      oThis.jBtToMint.trigger('change');
      oThis.jBtToStakeCurrencyConversion.text(  oThis.getStakeCurrencyToBTConversion() );
      oThis.initConfirmStakeMintFormHelper();
      oThis.initGetScFormHelper();
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

    btToStakeCurrencySmallestUnit : function( val ){
      if(!Pricer) return val ;
      return Pricer.btToStakeCurrencyPrecision( val );
    },

    toSmallestUnit : function( val ) {
      if(!val) return;
      if(!Pricer) return val ;
      return Pricer.toSmallestUnit( val );
    },
    
    initGetScFormHelper: function () {
      oThis.getScFormHelper = oThis.jGetScForm.formHelper({
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
            scToStake = Pricer.btToStakeCurrency( bt ) ;
        if( !Pricer.isNaN( oThis.totalOST ) ) {
          oThis.updateSupplyPieChart( scToStake ) ;
        }
      } );
      
    },
    
    onWorkFlow : function ( workflowId ) {
      oThis.startGetScPolling( workflowId )
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
      var eth = utilities.deepGet( res , "data.balance.ETH"),//To ask
        ost = utilities.deepGet( res , "data.balance.OST"),
        ethBN = eth && BigNumber( eth ),
        ostBN =  ost && `ost` && BigNumber( ost ),
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
        oThis.jScText.show();
      } else{
        ost = Pricer.fromSmallestUnit( ost );
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
          scToStake = Pricer.btToStakeCurrency( btToMint );
      ;
      if( !Pricer.isNaN( ost )){
        oThis.totalOST = Number( ost );
      }
      oThis.mintDonuteChart = new GoogleCharts();
      oThis.initSupplyPieChart( scToStake );
      $('.total-ost-available').text( Pricer.toPrecisionStakeCurrency( ost ) );  //No mocker so set via precession
      var ostBalance = oThis.ostAvailableOnBtChange( btToMint ) ;
      $('.ost-mocker-value.total-ost-available').text( Pricer.toPrecisionStakeCurrency( ostBalance ) ) ;
      oThis.updateSlider( ost );
      oThis.showSection(  oThis.jStakeMintProcess ) ;
    },
  
    requestingOstUIState : function () {
      $('.jStatusWrapper').hide();
      $('.jGetOstLoaderText').show();
      //This will be handled by FormHelper , but its a common function for long polling so dont delete
      utilities.btnSubmittingState( oThis.jGetScBtn );
    } ,
  
    resetGetOstUIState: function () {
      $('.jStatusWrapper').show();
      $('.jGetOstLoaderText').hide();
      //This will be handled by FormHelper , but its a common function for long polling so dont delete
      utilities.btnSubmitCompleteState( oThis.jGetScBtn );
    },
  
  
    startGetScPolling: function ( workflowId ) {
      if( !workflowId ) return ;
      oThis.requestingOstUIState();
      var workflowApi = oThis.getWorkFlowStatusApi( workflowId )
      ;
      oThis.getScPolling = new Polling({
        pollingApi      : workflowApi ,
        pollingInterval : 4000,
        onPollSuccess   : oThis.getScPollingSuccess,
        onPollError     : oThis.getScPollingError
      });
      oThis.getScPolling.startPolling();
    },
  
    getScPollingSuccess : function( response ){
      var pollingThis = this ;
      if(response && response.success){
        if( pollingThis.isWorkflowFailed( response ) || pollingThis.isWorkflowCompletedFailed( response ) ){
          oThis.showGetScPollingError( response );
        }else if( !pollingThis.isWorkFlowInProgress( response ) ){
          pollingThis.stopPolling();
          oThis.checkForBal();
        }
      }else {
        oThis.showGetScPollingError( response );
      }
    },
  
    getScPollingError : function( jqXhr , error  ){
      var pollingThis = this ;
      if( pollingThis.isMaxRetries() ){
        oThis.showGetScPollingError( error );
      }
    },
  
    showGetScPollingError : function ( res ) {
      oThis.getScPolling.stopPolling();
      utilities.showGeneralError( oThis.jGetScForm ,  res ,  oThis.getScError  );
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
      if(!Pricer) return;
      if( Pricer.isNaN( oThis.totalOST )) {
        return val ;
      }
      var scToStake = Pricer.btToStakeCurrency( val ) ;
      if( Pricer.isNaN( scToStake )) {
        return oThis.totalOST  ;
      }
      scToStake = Number( scToStake ) ;

      var ostAvailable = oThis.totalOST - scToStake;

      if( ostAvailable < 0 ){
        return 0 ;
      }
      
      return ostAvailable  ;
    },

    btToStakeCurrencyWei : function ( val ) {
      if(!Pricer) return;
      return Pricer.toSmallestUnit( Pricer.btToStakeCurrency( val ));
    },
  
    getMinETHRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "min_balances.ETH" );
    },
    
    getMinOstRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "min_balances.OST" );
    },

    getStakeCurrencyToBTConversion : function () {
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
  
    getMaxBTToMint : function ( val ) {
      if(!Pricer) return;
      return Pricer.stakeCurrencyToBt(val );  //Mocker will take care of precision
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
      oThis.jScToStakeWei.val( val );
    },

    getOstToStakeWei: function(  ){
      return oThis.jScToStakeWei.val( );
    },

    setBtToMintWei: function( val ){
      oThis.jBtToMintWei.val( val );
    },

    getBtToMintWei: function(  ){
      return  oThis.jBtToMintWei.val( );
    },
  
    btToFiat : function (val) {
      if(!Pricer) return val;
      return Pricer.btToFiat( val ) ;  //Mocker will take care of precision
    },

    showSection : function( jSection ){
      oThis.jMintSections.hide();
      jSection.show();
    },
  
    updateSupplyPieChart: function (  scToStake ) {
      if( !oThis.mintDonuteChart ) return ;
      
      scToStake = scToStake && Number(scToStake) || 0;
    
      if( scToStake < 0 ) {
        scToStake = 0 ;
      }
      
      var ostAvailable  = oThis.totalOST -  scToStake  ;

      if( ostAvailable < 0){
        ostAvailable = 0;
      }

      var data = [
        ['Type', 'Tokens'],
        ['OSTStaked', scToStake],
        ['OSTAvailable', ostAvailable]
      ];
     oThis.mintDonuteChart.draw({
        data : data
      });
    },
    
    initSupplyPieChart: function( scToStake  ){
      
      scToStake    = ost && Number( scToStake ) || 0 ;
      
      var ostAvailable  = oThis.totalOST -  scToStake  ;
      oThis.mintDonuteChart.draw({
        data: [
          ['Type', 'Tokens'],
          ['OSTStaked', scToStake],
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