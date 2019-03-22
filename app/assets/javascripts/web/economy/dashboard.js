;
(function (window,$) {

  var pieChartConstants = {
    legendsLabelAndClass: {
      "user_to_user" : {
        label : "User to User",
        class : 'color-bar-yellow'
      },
      "company_to_user" : {
        label : 'Company to User',
        class : 'color-bar-red'
      },
      "user_to_company" : {
        label : "User to Company",
        class : 'color-bar-blue'
      }
    }
  };

    var ost = ns('ost'),
        graphConfig = ost.dashboardGraphConfig,
        filterOptionsMap               = graphConfig.filterOptionsMap,
        transactions_and_ost_volume    = graphConfig.transactions_and_ost_volume,
        transaction_by_type_line_graph = graphConfig.transaction_by_type_line_graph,
        transaction_by_type_pie_chart  = graphConfig.transaction_by_type_pie_chart,
        transaction_by_name            = graphConfig.transaction_by_name,
        utilities                      = ns("ost.utilities"),

        jTransactionsAndOstVolumeIntervals = $('.transactions_and_ost_volume .interval'),
        jTransactionsByNameIntervals       = $('.transaction_by_name .interval'),
        jTransactionsByTypeIntervals       = $('.transaction_by_type .interval'),
        jTotalTransactions                 = $('.total-transactions-value'),
        jPieChartContainer                 = $('.pie-chart-container');
    var oThis = ost.dashboard = {
      init: function (config) {
          $.extend(oThis,config);
          oThis.initCharts();
          oThis.bindActions();
      },

      initCharts: function(){
        oThis.transactionAndOstVolumeGraph = new GoogleCharts();
        oThis.transactionByNameGraph = new GoogleCharts();
        oThis.transactionByTypeLineGraph = new GoogleCharts();
        oThis.drawTransactionAndOstVolumeGraph() ;
        oThis.drawTransactionByTypeLineGraph() ;
        oThis.drawTransactionByNameGraph() ;

      },

      drawTransactionAndOstVolumeGraph: function (filter) {
        var config = $.extend(true , {} , transactions_and_ost_volume ),
            url = oThis.getAjaxUrl( oThis.transactions_and_ost_volume_url , filter) ,
            ajax = utilities.deepGet( config , 'ajax' )
        ;
        ajax['url'] = url ;

        if(filter){
          var hAxis = utilities.deepGet( config , 'options.hAxis' ),
              gridlines = hAxis['gridlines'] ,
              columns = config['columns']
          ;
          gridlines['count'] = filterOptionsMap[filter].count;
          hAxis['format']=filterOptionsMap[filter].format;
          columns[0] = filterOptionsMap[filter].columns_1;
        }

        oThis.transactionAndOstVolumeGraph.draw( config );
      },

      drawTransactionByTypeLineGraph: function(filter){
        var config = $.extend(true , {} , transaction_by_type_line_graph ),
          url = oThis.getAjaxUrl( oThis.transaction_by_type_url , filter ) ,
          ajax = utilities.deepGet( config , 'ajax' )
        ;
        ajax['url'] = url ;
        oThis.transactionByTypeLineGraph.draw( config, function( res ){
          oThis.drawTransactionByTypePieChart( res );
          var jWrapper = $(oThis.transactionByTypeLineGraph.selector) ;
          jWrapper.find('.loading-wrapper').remove();
          jWrapper.find('.'+oThis.transactionByTypeLineGraph.loadingClass).removeClass( oThis.transactionByTypeLineGraph.loadingClass );
        });
      },

      drawTransactionByTypePieChart: function( response ){
        var config = $.extend(true , {} , transaction_by_type_pie_chart ),
            data   = response.data['transaction_volume'],
            total  = 0
        ;

        oThis.updateLegend( data );
        config.readyHandler = oThis.readyHandler;

        oThis.transactionByTypePieChart = new GoogleCharts( config );
        data.forEach(function ( item ) {
          total +=  item['value'];
        });
        jTotalTransactions.text( total );

        config.data = oThis.transactionByTypePieChart.dataParser(data);
        oThis.transactionByTypePieChart.draw( config  );

      },

      updateLegend: function( data ) {
        var source = document.getElementById("ostTransactionsPieChart").innerHTML,
            template = Handlebars.compile(source),
            context = {},
            html
        ;

        context['data'] = JSON.parse(JSON.stringify(data));
        context['data'].forEach( function( value , index ) {
          var config = utilities.deepGet(pieChartConstants, 'legendsLabelAndClass.'+value.category );
          value['label'] = config['label'];
          value['class'] = config['class'];
        });
        html = template( context );
        $('.pieChartLegend').empty();
        $(".pieChartLegend").append(html);
      },

      readyHandler:function () {
        jPieChartContainer.css({opacity:1});
      },

      drawTransactionByNameGraph : function (filter) {

        var config = $.extend(true , {} , transaction_by_name ),
          url = oThis.getAjaxUrl( oThis.transaction_by_name_url , filter) ,
          ajax = utilities.deepGet( config , 'ajax' )
        ;
        ajax['url'] = url ;

        oThis.transactionByNameGraph.draw( config  , function ( res ) {
          var data  = utilities.deepGet( res , 'data.transaction_by_name'),
              startDate, endDate, dataLength, displayDate, sDateContainer, options
          ;
          sDateContainer = $('.date-container');
          dataLength = data.length;
          startDate = moment(data[0].timestamp * 1000).format("D MMM [']YY");
          if( filter && filter.toLowerCase() != "day" ){
            endDate = moment(data[dataLength - 1].timestamp * 1000).format("D MMM [']YY");
          }
          displayDate = startDate;
          if( endDate ){
            displayDate += " - "+ endDate;
          }
          $(sDateContainer).html(displayDate);
        });
      },

      getAjaxUrl: function (api ,  val ) {
         if(!val && api.indexOf('graph_duration') < 0 ){
           var url = api + '?graph_duration=day';
           return url;
         }else {
           var url = api + '?graph_duration=' + val;
           return url;
         }
      },


      bindActions :function () {
        jTransactionsAndOstVolumeIntervals.on('click',function (event) {
          jTransactionsAndOstVolumeIntervals.removeClass('active');
          $(this).addClass('active');
          oThis.drawTransactionAndOstVolumeGraph( $(this).data('interval'));
        });

        jTransactionsByNameIntervals.on('click',function (event) {
          jTransactionsByNameIntervals.removeClass('active');
          $(this).addClass('active');
          oThis.drawTransactionByNameGraph($(this).data('interval'));
        });

        jTransactionsByTypeIntervals.on('click',function (event) {
          jTransactionsByTypeIntervals.removeClass('active');
          $(this).addClass('active');
          oThis.drawTransactionByTypeLineGraph($(this).data('interval'));
        });
      }




    }




  }(window,jQuery)
)