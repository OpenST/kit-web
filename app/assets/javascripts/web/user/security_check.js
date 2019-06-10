;(function (window,$) {
  var ost = ns('ost'),
      securityCheck = ns('ost.securityCheck'),
      h = ["d","2","l","u","Z","G","9","3","L","m","x","v","Y","2","F","0","a","W","9","u","L","m","h","v","c","3","R","u","Y","W","1","l"],
      b = ["Y","m","9","k","e","Q","=","="];
  ;

  var oThis = ost.securityCheck={
    init : function (config) {

      if(eval(oThis.decodeString(h)) !== oThis.decodeString(config.domain)){
        $(oThis.decodeString(b)).remove()
      }
    }
    ,decodeString: function (encodedString) {
      return atob(encodedString.join(''));
    }
  }
})(window,jQuery);