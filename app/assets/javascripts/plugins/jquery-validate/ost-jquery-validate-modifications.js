(function (window, $) {
  
  $.validator.prototype.checkForm = function() {
    this.prepareForm();
    var elements = (this.currentElements = this.elements())
        , i = 0;
    ;
    while ( elements[i] ) {
      var foundElements = this.findByName( elements[i].name );
      if (foundElements.length != undefined && foundElements.length > 1 ) {
        for (var cnt = 0; cnt < foundElements.length; cnt++) {
          this.check( foundElements[cnt] );
        }
      } else {
        this.check( elements[i] );
      }
      i++;
    }
    return this.valid();
  };
  
  $.validator.prototype.defaultMessage = function( element, rule ) {
    if ( typeof rule === "string" ) {
      rule = { method: rule };
    }
    
    var message = this.findDefined(
      this.customMessage( element.name, rule.method ),
      this.customDataMessage( element, rule.method ),
      this.getValidatorMessage(element.title ,  rule.method ),
      "<strong>Warning: No message defined for " + element.name + "</strong>"
      ),
      theregex = /\$?\{(\d+)\}/g;
    if ( typeof message === "function" ) {
      message = message.call( this, rule.parameters, element );
    } else if ( theregex.test( message ) ) {
      message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
    }
    
    return message;
  };
  
  $.validator.prototype.getValidatorMessage = function ( elementTitle , rule ) {
    // 'title' is never undefined, so handle empty string as undefined
    if(!this.settings.ignoreTitle &&  elementTitle && rule == "required"){
      return elementTitle + " is required."
    }else {
      return $.validator.messages[ rule ];
    }
  };

})(window, jQuery);