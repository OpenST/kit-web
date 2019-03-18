;
(function () {
  var ost = ns('ost');

  ost.transaction_by_type_line_graph = {
    ajax: {
      url: 'lineChartUrl'
    },
    selector: '#tx_by_type',
    graphSelector: '#lineChart',
    type: 'LineChart',
    noDataHTML: $('#transactionByTypeNodataHTML').html(), //TODO
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
        opt_id: 'user_to_user_transfer'
      },
      {
        type: 'number',
        opt_label: 'Company To User',
        opt_id: 'company_to_user_transfer'
      },
      {
        type: 'number',
        opt_label: 'User to Company',
        opt_id: 'user_to_company_transfer'
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
        format: 'MMM d'
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
  }

  ost.transaction_by_type_pie_chart = {
    selector: '#pieChart',
    type: 'PieChart',
    noDataHTML: $('#transactionsbytype').html(), //TODO
    loadingHTML: "<div class='loader'></div>",
    columns:[
      {
        type: 'string',
        opt_label: 'Category',
        opt_id: 'category'
      },
      {
        type: 'number',
        opt_label: 'Value',
        opt_id: 'value'
      }
    ],
    options: {
      pieHole: 0.7,
      pieSliceText: 'none',
      pieSliceBorderColor: 'none',
      colors: ['f6c62b','ff5f5a','84d1d4'],
      backgroundColor: 'transparent',
      enableInteractivity: false,
      legend: 'none',
      chartArea: {
        width: 200,
        height: 200,
        // top: 10,
        // left: 10
      }
    }
  }
}());