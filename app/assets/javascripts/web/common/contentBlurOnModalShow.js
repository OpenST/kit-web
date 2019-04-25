;
(function (window ,  $) {

  var contentsToBlur = "#app-header , #app-content" ;

  $('.modal').on('show.bs.modal' , function () {
    $(contentsToBlur).addClass('blur-content');
  });

  $('.modal').on('hide.bs.modal' , function () {
    $(contentsToBlur).removeClass('blur-content');
  });


})(window , jQuery);