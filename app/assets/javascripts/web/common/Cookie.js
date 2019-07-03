
;
(function (window,$) {
  var utilsNs = ns("ost.utils"),
    oThis;

  utilsNs.cookieConsent = oThis = {
    reject_expiry : 183 * 86400000,
    jAcceptCookie: $('.accept-cookie-wrapper'),
    jBtnRejectCookie: $('.btn-reject-cookies'),
    cookieKey: 'privacy_banner_dismiss',

    init: function (config) {

      oThis.config = config;
      var isRejectCookieSet = document.cookie.split(';').filter(function (item) {
        return item.indexOf(oThis.cookieKey+'=true')>=0
      }).length;

      if(!isRejectCookieSet ){
        oThis.jAcceptCookie.show();
      }
      oThis.bindEvents();
    },

    bindEvents : function(){
      oThis.jBtnRejectCookie.on('click',function () {
        var gdpr_reject_expiry = oThis.getGmtString(oThis.reject_expiry);
        document.cookie = oThis.cookieKey+"=true; expires="+gdpr_reject_expiry+"; domain=."+oThis.config.domain+";path=/";
        oThis.jAcceptCookie.hide();
      })
    },

    getGmtString: function (expiry) {
      var todaysDate = new Date();
      todaysDate.setTime(todaysDate.getTime() + expiry);
      return todaysDate.toGMTString();
    }
  };


})(window,jQuery);