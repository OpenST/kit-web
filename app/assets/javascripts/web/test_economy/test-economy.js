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

      // oThis.selectizedField[0].selectize.clear();

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
      $('.invite-users-btn').on('click',function () {
        $('.test-economy-setup').hide();
        $('.test-economy-post-setup').show();
      });

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
            $('.test-economy-setup').show();
          }
        }
      });

      oThis.inviteEconomyForm.formHelper({
        success:function(response){
          if(response && response.success){
            // oThis.inviteEconomyForm[0].reset();
            oThis.selectizedField[0].selectize.clear();
           $('.test-economy-post-setup').hide();
           $('.invite-successful').show();
          }
        }
      });

    }
  }
})(window,jQuery) ;

