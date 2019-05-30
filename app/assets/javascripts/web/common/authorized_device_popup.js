;(function (window,$) {
  var ost = ns('ost'),
      authorizeDevice = ns('ost.authorizeDevice')
  ;

  var oThis = ost.authorizeDevice ={
    init: function (config) {
      if(config.devtCookiePresent){
        setTimeout(function () {
          $(".authorized_device_popup").animate({opacity:0})
        },3000)
      }
    }
  }

})(window,jQuery);
