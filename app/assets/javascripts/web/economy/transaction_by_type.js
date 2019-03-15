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
    noDataHTML: $('#transactionsbytype').html(), //TODO
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
          color: 'yellow'
        },
        1: {
          labelInLegend: 'Company to User',
          color: 'red'
        },
        2: {
          labelInLegend: 'User to company',
          color: 'blue'
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
        format: 'MMM d, y'
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
    ajax: {

    },
    selector: '#pieChart',
    type: 'PieChart',
    noDataHTML: $('#transactionsbytype').html(), //TODO
    loadingHTML: "<div class='loader'></div>",
    columns:[],
    options: {
      pieHole: 0.7,
      pieSliceText: 'none',
      pieSliceBorderColor: 'none',
      colors: ['f6c62b','88c7ca','34445b'],
      backgroundColor: 'transparent',
      enableInteractivity: false,
      legend: 'none',
      chartArea: {
        width: 180,
        height: 180,
        top: 10,
        left: 10
      }
    }
  }
}());