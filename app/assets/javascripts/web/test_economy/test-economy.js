;
(function(window,$){
  var parentNS = ns('ost'),
      utilities   = ns('ost.utilities')
      ;

  var oThis = parentNS.test_economy = {
    inviteEconomyForm : $("#invite-economy-form"),
    init: function (config) {

      $.extend(oThis,config);
      oThis.onLaunchSetupSuccess();
      oThis.bindEvents();

    },
    bindEvents : function () {
      $('#invite-users-btn').on('click',function () {
        $(this).hide();
        $('.send-invite-section').show();
      });
      $('#get-qr-code-btn').on('click',function () {
        $(this).hide();
        $('.get-qr-code-before-text').hide()
        $('.get-qr-code-after-text').show()
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

      oThis.inviteEconomyForm.formHelper({
        success:function(response){
          if(response && response.success){
            oThis.inviteEconomyForm[0].reset();
           $('#invite-success-modal').modal('show');
          }
        }
      });

    }
  }
})(window,jQuery) ;

