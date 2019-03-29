( function (scope , $) {
  
  var parentNS = ns("ost.user")
    , oThis
  ;
  
  parentNS.mfa = oThis = {
    
    init: function ( config ) {
      $.extend(oThis , config) ;
      var jQREl = $('.qr-image') ;
      if( jQREl && jQREl.length > 0 && oThis.qr_code_string){
        new QRCode(jQREl[0], oThis.qr_code_string);
      }
      oThis.mfaFormSubmit();
    },
    
    mfaFormSubmit : function () {
      var jForm =  $('#mfa-form'),
        mfaTimeOut , isXHRSend = false ;
      $("input[name='otp']").on('keyup', function(){
        var jEl = $(this) ;
        clearTimeout( mfaTimeOut );
        mfaTimeOut = setTimeout( function () {
          var val = jEl.val();
          if(val && val.length >= 6) {
            jForm.submit();
          }
        }, 300)
      });
  
      jForm.on("beforeSubmit", function (event) {
        if ( !isXHRSend  ) {
          isXHRSend = !isXHRSend ;
        }else {
          event.preventDefault();
        }
      });
  
      jForm.formHelper().complete = function() {
        isXHRSend = false ;
      }
    },
    
    
  }
  
})(window , jQuery);