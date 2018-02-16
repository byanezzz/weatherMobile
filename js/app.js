function initGoogleAPI() {
  var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search")),
    lat,
    long;

  autocomplete.addListener('places_changed', function() {
    var place = autocomplete.getPlaces()[0];
    lat = place.geometry.location.lat();
    long = place.geometry.location.lng();
  });
  $('#search').on('click', function(e) {
    var city_name = $('#city-search').val();
    if (lat && long !== '') {
      e.preventDefault();
      $('.form').fadeOut(100, function() {
        weatherReport(lat, long);
        $('.search-weather').append('<button id="back" class="btn btn-primary btn-lg btn-block">Nueva Búsqueda</button><div class="container"><h4 class="city">' + city_name + '</h4><div class="list-reset" id="forecast"></div></div>');
        imgBackground();
      });
    }
  });
}

function skycons() {
  var i,
    icons = new Skycons({
      "color": "#ffffff",
      "resizeClear": true
    }),
    list = [
      "clear-day",
      "clear-night",
      "partly-cloudy-day",
      "partly-cloudy-night",
      "cloudy",
      "rain",
      "sleet",
      "snow",
      "wind",
      "fog"
    ];

  for (var i = list.length; i--;) {
    var weatherType = list[i],
      elements = document.getElementsByClassName(weatherType);
    for (e = elements.length; e--;) {
      icons.set(elements[e], weatherType);
    }
  }
  // animación de iconos
  icons.play();
}

function imgBackground() {
  var flickrAPI = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?'
  var flickrOptions = {
    tags: 'landscape',
    format: 'json'
  }
  var renderPhotos = function(data) {
    console.log(data);
    var background = '<img id="background" src="' + data.items[0].link + '">'
    $('.search-weather').append('<img id="background" src="' + data.items[0].media.m + '">');
  }
  $.getJSON(flickrAPI, flickrOptions, renderPhotos)
}

function weatherReport(latitude, longitude) {
  var apiKey = 'e1d8e30c70b1dd22b092f44688bc3a6b',
    url = 'https://api.darksky.net/forecast/',
    lati = latitude,
    longi = longitude,
    api_call = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&lang=es&units=si&callback=?";

  var days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];
  // Llamada al API DarkSky 
  $.getJSON(api_call, function(forecast) {
    var dateTday = new Date(forecast.daily.data[0].time * 1000),
      tday = days[dateTday.getDay()],
      skiconsTday = forecast.daily.data[0].icon,
      humidityTday = forecast.daily.data[0].humidity,
      summaryTday = forecast.daily.data[0].summary,
      tempTday = Math.round(forecast.hourly.data[0].temperature),
      tempMinTday = Math.round(forecast.daily.data[0].temperatureMin),
      tempMaxTday = Math.round(forecast.daily.data[0].temperatureMax);

    function createCard() {
      $("#forecast").append(
        `<div class="shade-${skiconsTday}"><div class="card-container"><div><div class="front card"><div>` +
        `<div class="graphic"><canvas class="center-block ${skiconsTday}"></canvas></div>` +
        `<div><b>Fecha</b>: ${tday} </div> ` +
        `<div><b>Temperatura</b>: ${tempTday} °C</div>` +
        `<div><b>Mín Temp.</b>: ${tempMinTday} °C</div>` +
        `<div><b>Máx Temp.</b>: ${tempMaxTday} °C</div> ` +
        `<div><b>Humedad</b>: ${Math.round(humidityTday*100)} %</div>` +
        `<p class="summary"> ${summaryTday} </p></div> ` +
        `<button class="col-lg-6 btn btn-default btn-lg btn-block" id="next">Detalle semanal</button></div>`
      );
      $('#next').on('click', function() {
        $("#forecast").empty();
        for (var i = 0; i < forecast.daily.data.length; i++) {
          var date = new Date(forecast.daily.data[i].time * 1000),
            day = days[date.getDay()],
            skicons = forecast.daily.data[i].icon,
            humidity = forecast.daily.data[i].humidity,
            summary = forecast.daily.data[i].summary,
            temp = Math.round(forecast.hourly.data[i].temperature),
            tempMin = Math.round(forecast.daily.data[i].temperatureMin),
            tempMax = Math.round(forecast.daily.data[i].temperatureMax);

          $("#forecast").append(
            `<div class=\"row\"><div class=\"col-xs-3\"> ${day} </div>` +
            `<div class=\"col-xs-2\"> ${temp} °C</div>` +
            `<div class=\"col-xs-3\"> ${tempMin} - ${tempMax} °C</div>` +
            `<div class= \"col-xs-2\"> ${Math.round(humidity*100)} %</div>` +
            `</div>`
          );
        }
        $("#forecast").append('<button id="return" class="btn btn-default btn-lg btn-block">Regresar</button></div>');
        $('#return').on('click', function() {
          $("#forecast").empty();
          createCard();
          skycons();
        });
      });
    }
    createCard();
    skycons();
  });

  $('body').on('click', '#back', function() {
    window.location.reload(true);
  })
}