;
(function () {
  var ost = ns('ost');

  ost.transaction_by_type = {
    ajax: {
      url: 'lineChartUrl'
    },
    selector: '#lineChart',
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
}());