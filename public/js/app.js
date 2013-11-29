function showMap(address) {
  var pos, mapOptions, map, marker;
  pos = new google.maps.LatLng(address.latitude, address.longitude);
  mapOptions = {
    zoom: 7,
    center: pos,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: address.venue
  });
}

$(document).ready(function () {
  $('#startDate').datetimepicker({ language: 'pt-BR' });
  $('#endDate').datetimepicker({ language: 'pt-BR' });

  $('#citySearch').typeahead({
    source: function (query, process) {
      return $.get('/cities/search/'+query, function(data) {
        return process(data)
      })
    }
  })

  $('#attending').submit(function(e) {
    var id = $(this.meetup_id).val()
      , csrf = $(this._csrf).val()
    e.preventDefault()

    $.ajax({
      url: '/meetups/'+id+'/attending',
      type: 'PUT',
      data: {_csrf: csrf},
      dataType: "json",
      success: function(result) {
        var node = $('#feedback-box')
        node.html(result.message).removeClass('hide')
        if (result.status === 'ok') {
          node.addClass('alert-success')
          location.reload()
        } else {
          node.addClass('alert-error')
        }
      }
    })
  })

  $('#share').submit(function(e) {
    var id = $(this.meetup_id).val()
      , csrf = $(this._csrf).val()
    e.preventDefault();

    $.ajax({
      url: '/meetups/'+id+'/share',
      type: 'PUT',
      data: {_csrf: csrf},
      dataType: "json",
      success: function(result) {
        var node = $('#feedback-box')
        node.removeClass('hide')
        if (result.status === 'ok') {
          node.html("Updated Facebook successfully").addClass('alert-success')
        } else {
          node.html(result.message.message).addClass('alert-error')
        }
      }
    })
  })
});
