;
(function(window,$){
  var parentNS = ns('ost')
      ;

  oThis = parentNS.test_economy = {
    jLaunchSetupForm      : $('#launch-setup-form'),
    jInviteEconomyForm    : $("#invite-economy-form"),
    jTestEconomyPostSetup : $('.test-economy-post-setup'),
    jTestEconomyPreSetup  : $('.test-economy-pre-setup'),
    jInviteEconomyModal   : $('#invite-economy-modal'),
    jInviteEconomyBtn     : $('#invite-economy'),
    jQrCode               : $('.qr-code'),


    init: function (config) {

      $.extend(oThis,config);
      oThis.onLaunchSetupSuccess();
      oThis.bindEvents();

    },
    bindEvents : function () {
      oThis.jInviteEconomyBtn.on('click',function () {
          oThis.jInviteEconomyModal.show();
      });

    },
    onLaunchSetupSuccess : function () {

      oThis.jLaunchSetupForm.formHelper({
        success:function(response){
          if(response && response.success){
            oThis.jTestEconomyPostSetup.show();
            oThis.jTestEconomyPreSetup.hide();
            //set img source here
            //var qrSrcUrl = response.something
            // jQrCode.attr('src','qrSrcUrl');
          }
        }
      });

      oThis.jInviteEconomyForm.formHelper({
        success:function(response){
          if(response && response.success){
            oThis.jInviteEconomyModal.hide();
            alert("success");
          }
        }
      });

    }
  }
})(window,jQuery)

