;
(function (window , $) {
  var ost = ns('ost');

  var oThis = ost.utilities = {
  
    generalErrorMsg : "Something went wrong, try again later." ,
    authorizationErrMsg : "Not authorised to perform this action",
    captchaError : "Please complete the captcha in order to continue." ,
    /*
     * Validate Re-Captcha within form
     *
     * jForm: Parent form's jQuery object
     * jError: jQuery object of error element
     * errorText: Error message to be displayed
     */
    validateCaptcha : function (jForm, jError) {
      if( jForm.find('.g-recaptcha')[0] !== undefined && typeof grecaptcha !== 'undefined'){

        if(  grecaptcha.getResponse() === '' ){
          $(jError).text(oThis.captchaError);
          $(jError).addClass("is-invalid");

          return false;
        }
        else {
          $(jError)
            .text('&nbsp;')
            .removeClass("is-invalid");
          return true;
        }
      }

    } ,
  
    deepGet: function(data , path) {
    
      if(!data || !path ){
        return false;
      }
    
      var paths = path.split('.')
        , current = data
        , i
      ;
      for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
          console.warn('Could not find '+path+' in data');
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    },

    btnSubmittingState : function ( jEl ) {
      for( var cnt = 0 ; cnt < jEl.length ; cnt++ ){
        var jElCurr =  jEl.eq( cnt ),
          preText = jElCurr.data('pre-text') || jElCurr.text(),
          submittingText = jElCurr.data('submiting')
        ;
        jElCurr.data("pre-text", preText );
        jElCurr.text( submittingText );
        jElCurr.prop("disabled" ,  true );
      }
    },

    btnSubmitCompleteState : function ( jEl ) {
      for( var cnt = 0 ; cnt < jEl.length ; cnt++ ) {
        var jElCurr =  jEl.eq( cnt ),
          preText = jElCurr.data('pre-text')
        ;
        jElCurr.text(preText);
        jElCurr.prop("disabled", false);
      }
    },
    
    getGeneralError : function ( res ) {
      return oThis.deepGet( res , 'err.display_text');
    },
    
    showGeneralError : function ( jWrapper , res , msg ) {
      if(!jWrapper) return ;
      msg = oThis.getGeneralError( res ) || msg || oThis.generalErrorMsg ;
      jWrapper.find('.general_error').html( msg ).addClass('is-invalid');
    },
    
    clearErrors : function ( jWrapper ) {
      if(!jWrapper) return ;
      jWrapper.find('.is-invalid').text( "" ).removeClass('is-invalid');
    },

    mockerTokenName: function ( val ) {
      return val.toUpperCase() || 'BT';
    },

    mockerStakingOptions: function ( val ) {
      return val.toUpperCase() || 'Token';
    },

    getFormData : function($form){
      var unindexed_array = $form.serializeArray();
      var indexed_array = {};

      $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
      });

      return indexed_array;
    },

    showStakeCurrencyWrappers : function (  scSymbol  , jWrapper ) {
      scSymbol = scSymbol && String( scSymbol );
      if( !scSymbol ) return ;
      var scClassName = 'sc-display-wrapper' ,
          sHideEls = "."+scClassName ,
          sShowEls = "."+ scSymbol + "-" + scClassName,
          jHideEls , jShowEls
      ;
      if( jWrapper ){
        jHideEls = jWrapper.find( sHideEls );
        jShowEls = jWrapper.find( sShowEls );
      }else {
        jHideEls = $( sHideEls );
        jShowEls =  $( sShowEls  );
      }

      jHideEls.addClass('hide');
      jShowEls.removeClass('hide');

    }
  }

})(window , jQuery);
