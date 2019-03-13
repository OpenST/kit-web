;
(function (window, $) {


  var columnChartURL = '/columnChartDummy.json';
  var comboChartUrl  = '/combo_dummy.json';
  var lineChartUrl   = '/line_dummy.json';

  var columnChart    = new GoogleCharts();
  var lineChart      = new GoogleCharts();
  var comboChart     = new GoogleCharts();

  var chartTextStyle = {color: '597a84',fontSize: 10}

  comboChart.draw({
    ajax: {
      url: comboChartUrl
    },
    selector: '#comboChart',
    type: 'ComboChart',
    noDataHTML: $('#graphsNodataHTML').html(),
    loadingHTML: "<div class='loader'></div>",
    columns: [
      {
        type: 'date',
        opt_label: 'Date',
        opt_id: 'timestamp'
      },
      {
        type: 'number',
        opt_label: 'No. of Transactions',
        opt_id: 'token_transactions'
      },
      {
        type: 'number',
        opt_label: 'Volume of Transactions in ost ',
        opt_id: 'token_ost_volume'
      }
    ],
    options: {
      seriesType: 'bars',
      series: {
        0: {
          targetAxisIndex: 0,
          labelInLegend: 'No. of Transactions (left axis)',
          color: 'ff8385',
          type: 'line'
        },
        1: {
          targetAxisIndex: 1,
          labelInLegend: 'Volume of Transactions in ost (right axis)',
          color: 'b2dde6'
        }
      },
      vAxes: {
        0: {
          title: ''
        },
        1: {
          title: '',
          format: 'short'
        }
      },
      lineWidth: 2,
      bar: {
        groupWidth: 30
      },
      legend: {
        alignment: 'end',
        position: 'top',
        textStyle: chartTextStyle
      },
      chartArea: {
        width: '90%',
        height: '80%'
      },
      hAxis: {
        gridlines: {
          color: 'transparent',
          count: 12
        },
        textStyle: chartTextStyle
      },
      vAxis: {
        gridlines: {
          color: 'e3eef3'
        },
        textStyle: chartTextStyle
      }
    },
  });

  lineChart.draw({
    ajax:{
      url:lineChartUrl
    },
    // data:[['0','0','0','0'],['aug 18',0,0,0],['aug 19',4,3,2],['aug 20',5,4,3],['aug 21',1,5,2],['aug 22',2,3,4]],
    selector: '#lineChart',
    type :'LineChart',
    noDataHTML: $('#transactionsbytype').html(), //TODO
    loadingHTML: "<div class='loader'></div>",
    columns : [
      {
        type: 'date',
        opt_label: 'Date',
        opt_id: 'timestamp'
      },
      {
        type: 'number',
        opt_label: 'User to User',
        opt_id: 'transactionType1'
      },
      {
        type: 'number',
        opt_label: 'Company To User',
        opt_id: 'transactionType2'
      },
      {
        type: 'number',
        opt_label: 'User to Company',
        opt_id: 'transactionType3'
      }
    ],
    options:{
      series:{
        0:{
          labelInLegend: 'User to User',
          color:'yellow'
        },
        1:{
          labelInLegend:'Company to User',
          color:'red'
        },
        2:{
          labelInLegend:'User to company',
          color:'blue'
        }
      },
      legend: {
        alignment: 'end',
        position: 'top',
        textStyle: {
          color: '597a84',
          fontSize: 10
        }
      },
      chartArea: {
        width: '80%',
        height: '80%'
      },
      hAxis: {
        textStyle: {
          color: '597a84',
          fontSize: 10
        },
        gridlines: {
          color: "#e3eef3"
        },
        format:'MMM d, y'
      },
      vAxis: {
        textStyle: {
          color: '597a84',
          fontSize: 10
        },

        gridlines: {
          color: "#e3eef3"
        }
      }
    }


  });

  columnChart.draw({
   ajax : {
     url:columnChartURL
   },
    selector: '#jColumnChart',
    type: 'ColumnChart',
    noDataHTML: $('#jColumnChartNoData').html(), //TODO
    loadingHTML: "<div class='loader'></div>",
    columns: [  //TODO understand
      {
        type: 'string',
        opt_label: 'Type',
        opt_id: 'type'
      },
      {
        type: 'number',
        opt_label: 'No. of Transactions',
        opt_id: 'total_transfers'
      }
    ],
    options:{
      series: {
        0: {
          labelInLegend: 'Type  of Transaction',
          color: 'f6c62b'
        }

      },
      legend: {
        alignment: 'end',
        position: 'top',
        textStyle: {
          color: '597a84',
          fontSize: 10
        }
      },
      bars: 'vertical',
      bar: {
        groupWidth: 30
      },
      chartArea: {
        width: '80%',
        height: '80%'
      },
      hAxis: {
        textStyle: {
          color: '597a84',
          fontSize: 10
        },
        gridlines: {
          color: "#e3eef3"
        },

        // baselineColor:'#e3eef3',
      },
      vAxis: {
        textStyle: {
          color: '597a84',
          fontSize: 10
        },
        gridlines: {
          color: "#e3eef3"
        },

        // baselineColor:'#e3eef3',

        // viewWindow: {
        //    min: 100,
        //    max: 2500
        //  }
      }
    }

  })

})(window, jQuery);
