;(function (window,$) {
  var ost = ns('ost'),
      authorizeDevice = ns('ost.authorizeDevice'),
      timeOut = 3000
  ;

  var oThis = ost.authorizeDevice ={
    init: function (config) {
      if(config.devtCookiePresent){
        setTimeout( function () {
          $(".authorized_device_popup").animate({'opacity':0})
        }, timeOut );
      }
    }
  }

})(window,jQuery);
