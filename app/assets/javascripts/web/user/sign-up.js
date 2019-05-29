;
(function (window) {

  var parentNS = ns("ost.user")
    , utilities =  ns("ost.md5")
    , ost = ns("ost")
    , oThis
  ;
  
  parentNS.signup = oThis = {
    jForm: null
    , formHelper : null
    , fingerprintHash : $('#fingerprintHash')
    , fingerprintType : $('#fingerprintType')
    , init: function (config) {
      oThis.jForm = $('#sign_up_form');
      oThis.bindEventListeners();

      // SetTimeout used as recommended here- https://github.com/Valve/fingerprintjs2#usage
            setTimeout(function () {
              oThis.generateFingerPrint();
            }, 100)
    }
    ,generateFingerPrint: function () {
      var alternateHash = utilities(navigator.userAgent);
      oThis.fingerprintHash.val(alternateHash);
      oThis.fingerprintType.val('browser_agent');

      Fingerprint2.get(function(components){
        var hash = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join());
        if(hash && hash !== "00000000000000000000000000000000"){
          oThis.fingerprintHash.val(hash);
          oThis.fingerprintType.val('fingerprint_js');
        }
      });
    }
    , bindEventListeners: function () {
      $('#register-btn').on('click',function () {
        oThis.isCaptchaValid = ost.utilities.validateCaptcha(
          oThis.jForm,
          $('.recaptcha-submit-error')
        );

        if(!oThis.isCaptchaValid){
          event.preventDefault();
        }
      });

      oThis.jForm.length > 0 && oThis.jForm.formHelper({
        complete: function ( response ) {
          if (typeof grecaptcha != 'undefined') {
            grecaptcha.reset();
          }
        }
      });


    }

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);