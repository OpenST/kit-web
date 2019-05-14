;
(function () {

  var ost = ns('ost');

  var P_SC = 5,
    P_SC_ROUND_ROUNDING_MODE   = BigNumber.ROUND_HALF_UP ;

  var P_BT = 5,
    P_BT_ROUND_ROUNDING_MODE    = BigNumber.ROUND_HALF_UP ;

  var P_FIAT = 2,
    P_FIAT_ROUND_ROUNDING_MODE  = BigNumber.ROUND_HALF_UP ;


  var PriceOracle = ost.PriceOracle =  function (config) {

      if (!config || !config.USD || !config.decimal) {
        console.error("Mandatory params not present for PriceOracle!!!");
        return ;
      }

      if (config.USD) {
        this.SC_TO_FIAT = String(config.USD);
      }

      if (config.conversion_factor) {
        this.SC_TO_BT = String(config.conversion_factor);
      }

      if (config.decimal) {
        this.decimal = config.decimal;
      }

  };

  PriceOracle.prototype = {

    SC_TO_FIAT : null ,
    SC_TO_BT   : null ,
    decimal    : null ,

    stakeCurrencyToFiat :  function ( stakeCurrency ) {
      if( !stakeCurrency ) return "";

      stakeCurrency = BigNumber( stakeCurrency );

      var result = stakeCurrency.multipliedBy( this.SC_TO_FIAT );

      return this.toFiat( result );
    },

    btToFiat : function ( bt ) {
      if( !bt ) return "";

      if( this.isNaN( this.SC_TO_BT )){
        console.error("Conversion rate for SC to BT is not set" , this.SC_TO_BT );
        return ;
      }

      bt = BigNumber( bt );

      var fiatBN = BigNumber( this.SC_TO_FIAT ) ,
        oneBTToFiat = fiatBN.dividedBy(  this.SC_TO_BT )
      ;

      var result = oneBTToFiat.multipliedBy( bt );

      return this.toFiat( result );
    },

    btToFiatPrecision : function ( bt ) {
      if( !bt ) return "";

      var fiat = this.btToFiat( bt );

      return this.toPrecisionFiat( fiat );
    },

    stakeCurrencyToBt : function ( stakeCurrency  ) {
      if( !stakeCurrency ) return "";

      if( this.isNaN( this.SC_TO_BT )){
        console.error("Conversion rate for SC to BT is not set" , this.SC_TO_BT );
        return ;
      }

      stakeCurrency = BigNumber( stakeCurrency );

      var result = stakeCurrency.multipliedBy( this.SC_TO_BT  );

      return this.toBT( result );
    },

    stakeCurrencyToBtPrecision : function ( stakeCurrency  ) {
      if( !stakeCurrency ) return "";

      var result = this.stakeCurrencyToBt( stakeCurrency );

      return this.toPrecisionBT( result );
    },

    btToStakeCurrency : function (  bt ) {
      if( !bt ) return "";

      if( this.isNaN( this.SC_TO_BT )){
        console.error("Conversion rate for SC to BT is not set" , this.SC_TO_BT );
        return ;
      }

      bt = BigNumber( bt );

      var result = bt.dividedBy( this.SC_TO_BT );

      return this.toStakeCurrency( result ) ;
    },

    btToStakeCurrencyPrecision : function (  bt ) {
      if( !bt ) return "";

      var result = this.btToStakeCurrency( bt );

      return this.toPrecisionStakeCurrency( result ) ;
    },

    toBT: function ( bt ) {

      if ( this.isNaN( bt ) ) {
        return NaN;
      }
      bt = String( bt );
      bt = BigNumber( bt );
      return bt.toString();
    },

    toPrecisionBT : function ( bt ) {

      bt = this.toBT( bt );
      if ( ! bt  ) {
        return "";
      }
      bt = BigNumber( bt );
      return  bt.toFixed( P_BT , P_BT_ROUND_ROUNDING_MODE );
    },

    toStakeCurrency: function ( stakeCurrency ) {

      if ( this.isNaN( stakeCurrency ) ) {
        return "";
      }
      stakeCurrency = String( stakeCurrency );
      stakeCurrency = BigNumber( stakeCurrency ) ;
      return stakeCurrency.toString( );
    },

    toPrecisionStakeCurrency: function ( stakeCurrency ) {

      stakeCurrency = this.toStakeCurrency( stakeCurrency );
      if ( !stakeCurrency ) {
        return "";
      }
      stakeCurrency = BigNumber( stakeCurrency );
      return stakeCurrency.toFixed( P_SC , P_SC_ROUND_ROUNDING_MODE);
    },

    toFiat : function ( fiat ) {

      if ( this.isNaN( fiat ) ) {
        return NaN;
      }
      fiat = String( fiat );
      fiat = BigNumber( fiat );
      return  fiat.toString( );
    },

    toPrecisionFiat : function ( fiat ) {

      fiat = this.toFiat( fiat );

      if ( !fiat ) {
        return "";
      }

      fiat = BigNumber( fiat );
      var precision = P_FIAT;
      return  fiat.toFixed( precision , P_FIAT_ROUND_ROUNDING_MODE);
    },

    isNaN : function ( val ) {
      return __isNaN__( val );
    },

    fromSmallestUnit: function ( val ) {
      if( !val ) return val;
      return __fromSmallestUnit__(val , this.decimal);
    },

    toSmallestUnit: function ( val ) {
      if( !val ) return val;
      return __toSmallestUnit__(val , this.decimal);
    }
  };

  /*********************************************************************************************************
   *                                              STATIC FUNCTIONS                                         *
   *********************************************************************************************************/
  PriceOracle.getStakeCurrencyPrecision = function(){
    return P_SC ;
  };

  PriceOracle.getBtPrecision = function(){
    return P_BT;
  };

  PriceOracle.getFiatPrecision = function(){
    return P_FIAT;
  };

  PriceOracle.setStakeCurrencyPrecision = function( val ){
    P_SC = val;
  };

  PriceOracle.setBtPrecision = function( val ){
    P_BT = val;
  };

  PriceOracle.setFiatPrecision = function( val ){
    P_FIAT = val;
  };

  PriceOracle._toSmallestUnit = function ( value , decimal ) {
    return __toSmallestUnit__(val , decimal);
  };

  PriceOracle._fromSmallestUnit = function (val , decimal ) {
    return __fromSmallestUnit__(val , decimal);
  };


  /*********************************************************************************************************
   *                                             Private FUNCTIONS                                         *
   *********************************************************************************************************/

  function __isNaN__( val ){
    return typeof val === "undefined" || val === "" || val === null || isNaN( val );
  }

  function __fromSmallestUnit__( val , decimal ){
    if(!val ){
      console.error("Value is Mandatory param!!!");
    }
    if(!decimal){
      console.error("Decimal is Mandatory param!!!");
    }

    if ( __isNaN__( val ) ) {
      return NaN;
    }

    val = BigNumber( val ) ;
    var exp = BigNumber(10).exponentiatedBy( decimal ) ;
    return val.dividedBy(exp).decimalPlaces(0).toString( 10 );

  }

  function __toSmallestUnit__( val , decimal ){
    if(!val ){
      console.error("Value is Mandatory param!!!");
    }
    if(!decimal){
      console.error("Decimal is Mandatory param!!!");
    }

    if ( __isNaN__( val ) ) {
      return NaN;
    }

    val = BigNumber( val ) ;
    var exp = BigNumber(10).exponentiatedBy( decimal ) ;
    return val.multipliedBy(exp).decimalPlaces(0).toString( 10 );
  }


})();