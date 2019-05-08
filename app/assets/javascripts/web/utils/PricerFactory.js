;
(function(){

  var ost = ns('ost'),
      utilities = ns('ost.utilities'),
      pricerConfig = {},
      pricerInstanceMap = {}
  ;

  ost.PricerFactory = {

    init : function( config ) {
      if(!config){
        console.error("Mandatory params not present for PricerFactory!!!");
        return ;
      }
      pricerConfig = config;
    },


    getInstance : function( stakeCurrency ) {
      stakeCurrency =  stakeCurrency && String( stakeCurrency ).toLowerCase();
      var pricerInstance = pricerInstanceMap && pricerInstanceMap[stakeCurrency]
      ;

      if(!pricerInstance) {
        var config = pricerConfig;
        pricerInstance =  new ost.PriceOracle(config);
        pricerInstanceMap[stakeCurrency] = pricerInstance ;
      }

      return pricerInstance;
    }

  }

})();




