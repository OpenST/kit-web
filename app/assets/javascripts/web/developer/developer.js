;
(function (window, $) {
  var ost = ns("ost") ,
    utilities = ns('ost.utilities')
  ;

  var oThis = ost.developer = {

    sGenerateKeyBtn : '.generate-key-btn',
    sDeleteKey      : '.api-delete-btn',
    jGenerateKeyBtn : $( '.generate-key-btn' ) ,
    jShowKeyBtn     : $('.show-keys-btn'),
    jKeysWrapper    : $('.keys-wrapper'),
    jMainContainer  : $('.developers-container'),
    jGenerateErr    : $('.generate-key-error'),
    jDeleteErr      : null,
    keys            : null,

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

    },

    showKeys: function(){
      $.ajax({
        url       : oThis.api_get_key,
        method    : 'GET',
        success   : function ( response ) {
          if( response.success ){
            oThis.keys = response.data && response.data['api_keys'];
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
    }
  }

})(window, jQuery);