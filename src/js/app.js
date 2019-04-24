$( document ).ready(function() {

  var body = $('body');
  if (body.hasClass('home')) {
    // homepage edit button
    $('.todo__edit button').on('click touch', function() {
      openEditPage( $( this ).parent().parent() );
    });
  } else if (body.hasClass('edit')) {
    // edit page prefill
    var values = getQueryVariables();
    $('.form__name textarea').html(decodeURIComponent(values[0]));
    $('.form__deadline input').val(decodeURIComponent(values[1]));
    $('.form__progress input').val(decodeURIComponent(values[2]));
  }

});

function openEditPage(todo) {
  // get info 
  var info = [];
  todo.children().slice(1, 4).each(function (index, value) {
    info[index] =  $(this).text();
  });
  window.open('edit.html?todo=' + encodeURIComponent(info[0]) + '&deadline=' + encodeURIComponent(info[1]) + '&progress=' + encodeURIComponent(info[2]), '_self');
}

function getQueryVariables() {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0; i < vars.length; i++) {
    vars[i] = vars[i].split("=")[1];
  }
  return(vars);
}