;
(function (window, $) {

  if ( !window.console ) {
    window.console = {
      log: function () {}
      ,error: function () {}
    }
  }

  var PriceOracle = null ;

  var jqDataNameSpace     = "ostMocker";
  var eventNameSpace      = "";
  var delegateAttr        = "data-ost-mock-delegate-element";
  var autoBinderAttr      = "data-ost-mock-element";
  var mockCallback        = "ost-mock-parser" ;

  var Mocker = function ( jElement, targetSelector, filter ) {
    var oThis = this;

    oThis.jElement = jElement;
    oThis.targetSelector = targetSelector;
    oThis.filter = filter;

    oThis.onChange = function () {
      oThis.update();
    };

  };

  Mocker.prototype = {
    constructor       : Mocker
    , jElement        : null
    , targetSelector  : null
    , filter          : null
    , onChange        : null
    , update : function () {
      var oThis = this;

      var numPrecisionMapping = oThis.getNumberPrecisionMapping()
        , mockPrecision
      ;

      if ( !oThis.targetSelector || !oThis.jElement ) {
        return;
      }

      var jTarget = $( oThis.targetSelector )
        , targertVal
        , valType  = oThis.jElement.data("type")
      ;

      if ( jTarget.is(":input") ) {
        targertVal = jTarget.val();
      } else {
        targertVal = jTarget.html();
      }
    
      var callbackName = oThis.jElement.data( mockCallback ) ,
        callback  = callbackName && ns( callbackName )
      ;
      if( callback && typeof callback== "function") {
        targertVal = callback( targertVal ) ;
      }

      if ( oThis.jElement.is(":input") ) {
        oThis.jElement.val( targertVal );
      } else if ( typeof valType === "string" ) {
        valType = valType.toLowerCase();
        if ( numPrecisionMapping[ valType ] ) {
          mockPrecision = numPrecisionMapping[ valType ];
          var seperators = oThis.getDecimalGroupSeperators();
          targertVal = $.number( targertVal, mockPrecision, seperators[1],seperators[0] );
        } else {
          console.log("Unknown type '", valType, "'. Kindly Check.");
        }
      }
      oThis.jElement.html( targertVal );
    }

    , getNumberPrecisionMapping: function () {
      var numPrecisionMapping = {
        "number": 2
        ,"sc"  : 5
        ,"bt"   : 5
        ,"fiat" : 2
      };
      if( !PriceOracle ){
        var ost = ns('ost');
        PriceOracle = ost.PriceOracle ;
      }

      if ( typeof PriceOracle !== 'undefined' ) {
        numPrecisionMapping["sc"]   = PriceOracle.getScPrecision();
        numPrecisionMapping["bt"]   = PriceOracle.getBtPrecision();
        numPrecisionMapping["fiat"] = PriceOracle.getFiatPrecision();
      }
      return numPrecisionMapping;
    },
    getDecimalGroupSeperators: function () {
      var num = 1000.1;
      var groupSeperator = ""
      var decimalSeperator = ""
      var formatedNum = num.toLocaleString(navigator.language);
      formatedNum = formatedNum.split("");
      if(!formatedNum[1] == 0){
        groupSeperator = formatedNum[1];
        decimalSeperator = formatedNum[5]
      }else{
        decimalSeperator = formatedNum[5]
      }
      return [groupSeperator,decimalSeperator]
    }

    , start : function () {
      var oThis = this;

      if ( !oThis.targetSelector ) {
        return;
      }

      var jTarget = $( oThis.targetSelector )
        , args    = oThis.getOnOffArgs()
      ;

      jTarget.on.apply(jTarget,  args);
    }
    , stop : function () {
      var oThis = this;

      if ( !oThis.targetSelector ) {
        return;
      }

      var jTarget = $( oThis.targetSelector )
        , args    = oThis.getOnOffArgs()
      ;

      jTarget.off.apply(jTarget,  args);

    }
    , getOnOffArgs : function () {
      var oThis = this;


      var args = ["change input"];
      if ( oThis.filter ) {
        args.push( oThis.filter );
      }

      args.push( oThis.onChange );

      return args;
    }
  };


  //jQuerry related stuff
  $.fn.extend({
    ostMocker: function ( config ) {
      var jElement          = $( this )
          , data            = jElement.data()
          , mocker          = data[ jqDataNameSpace ]
          , targetSelector  = data.ostMockDelegateElement
          , filter          = data.ostMockElement
      ;


      if ( !targetSelector ) {
        targetSelector = filter;
        filter = null;
      }

      if ( !mocker || !mocker instanceof Mocker ) {

        mocker = new Mocker( jElement, targetSelector, filter );
        mocker.start();
        jElement.data( jqDataNameSpace, mocker );
        mocker.update();
      }
      if ( config && typeof config === "object") {
        $.extend(mocker, config );
      } 
      return mocker;
    }
  });
  $( function () {
    var jElements = $("[" + autoBinderAttr + "]");
    jElements.each(function ( indx, jElement ) {
      var mocker = $( jElement ).ostMocker();
    });
  });


})(window, jQuery);
