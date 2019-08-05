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

      oThis.selectizedField = $('#set-up-email-address').selectize({
        plugins: ['remove_button'],
        openOnFocus: false,
        createOnBlur: true,
        delimiter: ',',
        persist: false,
        maxItems: 5,
        create: function(input) {
          return {
            value: input,
            text: input
          }
        }
      });
      $('#set-up-email-address-selectized').focus();

    },
    bindEvents : function () {

      $('.invite-more-users-btn').on('click',function () {
        $('.invite-successful').hide();
        $('.test-economy-post-setup').show();
      });
    },

    onSetup : function () {

      $('#launch-setup-form').formHelper({
        success:function(response){
          if(response && response.success){
            $('.test-economy-pre-setup').hide();
            $('.test-economy-post-setup').show();
          }
        }
      });

      oThis.inviteEconomyForm.formHelper({
        success:function(response){
          if(response && response.success){
            // oThis.inviteEconomyForm[0].reset();
            oThis.selectizedField[0].selectize.clear();
            $('#invite-successful-message').show();
            setTimeout(function () {
              $('#invite-successful-message').hide();
            },2000)
          }
        }
      });

    }
  }
})(window,jQuery) ;

