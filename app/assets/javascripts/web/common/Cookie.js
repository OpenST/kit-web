
;
(function (window,$) {
  var utilsNs = ns("ost.utils"),
      oThis;

  utilsNs.cookieConsent = oThis = {
    accept_expiry : 365 * 86400000,
    reject_expiry : 183 * 86400000,
    mobileBreakPt : 576,
    jAcceptCookie: $('.accept-cookie-wrapper'),
    jBtnAcceptCookie: $('.btn-accept-cookie'),
    jBtnRejectCookie: $('.btn-reject-cookies'),
    gtmCode: $('#gdpr-accept-gtm-code').text(),

    init: function (config) {

      oThis.config = config;
      var isAcceptCookieSet = document.cookie.split(';').filter(function (item) {
        return item.indexOf('gdpr_accept=true')>=0
      }).length;

      var isRejectCookieSet = document.cookie.split(';').filter(function (item) {
        return item.indexOf('gdpr_decline=true')>=0
      }).length;

      if(!isAcceptCookieSet && !isRejectCookieSet ){
        if ($(window).width() < oThis.mobileBreakPt) {
          $('.demo-modal').modal('show');
        } else {
          oThis.jAcceptCookie.show();
        }
      }

      if(isAcceptCookieSet){
        oThis.onAccept();
      }

      oThis.bindEvents();
    },

    bindEvents : function(){
      oThis.jBtnAcceptCookie.on('click',function () {
        var gdpr_accept_expiry = oThis.getGmtString(oThis.accept_expiry);
        document.cookie = "gdpr_accept=true; expires="+gdpr_accept_expiry+"; domain=."+oThis.config.domain;
        oThis.onAccept();
        oThis.jAcceptCookie.hide();
      });


      oThis.jBtnRejectCookie.on('click',function () {
        var gdpr_reject_expiry = oThis.getGmtString(oThis.reject_expiry);
        document.cookie = "gdpr_decline=true; expires="+gdpr_reject_expiry+"; domain=."+oThis.config.domain;
        oThis.jAcceptCookie.hide();
      })
    },

    onAccept : function(){
      if(oThis.gtmCode){
        $('<script>')
          .attr('type', 'text/javascript')
          .text(oThis.gtmCode)
          .appendTo('head');
      } else {
        console.warn('GTM code not found');
      }
    },

    getGmtString: function (expiry) {
      var todaysDate = new Date();
      todaysDate.setTime(todaysDate.getTime() + expiry);
      return todaysDate.toGMTString();
    }
  };


})(window,jQuery);