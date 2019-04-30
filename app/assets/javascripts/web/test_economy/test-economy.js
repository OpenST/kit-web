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
      $('#invite-users-btn').on('click',function () {
        $(this).hide();
        $('.send-invite-section').show();
      });
      $('#get-qr-code-btn').on('click',function () {
        $(this).hide();
        $('.qr-code-section').show();
      });
    },

    onLaunchSetupSuccess : function () {

      $('#launch-setup-form').formHelper({
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
           $('#invite-success-modal').modal('show');
          }
        }
      });

    }
  }
})(window,jQuery) ;

