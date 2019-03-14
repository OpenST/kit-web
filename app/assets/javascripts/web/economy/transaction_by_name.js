;
(function(){
  var ost = ns('ost')

  ost.transaction_by_name ={
    ajax : {
      url:'columnChartURL'
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

  }
}())