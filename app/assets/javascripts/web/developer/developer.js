;
(function (window, $) {
  var ost = ns("ost") ,
    utilities = ns('ost.utilities')
  ;

  var oThis = ost.developer = {

    sGenerateKeyBtn           : '.generate-key-btn',
    sGenerateWebhookSecretBtn : '.generate-webhook-secret-btn',
    sDeleteKey                : '.api-delete-btn',
    jGenerateKeyBtn           : $('.generate-key-btn') ,
    jShowKeyBtn               : $('.show-keys-btn'),
    jGenerateWebhookSecretBtn : $('.generate-webhook-secret-btn'),
    jShowWebhookSecretBtn     : $('.show-webhook-secret-btn'),
    jKeysWrapper              : $('.keys-wrapper'),
    jWSecretsWrapper          : $('.w-secrets-wrapper'),
    jMainContainer            : $('.developers-container'),
    jGenerateErr              : $('.generate-key-error'),
    jGenerateWSErr            : $('.generate-w-secrets-error'),
    jResendLink               : $('.resend-btn'),
    jEmailSentWrapper         : $('.email-sent-wrapper'),
    jDeleteErr                : null,
    keys                      : null,
    webhookSecret             : null,

    jTokenSetupAdminErrorModal  :  $('#token_setup_admin_error'),


    init: function( config ){
      config = config || {};

      $.extend( oThis, config );
      oThis.bindEvents();
    },

    bindEvents: function() {

      oThis.jShowKeyBtn.on('click',function( e ){
        e.stopPropagation();
        utilities.btnSubmittingState( $(this) );
        oThis.showKeys();
      });

      oThis.jMainContainer.on('click', oThis.sGenerateKeyBtn ,function( e ){
        e.stopPropagation();
        oThis.generateKeys();
      });

      oThis.jKeysWrapper.on('click',oThis.sDeleteKey,function( e ){
        e.stopPropagation();
        oThis.jDeleteErr = $(this).closest('.dev-container-box').find('.delete-key-error');
        oThis.deleteAPIKey();
      });

      oThis.jResendLink.on('click',function( e ){
        e.stopPropagation();
        oThis.resendEmail();
      });

      oThis.jShowWebhookSecretBtn.on('click',function( e ){
        e.stopPropagation();
        utilities.btnSubmittingState( $(this) );
        oThis.showWebhookSecrets();
      });

      oThis.jMainContainer.on('click', oThis.sGenerateWebhookSecretBtn ,function( e ){
        e.stopPropagation();
        oThis.generateWebhookSecret();
      });
      oThis.jWSecretsWrapper.on('click', oThis.sDeleteKey, function( e ){
        e.stopPropagation();
        oThis.jDeleteErr = $(this).closest('.dev-container-box').find('.delete-key-error');
        oThis.devContainerBox = $(this).closest('.dev-container-box');
        oThis.deleteWebhookSecret();
      });

    },

    showKeys: function(){
      $.ajax({
        url       : oThis.api_get_key,
        method    : 'GET',
        success   : function ( response ) {
          if( response.success ){
            oThis.keys = response.data && response.data['api_keys'];
            var email_already_sent_flag = response.data && response.data['email_already_sent_flag'];
            if(email_already_sent_flag) {
              oThis.jEmailSentWrapper.show();
            }
            oThis.onSuccess();
          }else {
            oThis.onError( response , oThis.jGenerateErr );
          }
        },
        error     : function ( err ) {
          oThis.onError( err , oThis.jGenerateErr );
        },
        complete  : function () {
          utilities.btnSubmitCompleteState( oThis.jShowKeyBtn );
        }
      });
    },

    generateKeys: function(){

      utilities.btnSubmittingState( oThis.jGenerateKeyBtn );

      $.ajax({
        url       : oThis.api_get_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.success ) {
            oThis.keys = utilities.deepGet(response, "data.api_keys") ;
            oThis.onSuccess();
          } else {
            var errorMsg = utilities.deepGet(response, "err.display_text") ;
            if( errorMsg && errorMsg.toLowerCase() == utilities.authorizationErrMsg.toLowerCase() ){ //Temp change it later.
              oThis.jTokenSetupAdminErrorModal.modal('show');
            }
            oThis.onError( response , oThis.jGenerateErr );
          }
        },
        error     : function ( err ) {
          oThis.onError( err , oThis.jGenerateErr );
        },
        complete  : function () {
         utilities.btnSubmitCompleteState( oThis.jGenerateKeyBtn );
        }
      });
    },

    deleteAPIKey: function(){
      $.ajax({
        url       : oThis.api_delete_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.success ) {
            oThis.keys = utilities.deepGet(response, "data.api_keys") ;
            oThis.onSuccess();
          } else {
            var errorMsg = utilities.deepGet(response, "err.display_text") ;
            if( errorMsg && errorMsg.toLowerCase() == utilities.authorizationErrMsg.toLowerCase() ){ //Temp change it later.
              oThis.jTokenSetupAdminErrorModal.modal('show');
            }
            oThis.onError( response , oThis.jDeleteErr);
          }
        },
        error     : function ( err ) {
          oThis.onError( err , oThis.jDeleteErr );
        },
        complete  : function () {

        }
      });
    },

    resendEmail: function(){
      $.ajax({
        url       : oThis.resend_api_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.success ) {
            console.log("Resend email success");
          }
        },
        error     : function ( err ) {
          console.log("Resend email error occurred!!");
        },
        complete  : function () {

        }
      });
    },

    onSuccess: function() {
      if( ! oThis.keys) return;

      var length = oThis.keys.length;

      oThis.appendKeysInfoToDOM();
      if(length == 2){
        oThis.jShowKeyBtn.hide();
        oThis.jGenerateKeyBtn.hide();
      } else if(length == 1){
        oThis.jShowKeyBtn.hide();
        oThis.jGenerateKeyBtn.show();
      }
    },

    onError: function( error , jEl ) {
      if( !error || !jEl ) return;
      if( typeof  error == 'string'){
        error = JSON.parse( error );
      }
      var serverErrors =  utilities.deepGet( error ,  "err.error_data ") || [] ,
        errMsg;
      if(serverErrors && serverErrors[0]) {
        errMsg =  serverErrors[0]['msg'] ;
      }
      else {
        errMsg = utilities.getGeneralError( error );
      }
      jEl.html( errMsg );
    },

    appendKeysInfoToDOM: function(){
      var source   = document.getElementById("api-info").innerHTML,
          template = Handlebars.compile(source),
          context = {'keys': oThis.keys},
          html    = template(context);
      $('.keys-wrapper').empty();
      $('.keys-wrapper').append(html);
    },

    showWebhookSecrets: function(){
      $.ajax({
        url       : oThis.get_webhook_secrets,
        method    : 'GET',
        success   : function ( response ) {
          if( response.success && response.data ){
            var email_already_sent_flag = response.data && response.data['email_already_sent_flag'];
            if(email_already_sent_flag) {
              oThis.jEmailSentWrapper.show();
            }
            oThis.onShowWebhookSecretsSuccess(response.data);
          }else {
            oThis.onError( response , oThis.jGenerateWSErr );
          }
        },
        error     : function ( err ) {
          oThis.onError( err , oThis.jGenerateWSErr );
        },
        complete  : function () {
          utilities.btnSubmitCompleteState( oThis.jShowWebhookSecretBtn );
        }
      });
    },

    onShowWebhookSecretsSuccess: function (resp) {
      var source   = document.getElementById("webhook-secrets-info").innerHTML,
        template = Handlebars.compile(source),
        context =
          {
            'webhookSecret': resp['webhook_secret'],
            'webhookGraceSecret': resp['webhook_grace_secret'],
            'webhookGraceExpiry': resp['grace_expiry_at']
          },
        html    = template(context);

      $('.w-secrets-wrapper').empty();
      $('.w-secrets-wrapper').append(html);

      if(resp['webhook_grace_secret']){
        oThis.jShowWebhookSecretBtn.hide();
        oThis.jGenerateWebhookSecretBtn.hide();
      } else {
        oThis.jShowWebhookSecretBtn.hide();
        oThis.jGenerateWebhookSecretBtn.show();
      }
    },

    generateWebhookSecret: function () {

      utilities.btnSubmittingState( oThis.jGenerateWebhookSecretBtn );

      $.ajax({
        url       : oThis.get_webhook_secrets,
        method    : 'POST',
        success   : function ( response ) {
          if( response.success && response.data ) {
            oThis.onShowWebhookSecretsSuccess(response.data);
          } else {
            var errorMsg = utilities.deepGet(response, "err.display_text") ;
            if( errorMsg && errorMsg.toLowerCase() == utilities.authorizationErrMsg.toLowerCase() ){ //Temp change it later.
              oThis.jTokenSetupAdminErrorModal.modal('show');
            }
            oThis.onError( response , oThis.jGenerateWSErr );
          }
        },
        error     : function ( err ) {
          oThis.onError( err , oThis.jGenerateWSErr );
        },
        complete  : function () {
          utilities.btnSubmitCompleteState( oThis.jGenerateWebhookSecretBtn );
        }
      });
    },

    deleteWebhookSecret: function () {
      $.ajax({
        url       : oThis.delete_webhook_secret,
        method    : 'POST',
        success   : function ( response ) {
          if( response.success ) {
            oThis.devContainerBox.remove();
            oThis.jGenerateWebhookSecretBtn.show()
          } else {
            var errorMsg = utilities.deepGet(response, "err.display_text") ;
            if( errorMsg && errorMsg.toLowerCase() == utilities.authorizationErrMsg.toLowerCase() ){ //Temp change it later.
              oThis.jTokenSetupAdminErrorModal.modal('show');
            }
            oThis.onError( response , oThis.jDeleteErr);
          }
        },
        error     : function ( err ) {
          oThis.onError( err , oThis.jDeleteErr );
        },
        complete  : function () {

        }
      });
    }
  }

})(window, jQuery);