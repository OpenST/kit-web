;
(function(window,$){
  var parentNS = ns('ost')
      ;

  oThis = parentNS.test_economy = {
    jForm                 : $('#launch-setup-form'),
    jTestEconomyPostSetup : $('.test-economy-post-setup'),
    jTestEconomyPreSetup  : $('.test-economy-pre-setup'),
    jQrCode               : $('.qr-code'),

    init: function (config) {

      $.extend(oThis,config);
      oThis.onLaunchSetupSuccess();

    },
    onLaunchSetupSuccess : function () {

      oThis.jForm.formHelper({
        success:function(response){
          if(response && response.success){
            oThis.jTestEconomyPostSetup.hide();
            oThis.jTestEconomyPreSetup.show();
            //set img source here
            //var qrSrcUrl = response.something
            // jQrCode.attr('src','qrSrcUrl');
          }
        }
      });

    }
  }
})(window,jQuery)

