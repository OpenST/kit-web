(function(window, $){
  var ost = ns('ost');

  var oThis = ost.leftMenu = {

    isUserWhitelisted : false,
    isMainnetWhitelistingRequested : false,
    currentEnv : null,
    redirectMainnet : window.location.href,
    redirectSandbox : window.location.href,
    sandboxSubUrlPrefix: null,
    mainSubEnvUrlPrefix: null,
    jChangeModeToggle :  $('#switch_mode_checkbox'),

    jConfirmModeChangeModal : $('#confirm_mode_change_modal'),
    jConfirmModeChangeModalDefaultState : $('#confirm_mode_change_modal .default-state'),
    jConfirmModeChangeModalSuccessState : $('#confirm_mode_change_modal .success-state'),
    jConfirmModeChangeBtn : $('.confirm-mode-change-btn'),
    jConfirmModeChangeCheckbox : $('.confirm-mode-change-checkbox'),

    jWhitelistUserModal : $('#whitelist_user_modal'),
    jWhitelistTrueModal : $('#whitelisted-true-modal'),
    jWhitelistUserCheckbox : $('#whitelist_user_checkbox'),
    jWhitelistUserModalDefaultState : $('#whitelist_user_modal .default-state'),
    jWhitelistUserModalSuccessState : $('#whitelist_user_modal .success-state'),
    jWhitelistingRequestedText : $('.whitelisting_requested'),
    jWhitelistingNotRequestedText : $('.whitelisting_not_requested'),

    init: function( config ){
      var oThis = this;
      config = config || {};

      $.extend( oThis, config );
      oThis.bindEvents();
      //oThis.initTooltip();

      $('#whitelist_user_form').formHelper({
          success : function () {
            oThis.onRequestWhitelistUserSuccess();
          },
          error: function () {
            oThis.onRequestWhitelistUserError();
          }
      })
    },

    initTooltip: function() {
      if(!oThis.isUserWhitelisted && oThis.isMainnetWhitelistingRequested)
      {
        $('[data-toggle="tooltip"]').tooltip();
      }
    },

    bindEvents : function() {
      var oThis = this;

      oThis.jChangeModeToggle.on('click', function( event){
        oThis.sendRequestToTheTeam(event);
      });

      oThis.jConfirmModeChangeBtn.on('click', function( event ) {
        oThis.jChangeModeToggle.prop('checked', false);
        oThis.jConfirmModeChangeModal.modal('hide');
        window.location = oThis.redirectMainnet;
      });

      $('#dashboard-complete-kyc').on('click', function (event) {
        oThis.sendRequestToTheTeam(event);
      });

    },

    sendRequestToTheTeam: function( event ){
      event.preventDefault();
      if(oThis.currentEnv == oThis.sandboxSubUrlPrefix){
        if(oThis.isMainnetWhitelistingRequested) {
          oThis.jWhitelistTrueModal.modal('show');
        }else if( !oThis.isUserWhitelisted ) {
          oThis.jWhitelistUserModal.modal('show');
        } else {
          oThis.jConfirmModeChangeModal.modal('show');
        }
      } else if(oThis.currentEnv == oThis.mainSubEnvUrlPrefix){
        oThis.jChangeModeToggle.prop('checked', true);
        window.location = oThis.redirectSandbox;
      }
    },

    onRequestWhitelistUserSuccess: function(){
      // $('.switch-mode').addClass('disabled');
      // $('.switch-mode .switch').addClass('disabled');
      oThis.isMainnetWhitelistingRequested = true;
      //oThis.initTooltip();
      oThis.jWhitelistUserModalDefaultState.hide();
      oThis.jWhitelistUserModalSuccessState.show();
      oThis.jWhitelistingNotRequestedText.hide();
      oThis.jWhitelistingRequestedText.show();
      $('#dashboard-complete-kyc').hide();
    },

    onRequestWhitelistUserError: function () {

    }

  };


  })(window, jQuery);