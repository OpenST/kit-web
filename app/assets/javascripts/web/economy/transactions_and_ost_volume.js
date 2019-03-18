;
(function () {
  var ost = ns('ost');


  ost.transactions_and_ost_volume = {
    config: {
    ajax: {
      url: 'url'
    },
    selector: '#comboChart',
    type: 'ComboChart',
    noDataHTML: $('#transactionsAnsOstVolumeNodataHTML').html(),
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
        textStyle: {color: '597a84',fontSize: 10}
      }
    },
  },

    filterOptionsMap : {
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
  }





}());