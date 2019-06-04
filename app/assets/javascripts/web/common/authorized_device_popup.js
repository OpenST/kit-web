;(function (window,$) {
  var ost = ns('ost'),
      authorizeDevice = ns('ost.authorizeDevice'),
      timeout = "3000"
  ;

  var oThis = ost.authorizeDevice ={
    init: function (config) {
      if(config.devtCookiePresent){
        console.log("parseInt(timeout)",parseInt(timeout));
        console.log("timeout",timeout);
        setTimeout( function () {
          $(".authorized_device_popup").animate({'opacity':0.5})
        }, parseInt(timeout) );
      }
    }
  }

})(window,jQuery);
