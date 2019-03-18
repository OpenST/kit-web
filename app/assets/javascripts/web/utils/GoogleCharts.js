;(function (window, $) {

  var GoogleCharts = function ( config ) {
    var oThis = this;
    $.extend( oThis, config );
    oThis.load();

  };

  GoogleCharts.prototype = {

    constructor: GoogleCharts,
    version: 'current',
    packages: ['corechart'],
    data: null,
    columns: null,
    ajax: null,
    options: null,
    selector: null,
    type: null,
    tsUnixToJs: true,
    noDataHTML: '<div class="noDataHTML">No data to populate graphs</div>',
    loadingHTML: '<div style="width:60px;font-size:12px;margin:0 auto">Loading...</div>',
    loadingClass: 'blur-content-5',

    /*
     * Initiates Google Charts by google.charts.load
     */
    load: function(){
      var oThis = this;
      if (typeof google != "undefined" && typeof google.charts != "undefined") {
        google.charts.load(oThis.version, {packages: oThis.packages});
        console.log('Google charts loaded and ready to draw...');
      } else {
        console.warn('Google charts not loaded. Include https://www.gstatic.com/charts/loader.js');
      }
    },

    showHideLoading : function( isToBlur ){
      var oThis =this,
          jELBlur = $(oThis.selector).find('> div');
      if( jELBlur && oThis.loadingClass ) {
        isToBlur ?  jELBlur.addClass( oThis.loadingClass ) : jELBlur.removeClass( oThis.loadingClass );
      }
      $(oThis.selector).prepend('<span class="loading-wrapper" style="position:absolute;left:0;z-index:1;width:100%;">'+oThis.loadingHTML+'</span>');
    },

    /*
     * Draw method to be called externally
     * Can pass config here
     */
    draw: function(config , callback ){
      var oThis = this;

      if( config ){
        $.extend( oThis, config );
      }

      if ( ($.isEmptyObject(oThis.data) && $.isEmptyObject(oThis.ajax)) || !oThis.selector || !oThis.type ){
        console.warn('Mandatory inputs for Google charts are missing [data OR ajax, options, selector, type]');
        return false;
      }

      if(!$(oThis.selector)[0]){
        console.warn('Selector '+oThis.selector+' not found in DOM');
        return false;
      }

      if(!$.isEmptyObject(oThis.ajax)){
        var ajaxObj = {
          beforeSend: function(){
            oThis.showHideLoading( true );
          },
          success: function(response) {
            if( response.success ){
              oThis.data = oThis.ajaxCallback(response);
              console.log('AJAX data: ', oThis.data);
              console.log('Drawing chart using AJAX data and callback...');
              if(oThis.data.length === 0){
                oThis.renderBlank();
              } else {
                oThis.render();
              }
            }
            callback && callback( response );
          }
        };
        $.extend( ajaxObj, oThis.ajax );

        $.ajax(ajaxObj);
      } else {
        console.log('Drawing chart using using data...');
        oThis.render();
      }

    },

    /*
     * Make data using columns or only data
     */
    makeData: function(rawData){
      var oThis = this;

      if(!$.isEmptyObject(oThis.columns)){
        var data = new google.visualization.DataTable();
        $.each( oThis.columns, function( index, value ) {
          data.addColumn(value);
        });
        oThis.data.splice(0, 1);
        data.addRows(oThis.data);
        console.log('Using custom columns and data to build DataTable...');
      } else {
        var data = google.visualization.arrayToDataTable(rawData);
        console.log('Using data via arrayToDataTable...');
      }

      return data;
    },

    /*
     * Rendering chart
     */
    render: function(callback){
      var oThis = this;
      google.charts.setOnLoadCallback(function(){
        var data = oThis.makeData(oThis.data),
          sSelector = oThis.graphSelector || oThis.selector
        ;
        $(oThis.selector).find('.loader').hide();
        console.log('Drawing '+oThis.type+' chart in '+sSelector);
        var chart = new google.visualization[oThis.type]($(sSelector)[0]);
        chart.draw(data, oThis.options);
      });
    },

    renderBlank: function(){
      var oThis = this;
      $(oThis.selector).html(oThis.noDataHTML);
    },

    /*
     * dataSrc to specify custom data source in ajax response
     */
    dataSrc: function(response){
      return response.data[response.data.result_type];
    },

    /*
     * ajaxCallback boilerplate
     */
    ajaxCallback: function(response){
      var oThis = this;
      var response_data = oThis.dataSrc(response);
      if($.isEmptyObject(response_data)){
        return [];
      }
      return oThis.dataParser(response_data);
    },

    dataParser: function(response_data){
      var oThis = this;
      var data = [];
      var header_temp = Object.keys(response_data[0]);
      var header = [];
      var header_type = [];
      if(!$.isEmptyObject(oThis.columns)){
        $.each( oThis.columns, function( index, value ) {
          if(header_temp.indexOf(value.opt_id) > -1){
            header.push(value.opt_id);
            header_type.push(value.type);
          }
        });
      } else {
        header = header_temp;
      }
      data.push(header);
      $.each( response_data, function( index, value ) {
        var row = [];
        header.forEach(function(elem, index){
          if(header_type[index] === 'string'){
            row.push(String(value[elem]));
          } else if (header_type[index] === 'number'){
            row.push(Number(value[elem]));
          } else if (header_type[index] === 'boolean'){
            row.push(Boolean(value[elem]));
          } else if (header_type[index] === 'date' || header_type[index] === 'datetime' || header_type[index] === 'timeofday'){
            if(oThis.tsUnixToJs === true && typeof value[elem] === 'number' && value[elem] > 1262304000 && (new Date(value[elem])).getYear() < 1971){
              row.push(new Date(value[elem]*1000));
            } else {
              row.push(new Date(value[elem]));
            }
          }
        });
        data.push(row);
      });
      return data;
    }

  };

  window.GoogleCharts = GoogleCharts;

})(window, jQuery);