;
(function(window,$){
  var parentNS = ns('ost'),
      utilities   = ns('ost.utilities')
      ;

  var oThis = parentNS.test_economy = {
    jInviteEconomyModal   : $('#invite-economy-modal'),
    init: function (config) {

      $.extend(oThis,config);
      oThis.onLaunchSetupSuccess();
      oThis.bindEvents();

    },
    bindEvents : function () {
      $('#invite-economy').on('click',function () {
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
            $('.test-economy-pre-setup').hide();
            $('.test-economy-post-setup').show();
            $('.qr-code').attr('src' , qrUrl );
          }
        }
      });

      $("#invite-economy-form").formHelper({
        success:function(response){
          if(response && response.success){
            oThis.jInviteEconomyModal.modal('hide');
          }
        }
      });

    }
  }
})(window,jQuery) ;

