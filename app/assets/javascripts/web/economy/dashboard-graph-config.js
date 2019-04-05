;
(function(){
  var dashboardGraphConfig = ns('ost.dashboardGraphConfig') ;

  dashboardGraphConfig.transaction_by_name ={
    ajax : {
      url:'columnChartURL'
    },
    selector: '#transactionByNameChart',
    type: 'ColumnChart',
    noDataHTML: $('#transactionByNameNodataHTML').html(),
    errorHTML: $('#transactionByNameErrorHTML').html(),
    loadingHTML: "<div class='loader'></div>",
    columns: [
      {
        type: 'string',
        opt_label: 'Type',
        opt_id: 'name'
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
          labelInLegend: 'Name of Transaction',
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
        width: '90%',
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

  } ;


  dashboardGraphConfig.transaction_by_type_line_graph = {
    ajax: {
      url: 'lineChartUrl'
    },
    selector: '#tx_by_type',
    graphSelector: '#lineChart',
    type: 'LineChart',
    noDataHTML: $('#transactionByTypeNodataHTML').html(),
    errorHTML: $('#transactionByTypeErrorHTML').html(),
    loadingHTML: "<div class='loader'></div>",
    columns: [
      {
        type: 'date',
        opt_label: 'Date',
        opt_id: 'timestamp'
      },
      {
        type: 'number',
        opt_label: 'User to User',
        opt_id: 'user_to_user'
      },
      {
        type: 'number',
        opt_label: 'Company To User',
        opt_id: 'company_to_user'
      },
      {
        type: 'number',
        opt_label: 'User to Company',
        opt_id: 'user_to_company'
      }
    ],
    options: {
      series: {
        0: {
          labelInLegend: 'User to User',
          color: 'f6c62b'
        },
        1: {
          labelInLegend: 'Company to User',
          color: 'ff5f5a'
        },
        2: {
          labelInLegend: 'User to company',
          color: '84d1d4'
        }
      },
      legend: 'none',
      chartArea: {
        width: '90%',
        height: '90%'
      },
      hAxis: {
        textStyle: {
          color: '597a84',
          fontSize: 10
        },
        gridlines: {
          color: "#e3eef3"
        },
        format:'h aa'
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
  } ;

  dashboardGraphConfig.transaction_by_type_pie_chart = {
    selector: '#pieChart',
    type: 'PieChart',
    loadingHTML: "<div class='loader'></div>",
    columns:[
      {
        type: 'string',
        opt_label: 'Category',
        opt_id: 'category_label'
      },
      {
        type: 'number',
        opt_label: 'Value',
        opt_id: 'value'
      }
    ],
    options: {
      pieHole: 0.8,
      pieSliceText: 'none',
      pieSliceBorderColor: 'none',
      colors: ['f6c62b','ff5f5a','84d1d4'],
      backgroundColor: 'transparent',
      legend: 'none',
      chartArea: {
        width: 200,
        height: 200
      }
    }
  } ;

  dashboardGraphConfig.transactions_and_ost_volume = {
      ajax: {
        url: 'url'
      },
      selector: '#comboChart',
      type: 'ComboChart',
      noDataHTML: $('#transactionsAnsOstVolumeNodataHTML').html(),
      errorHTML: $('#transactionsAnsOstVolumeErrorHTML').html(),
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
            title: '',
            gridlines: {
              color: 'e3eef3'
            }
          },
          1: {
            title: '',
            format: 'short',
            gridlines: {
              color: 'e3eef3'
            }
          }
        },
        lineWidth: 2,
        bar: {
          groupWidth: 30
        },
        legend: {
          alignment: 'end',
          position: 'top',
          textStyle: {color: '597a84',fontSize: 10}
        },
        chartArea: {
          width: '90%',
          height: '80%'
        },
        hAxis: {
          format:'h aa' ,
          gridlines: {
            color: 'transparent',
            count: 12
          },
          textStyle: {color: '597a84',fontSize: 10}
        },
        vAxis: {
          gridlines: {
            color: 'e3eef3'
          },
          minorGridlines: {
            count: 0
          },
          textStyle: {color: '597a84',fontSize: 10}
        }
      },
  } ;

  dashboardGraphConfig.filterOptionsMap  = {
    "day" :{
      count : 12 ,
        format :'h aa' ,
        columns_1 : {
        type: 'datetime',
          opt_label: 'Date',
          opt_id: 'timestamp'
      }},
    "week" : {
      count : 7 ,
        format :'EEE' ,
        columns_1 : {
        type: 'date',
          opt_label: 'Date',
          opt_id: 'timestamp'
      }
    },
    "month" : {
      count : 15 ,
        format :'d' ,
        columns_1 : {
        type: 'date',
          opt_label: 'Date',
          opt_id: 'timestamp'
      }
    },
    "year" : {
      count : 12 ,
        format :"MMM''yy" ,
        columns_1 : {
        type: 'date',
          opt_label: 'Date',
          opt_id: 'timestamp'
      }
    }

  }

}());