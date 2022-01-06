// WHEN I search for a city
$('#search-button').on('click', function(event){
    var userInput = $('#city-input').val();
    event.preventDefault();

    localStorage.setItem("city", "name");
    document.getElementById("city-input").innerHTML = localStorage.getItem("city");
    console.log(userInput);

    cityHistory.push(userInput);
    weather(userInput);
    forecast(userInput);
    renderCities();
  
    $('#five-day-content').empty();
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
var forecast = function (userInput) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      userInput +
      "&appid=293af217c8a05dd02fb63f4741d095dd"
  )
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayForecast(data);
    })
    .catch(console.error);
};


//WHEN I view current weather conditions for that city
function displayWeather(data) {
  var kelvinTemp = data["main"]["temp"];
  var temperature = (kelvinTemp - 273.15) * 1.8 + 32;
  var date = moment().format("MM/DD/YYYY");
  console.log(date);
  var humidity = data["main"]["humidity"];
  var wind = data["wind"];
  var weatherIcon = $("<img>");
  var icon = data.weather[0].icon;
  weatherIcon.attr("src", "https://openweathermap.org/img/wn/" + icon + ".png");

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
    $("#current-uv").css({"background-color": "rgb(243, 57, 88","color": "white", "border-radius": "5px", "padding": "3px"})
  });

  // THEN I am presented with the city name, the date,
  // an icon representation of weather conditions,
  // the temperature, the humidity, the wind speed, and the UV index
  $("#city-name").text(data.name + " " + date);
  $("#current-temp").text("Temperature: " + temperature.toFixed(1) + "°F");
  $("#current-humidity").text("Humidity: " + data.main.humidity + "%");
  $("#current-wind").text("Wind: " + data.wind.speed + "MPH");
  $("#current-icon").append(weatherIcon);
}

function displayForecast(data) {
  for (i = 2; i < 40; i += 8){
    var forecastDiv = $("<div>").attr("id", "number" + [i]).addClass("col-2 five-days");

    var weekday = data.list[i].dt_txt;
    weekday = weekday.slice(0, 10);
    weekday = moment(weekday).format("MM/DD/YYYY");
    weekday = $("<p>").text(weekday);

    var weekIcon = data.list[i].weather[0].icon;
    weekIcon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + weekIcon + ".png");
    

    var weekHumidity = data.list[i].main.humidity;
    weekHumidity = $("<p>").text("Humidity: " + weekHumidity + "%");

    var weekTemp = data.list[i].main.temp;
    var farWeekTemp = (weekTemp - 273.15) * 1.80 + 32;
    farWeekTemp = $("<p>").text("Temp: " + farWeekTemp.toFixed(1) + "°F");

    var weekWind = data.list[i].wind.speed;
    weekWind = $("<p>").text("Wind: " + weekWind + "MPH");

    var finalDiv = $(forecastDiv).append(weekday, weekIcon, farWeekTemp, weekHumidity, weekWind);
    $("#five-day-content").append(finalDiv);
  }
}


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

  $(".city-btn").on("click", function () {
    var cityInput = $(this).text();
    $("#forecast-cards").empty();
    $("#current-icon").empty();

    weather(cityInput);
  });
}