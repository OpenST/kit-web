;
(function(){

  var ost = ns('ost'),
      utilities = ns('ost.utilities'),
      pricerConfig = {},
      pricerInstanceMap = {}
  ;

  ost.PricerFactory = {

    config : null,

    init : function( config ) {
      if(!config){
        console.log("Mandatory params not present!!!");
        throw error;
      }
      pricerConfig = config;
    },


    getInstance : function( stakeCurrency ) {

      var pricerInstance = pricerInstanceMap && pricerInstanceMap[stakeCurrency]
      ;

      if(!pricerInstance) {
        var config = pricerConfig[ stakeCurrency ];
        pricerInstance =  new ost.PriceOracle(config);
        pricerInstanceMap[stakeCurrency] = pricerInstance ;
      }

      return pricerInstance;
    }

  }

})();




