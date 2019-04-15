;
(function(window,$){
  var parentNS = ns('ost'),
      utilities   = ns('ost.utilities')
      ;

  var oThis = parentNS.test_economy = {
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
          oThis.jInviteEconomyModal.modal('show');
      });

    },
    onLaunchSetupSuccess : function () {

      if( !oThis.jLaunchSetupForm ){
        oThis.jLaunchSetupForm = $('#launch-setup-form') ;
      }


      oThis.jLaunchSetupForm.formHelper({
        success:function(response){
          if(response && response.success){
            var qrUrl = utilities.deepGet( response ,  'data.test_economy_details.qr_code_url');
            oThis.jTestEconomyPreSetup.hide();
            oThis.jTestEconomyPostSetup.show();
            oThis.jQrCode.attr('src' , qrUrl );
          }
        }
      });

      oThis.jInviteEconomyForm.formHelper({
        success:function(response){
          if(response && response.success){
            oThis.jInviteEconomyModal.modal('hide');
          }
        }
      });

    }
  }
})(window,jQuery) ;

