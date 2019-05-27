;
(function(window,$){
  var parentNS = ns('ost'),
      utilities   = ns('ost.utilities')
      ;

  var oThis = parentNS.test_economy = {
    inviteEconomyForm : $("#invite-economy-form"),
    init: function (config) {

      $.extend(oThis,config);
      oThis.onSetup();
      oThis.bindEvents();

    },
    bindEvents : function () {
      // $('#get-qr-code-btn').on('click',function () {
      //   $(this).hide();
      //   $('.qr-code-section').show();
      // });
      $('.invite-users-btn').on('click',function () {
        $('.test-economy-setup').hide();
        $('.test-economy-post-setup').show();
      });
    },

    onSetup : function () {

      $('#launch-setup-form').formHelper({
        success:function(response){
          if(response && response.success){
            // var qrUrl = utilities.deepGet( response ,  'data.test_economy_details.qr_code_url');
            $('.test-economy-pre-setup').hide();
            $('.test-economy-setup').show();
            // $('.qr-code').attr('src' , qrUrl );
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

