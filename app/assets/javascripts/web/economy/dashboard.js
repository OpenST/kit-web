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
    
    var precision = 5 ;
    
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

      setAxisConfiguration: function(config, filter, res) {
        if(filter){
          var hAxis = utilities.deepGet( config , 'options.hAxis' ),
            gridlines = hAxis['gridlines'] ,
            columns = config['columns']
          ;
          gridlines['count'] = filterOptionsMap[filter].count;
          hAxis['format']=filterOptionsMap[filter].format;
          columns[0] = filterOptionsMap[filter].columns_1;
        }

        if( res && filter == "week" ){
          var result_type = utilities.deepGet(res ,  'data.result_type'),
              ticks = []
          ;
          if(result_type) {
            res.data[result_type].forEach(function (elem) {
              ticks.push(new Date(elem.timestamp * 1000));
            });
            hAxis.ticks = ticks;
          }
        }

      },

      drawTransactionAndOstVolumeGraph: function (filter) {
        var config = $.extend(true , {} , transactions_and_ost_volume ),
            url = oThis.getAjaxUrl( oThis.transactions_and_ost_volume_url , filter) ,
            ajax = utilities.deepGet( config , 'ajax' )
        ;
        ajax['url'] = url ;
        var ajaxCallback = GoogleCharts.prototype.ajaxCallback;
        oThis.transactionAndOstVolumeGraph.ajaxCallback = function( rawData ){
          var gCThis = this ;
          oThis.setAxisConfiguration( config, filter, rawData );
          $.extend( true , gCThis ,  config  );
          return ajaxCallback.call( gCThis , rawData );
        };

        oThis.transactionAndOstVolumeGraph.draw(config);
      },

      drawTransactionByTypeLineGraph: function(filter){
        var config = $.extend(true , {} , transaction_by_type_line_graph ),
          url = oThis.getAjaxUrl( oThis.transaction_by_type_url , filter ) ,
          ajax = utilities.deepGet( config , 'ajax' )
        ;
        ajax['url'] = url ;
        var ajaxCallback = GoogleCharts.prototype.ajaxCallback ,
            render =  GoogleCharts.prototype.render
        ;
        oThis.transactionByTypeLineGraph.ajaxCallback = function( rawData ){
          var gCThis = this ;
          oThis.setAxisConfiguration( config, filter, rawData );
          $.extend( true , gCThis ,  config  );
          return ajaxCallback.call( gCThis , rawData );
        };

        oThis.transactionByTypeLineGraph.render = function(  ){
            var gCThis = this ,
                jEL =  $(oThis.selector)
            ;
            jEL.html("");
            jEL.append('<div id="lineChart"></div>');
            jEL.append('<div id="pieChart"></div>');
            render.call( gCThis );
        };

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
            total  =  0 ,
            isAllZero = true
        ;
  
        data = data.map(function ( item ) {
          var val =  item['value'] ;
          val =  Number( val );
          item['value'] = val ;
          total +=  val ;
          if( val > 0 ){
            isAllZero = false;
          }
          return item;
        });
  
        if( isAllZero ){
          jPieChartContainer.find('#noVolumeHTML').css({display:'block'});
          jPieChartContainer.find('.pie-chart-wrapper').css({display:'none'});
          jPieChartContainer.css({opacity:1});
          return false;
        }

        jPieChartContainer.find('#noVolumeHTML').css({display:'none'});
        jPieChartContainer.find('.pie-chart-wrapper').css({display:'block'});
        total = total.toFixed( precision );
        oThis.updateLegend( data );
        config.readyHandler = oThis.readyHandler;
        oThis.transactionByTypePieChart = new GoogleCharts( config );
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
          oThis.setDate( res, filter );
        });
      },

      setDate : function( res, filter ) {
        var data  = utilities.deepGet( res , 'data.meta'),
          startDate, endDate, displayDate, sDateContainer
        ;
        sDateContainer = $('.date-container');
        startDate = moment(data['startTimestamp'] * 1000).format("D MMM [']YY");
        //if( filter && filter.toLowerCase() != "day" ){
          endDate = moment(data['endTimestamp'] * 1000).format("D MMM [']YY");
        //}
        displayDate = startDate;
        if( endDate ){
          displayDate += " - "+ endDate;
        }
        $(sDateContainer).html(displayDate);
      },

      getAjaxUrl: function (apis ,  val ) {
         if(!val ){
           var url = apis['day'];
           return url;
         }else {
           var url = apis[val];
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