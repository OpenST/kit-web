;
(function (window, $) {
  
  var ost = ns("ost"),
    formHelper = window.FormHelper.prototype,
    redirectMap = window.redirectMap,
    utilities = ns('ost.utilities')
  ;
  
  var oThis = ost.tokenSetup = {
    
    jTokenForm: $('#economy-planner'),
    jConfirmAccountCover: $('#metamaskConfirmAccount'),
    jDefaultStateWrapper: $('#default-state-wrapper'),
    jGeneralErrorState: $('#general-error-state'),
    jRejectedSignErrorState: $('#rejected-sign-error-state'),
    jAssociateAddressErrorState: $('#associate-address-error-state'),
    jConfirmAccountSection: $('.confirm-account-section'),
    jDeploymentErrorState: $('#deployment-error-state'),
    jTokenSetupAdminErrorModal: $('#token_setup_admin_error'),
    
    
    jTokenSetupOstBtn : null,
    jMetamaskConfirmAddressBtn : null ,
  
    addressGenerationApi: null,
    addressesEndPoint: null,
    deploymentEndpoint: null,
    deployRoute: null,
  
    metamask: null,
    walletAssociation: null,
    chainId: null,
  
    ost_to_fiat: null,
    ost_to_bt: null,
    ostToBtId: null,
    
    isMainnet: null,
    
    
    init: function (config) {
      $.extend(oThis, config);
      oThis.bindActions();
      oThis.jTokenForm.formHelper().success = oThis.tokenSuccess;
      PriceOracle.init({
        'ost_to_fiat': config['ost_to_fiat'],  //TODO change for stable coin
        'ost_to_bt': config['ost_to_bt'],      //TODO change for stable coin
        'P_FIAT': 5
      });
      oThis.initDisplayFiatValue();
    },
    
    bindActions: function () {
      
      $("#advance-options-accordion").on('show.bs.collapse', function () {
        $(".slider-recommendation").hide();
        $(".header-recommendation").show();
      });
      
      $('#mm-reconnect').off('click').on('click', function () {
        oThis.metamask.enable();
      });
      
    },
    
    btToFiat: function (conversionFactor) {
      if (!conversionFactor || !BigNumber) return conversionFactor;
      conversionFactor = BigNumber(conversionFactor);
      var fiatBN = BigNumber(oThis.ost_to_fiat),
        oneBTToFiat = fiatBN.dividedBy(conversionFactor)
      ;
      return PriceOracle.toFiat(oneBTToFiat);
    },
    
    initDisplayFiatValue: function () {
      var jEL = $('.j-bt-to-fiat-val'),
        jInputEl = $('#' + oThis.ostToBtId),
        val = jInputEl.val(),
        btFiatVal = PriceOracle.btToFiatPrecession(1),
        ostFiatVal = PriceOracle.ostToFiat(1)
      ;
      ostFiatVal = PriceOracle.toPrecessionFiat(ostFiatVal);
      jEL.data("ost-mock-element", "#" + oThis.ostToBtId);
      jEL.ostMocker();
      jEL.text(btFiatVal);
      $('.j-fiat-value').text(ostFiatVal);
    },
    
    tokenSuccess: function (res) {
      if (res.success) {
        oThis.initTokenSetupFlow();
      } else {
        oThis.tokenSetUpNonAdminError( res ) ;
      }
    },
  
    initTokenSetupFlow : function (  ) {
      if ( oThis.isMainnet ) {
        oThis.initMainnetFlow();
      } else {
        oThis.initTestnetFlow();
      }
    },
    
    initMainnetFlow: function () {
      oThis.initMetamask();
    },
    
    initTestnetFlow: function () {
      oThis.showTestnetTokenSetupCover();
      oThis.bindTestnetFlow();
    },
    
    showTestnetTokenSetupCover: function () {
      ost.coverElements.show("#token-setup-option-cover");
    },
    
    bindTestnetFlow: function () {
      oThis.jTokenSetupOstBtn = $('#jTokenSetupOstBtn');
     
      oThis.jTokenSetupOstBtn.on('click', function () {
        oThis.tokenSetupViaOst();
      });
      
      $('#jTokenSetupMetamaskBtn').on('click', function () {
        oThis.tokenSetupViaMetamask();
      });
    },
    
    tokenSetupViaOst: function () {
      oThis.generateAddress();
    },
  
    generateAddress : function () {
      $.ajax({
        url: oThis.addressGenerationApi,
        method: 'POST',
        beforeSend: function () {
          utilities.btnSubmittingState( oThis.jTokenSetupOstBtn );
        },
        success: function ( res ) {
          if( res && res.success ){
            oThis.onAddressGenerationSuccess( res );
          }else {
            oThis.onTokenDeploymentErrorViaOst( res );
          }
        },
        error: function ( jqXHr , err ) {
          oThis.onTokenDeploymentErrorViaOst( err );
        }
      })
    },
  
    onAddressGenerationSuccess : function ( res ) {
      oThis.startTokenDeployment( oThis.jTokenSetupOstBtn ,  oThis.onTokenDeploymentErrorViaOst.bind( oThis ));
    },
  
    onTokenDeploymentErrorViaOst : function ( err  ) {
      utilities.btnSubmitCompleteState( oThis.jTokenSetupOstBtn  );
      if( !oThis.tokenSetUpNonAdminError( err )){
        utilities.showGeneralError( $('.jTokenSetupViaOstWrapper') , err );
      }
    },
    
    tokenSetupViaMetamask: function () {
      oThis.initMetamask();
    },
    
    initMetamask: function () {
      oThis.setupMetamask();
      oThis.metamask.enable();
    },
  
    onMetamaskValidationSuccess: function () {
      oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.getWalletAddress());
      oThis.personalSign(oThis.walletAssociation);
    },
    
    personalSign: function (message) {
      if (!message) return;
      
      oThis.jConfirmAccountSection.hide();
      oThis.jDefaultStateWrapper.show();
      
      var from = oThis.metamask.getWalletAddress();
      
      oThis.jMetamaskConfirmAddressBtn = oThis.jConfirmAccountCover.find(".btn-confirm") ;
      
      oThis.jMetamaskConfirmAddressBtn.off('click').on('click', function (e) {
        utilities.btnSubmittingState( oThis.jMetamaskConfirmAddressBtn );
        oThis.metamask.sendAsync({
          method: 'personal_sign',
          params: [message, from],
          from: from
        }, function (err, result) {
          if(err){
            return oThis.showConfirmError(oThis.jGeneralErrorState);
          }
          if(result && result.error){
            return oThis.showConfirmError(oThis.jRejectedSignErrorState);
          } else {
            oThis.associateAddress(result);
          }
          oThis.associateAddress(result);
        });
      });
    },
    
    personalSignError : function ( ) {
      utilities.btnSubmitCompleteState( oThis.jMetamaskConfirmAddressBtn );
      oThis.showConfirmError(oThis.jGeneralErrorState);
    },
    
    associateAddress: function (result) {
      if (!result) return;
      oThis.jConfirmAccountSection.hide();
      oThis.jDefaultStateWrapper.show();
      var from = oThis.metamask.getWalletAddress();
      
      $.ajax({
        url: oThis.addressesEndPoint,
        method: 'POST',
        data: {
          owner: from,
          personal_sign: result.result
        },
        success: function (response) {
          if (response.success) {
            oThis.startTokenDeployment( oThis.jMetamaskConfirmAddressBtn , oThis.onTokenDeploymentRequestError.bind(oThis) );
          } else {
            var errorData = utilities.deepGet(response, "err.error_data") || [];
            utilities.btnSubmitCompleteState( oThis.jMetamaskConfirmAddressBtn );
            if (errorData.length > 0) {
              oThis.showConfirmError(oThis.jAssociateAddressErrorState);
            } else {
              oThis.showConfirmError(oThis.jGeneralErrorState);
            }
          }
        },
        error: function (response) {
          utilities.btnSubmitCompleteState( oThis.jMetamaskConfirmAddressBtn );
          oThis.showConfirmError(oThis.jGeneralErrorState);
        }
      });
    },
  
    startTokenDeployment : function ( jBtn , errorCallback) {
      $.ajax({
        url: oThis.deploymentEndpoint,
        method: 'POST',
        success: function (response) {
          if( response && response.success ){
            oThis.onTokenDeploymentRequestSuccess( response );
          }else {
            utilities.btnSubmitCompleteState( jBtn );
            errorCallback( response  );
          }
        },
        error: function (jQXhr , error ) {
          utilities.btnSubmitCompleteState( jBtn );
          errorCallback( error  );
        }
      })
    },
    
    onTokenDeploymentRequestSuccess : function ( response ) {
      var byScreenName = utilities.deepGet(response, "go_to.by_screen_name");
      if (byScreenName) {
        window.location = redirectMap && redirectMap[byScreenName]
      }
      else {
        window.location = oThis.deployRoute;
      }
    },
  
    onTokenDeploymentRequestError : function ( response ) {
      var errorData = utilities.deepGet(response, "err.error_data");
      if ( errorData.length > 0) {
        oThis.showConfirmError( oThis.jDeploymentErrorState )
      }
      else {
        if( !oThis.tokenSetUpNonAdminError( response )){
          oThis.showConfirmError( oThis.jGeneralErrorState );
        }
      }
    },
    
    showConfirmError: function (errorContext) {
      utilities.btnSubmitCompleteState( oThis.jMetamaskConfirmAddressBtn );
      oThis.jConfirmAccountSection.hide();
      errorContext.show();
    },
    
    setupMetamask: function () {
      
      oThis.metamask = new Metamask({
        desiredNetwork: oThis.chainId,
        
        onNotDapp: function () {
          ost.coverElements.show("#installMetamaskCover");
        },
        
        onNotMetamask: function () {
          ost.coverElements.show("#installMetamaskCover");
        },
        
        onWaitingEnable: function () {
          ost.coverElements.show("#metamaskLockedCover");
        },
        
        onUserRejectedProviderAccess: function () {
          ost.coverElements.show("#metamaskConnectRequestRejected");
        },
        
        onNotDesiredNetwork: function () {
          ost.coverElements.show("#metamaskWrongNetworkCover");
        },
        
        onNotDesiredAccount: function () {
          ost.coverElements.show("#metamaskWrongAccountCover");
        },
        
        onDesiredAccount: function () {
          ost.coverElements.show("#metamaskSignTransaction");
        },
        
        onNewAccount: function () {
          oThis.onMetamaskValidationSuccess();
          ost.coverElements.show("#metamaskConfirmAccount");
        },
        
        onSendAsync: function (options, err, result) {
          if (!err && !result) {
            ost.coverElements.show("#process_failure_error_cover");
          }
        }
        
      });
    },
  
    tokenSetUpNonAdminError: function (res ) {
      var errorMsg = utilities.deepGet(res, "err.display_text");
      if (errorMsg && errorMsg.toLowerCase() == utilities.authorizationErrMsg.toLowerCase()) {
        oThis.jTokenSetupAdminErrorModal.modal('show');
        return true ;
      }
      return false ;
    }
    
  };
  
  
})(window, jQuery);