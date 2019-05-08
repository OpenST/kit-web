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

      if (!config || !config.sc_to_fiat || !config.decimals) {
        console.error("Mandatory params not present for PriceOracle!!!");
        return ;
      }

      if (config.sc_to_fiat) {
        this.SC_TO_FIAT = String(config.sc_to_fiat);
      }

      if (config.sc_to_bt) {
        this.SC_TO_BT = String(config.ost_to_bt);
      }

      if (config.decimals) {
        this.SC_DECIMALS = config.decimals;
      }

  };

  PriceOracle.prototype = {

    stakeCurrencyToFiat :  function ( stakeCurrency ) {
      if( !stakeCurrency ) return "";

      stakeCurrency = BigNumber( stakeCurrency );

      var result = stakeCurrency.multipliedBy( this.SC_TO_FIAT );

      return this.toFiat( result );
    },

    btToFiat : function ( bt ) {
      if( !bt ) return "";

      bt = BigNumber( bt );

      var fiatBN = BigNumber( this.SC_TO_FIAT ) ,
        oneBTToFiat = fiatBN.dividedBy(  this.SC_TO_BT )
      ;

      var result = oneBTToFiat.multipliedBy( bt );

      return this.toFiat( result );
    },

    btToFiatPrecision : function ( bt) {
      if( !bt ) return "";

      var fiat = this.btToFiat( bt );

      return this.toPrecisionFiat( fiat );
    },

    stakeCurrencyToBt : function ( stakeCurrency  ) {
      if( !stakeCurrency ) return "";

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
      return typeof val === "undefined" || val === "" || val === null || isNaN( val );
    },

    fromSmallestUnit: function ( val ) {

      if ( this.isNaN( val ) ) {
        return NaN;
      }

      val = BigNumber( val ) ;
      var exp = BigNumber(10).exponentiatedBy(this.SC_DECIMALS) ;
      return val.dividedBy(exp).decimalPlaces(0).toString( 10 );
    },

    toSmallestUnit: function ( val ) {

      if ( this.isNaN( val ) ) {
        return NaN;
      }

      val = BigNumber( val ) ;
      var exp = BigNumber(10).exponentiatedBy(this.SC_DECIMALS) ;
      return val.multipliedBy(exp).decimalPlaces(0).toString( 10 );
    }
  };

  //STATIC FUNCTIONS, DON'T USE "this" KEYWORD INSIDE THESE FUNCTIONS

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

})();