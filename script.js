// WHEN I search for a city
$('#search-button').on('click', function(event){
    var userInput = $('#city-input').val();
    event.preventDefault();

    localStorage.setItem("city", "name");
    document.getElementById("city-input").innerHTML = localStorage.getItem("city");
    console.log(userInput);

    cityHistory.push(userInput);
    weather(userInput);
    renderCities();

    $('#forecast-weather').empty();
    $('#current-icon').empty();
    $('#city-input').val("");

});

// Fetch Current Weather
var weather = function(userInput) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=293af217c8a05dd02fb63f4741d095dd")
    .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
            return response.json();
    })
    .then(data => {
        console.log(data);
        displayWeather(data);
    })
    .catch(console.error);
}

//WHEN I view current weather conditions for that city
function displayWeather(data) {
  var kelvinTemp = data["main"]["temp"];
  var temperature = (kelvinTemp - 273.15) * 1.8 + 32;
  var date = moment().format("MM/DD/YYYY");
  console.log(date);
  var humidity = data["main"]["humidity"];
  var wind = data["wind"];

  var icon = data.weather[0];
  document.querySelector("#current-icon").src =
    "http://openweathermap.org/img/wn/" + icon + ".png";
  var latitude = data["coord"]["lat"];
  var longitude = data["coord"]["lon"];
  // new API for uv index information
  var coordinateURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=e5f561d692ee5b0d5bfef99cb764f31d&lat=" +
    latitude +
    "&lon=" +
    longitude;

  $.ajax({
    url: coordinateURL,
    method: "GET",
  }).then(function (uvIndex) {
    var currentUV = uvIndex.value;

    $("#current-uv").text("UV: " + currentUV);
    console.log(uvIndex.value);
  });

  // THEN I am presented with the city name, the date,
  // an icon representation of weather conditions,
  // the temperature, the humidity, the wind speed, and the UV index
  $("#city-name").text(data.name + " " + date);
  $("#current-temp").text("Temperature: " + temperature.toFixed(1) + "°F");
  $("#current-humidity").text("Humidity: " + data.main.humidity + "%");
  $("#current-wind").text("Wind: " + data.wind.speed + "MPH");
}
// Fetch 5-Day Weather



// and that city is added to the search history
var cityHistory = [];
var renderCities = function() {
  $("#city-list").empty();

  for (i = 0; i < cityHistory.length; i++) {
    var cityDiv = $("<div>").attr("id", "city" + [i]);
    var cityBtn = $("<button>").text(cityHistory[i]).addClass("city-btn");
    var displayDiv = $(cityDiv).prepend(cityBtn);

    $("#city-list").prepend(displayDiv);

    localStorage.setItem("city" + [i], cityHistory[i]);
  }

  $(".city-button").on("click", function () {
    var cityInput = $(this).text;
    $("#forecast-cards").empty();
    $("#current-icon").empty();

    weather(cityInput);
  });
}