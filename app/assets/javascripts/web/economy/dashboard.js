;
(function (window,$) {
    var ost = ns('ost'),
        transactions_and_ost_volume = ns('ost.transactions_and_ost_volume'),
        transaction_by_type = ns('ost.transaction_by_type'),
        transaction_by_name = ns('ost.transaction_by_name'),
        filterOptionsMap    = ns('ost.filterOptionsMap'),

        jIntervals    = $('.interval');

    var oThis = ost.dashboard = {
      init: function (config) {
          $.extend(oThis,config);

          oThis.initCharts();
          oThis.bindActions();

      },

      initCharts: function(){
        oThis.initTransactionAndOstVolumeGraph() ;
        oThis.initTransactionByTypeGraph() ;
        oThis.initTransactionByNameGraph() ;
      },

      initTransactionAndOstVolumeGraph: function (filter) {
       //Get url value
        var url = oThis.getAjaxUrl( oThis.transactions_and_ost_volume_url ,filter );
        var updatedOptions = transactions_and_ost_volume ;

        transactions_and_ost_volume['ajax']['url'] = url ;
        if(filter){
          updatedOptions['options']['hAxis']['gridlines']['count'] = filterOptionsMap[filter].count;
          updatedOptions['options']['hAxis']['format']=filterOptionsMap[filter].format;
          updatedOptions['columns'][0] = filterOptionsMap[filter].columns_1;
          console.log("filterOptionsMap",transactions_and_ost_volume);
        }

        oThis.transactionAndOstVolumeGraph = new GoogleCharts( transactions_and_ost_volume ) ;
        oThis.transactionAndOstVolumeGraph.draw(updatedOptions);
      },

      initTransactionByTypeGraph : function () {
        //TODO
      },

      initTransactionByNameGraph : function () {
        //TODO
      },

      getAjaxUrl: function (api ,  val ) {
         if(!val && api.indexOf('graph_duration') < 0 ){
           var url = api + '?graph_duration=Day';
           return url;
           console.log("url",url);
         }else {
           var url = api + '?graph_duration=' + val;
           return url
           console.log("url", url);
         }
      },


      bindActions :function () {
        jIntervals.on('click',function (event) {
          jIntervals.removeClass('active');
          $(this).addClass('active');
          oThis.initTransactionAndOstVolumeGraph( $(this).data('interval'))
        })
      }




    }




  }(window,jQuery)
)