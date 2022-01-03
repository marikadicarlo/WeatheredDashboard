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

function displayWeather(data) {
    var temperature = data['main']['temp'];
    var date = moment().format('MM/DD/YYYY');
    var humidity = data['main']['humidity'];
    var wind = data['wind'];
    var latitude = data['coord']['lat'];
    var longitude = data['coord']['lon'];

    $("#city-name").text("City Name: " + data.name);
    $("#current-temp").text("Temperature: " + data.main.temp + "°F");
    $("#current-humidity").text("Humidity: " + data.main.humidity + "%");
    $("#current-wind").text("Wind: " + data.wind.speed + "MPH");
}

// Fetch 5-Day Weather
var fiveDayWeather = function(userInput) {
    fetch("https://api.openweathermap.org/data/2.5/forecast/daily?q=" + userInput + "&appid=293af217c8a05dd02fb63f4741d095dd")
    .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
            return response.json();
    }).then(data => {
        console.log(data);
        displayFiveDayWeather(data)
    }).catch(console.error);
}

// function displayFiveDayWeather(data) {
//     var temp = data['main']['temp'];

//     $('#forecast-temp1').text("Temp: " + data.main.temp + "°F");
// };


var cityHistory = [];
var renderCities = function () {
  $("#city-input").empty();

  for (i = 0; i < cityHistory.length; i++) {
    var cityDiv = $("<div>").attr("id", "city" + [i]);
    var cityBtn = $("<button>").text(cityHistory[i]).addClass("city-btn");
    var displayDiv = $(cityDiv).prepend(cityBtn);

    $("#city-input").prepend(displayDiv);

    localStorage.setItem("key" + [i], cityHistory[i]);
  }

  $(".city-button").on("click", function () {
    var cityInput = $(this).text;
    $("forecast-cards").empty();
    $("#current-icon").empty();

    weather(cityInput);
  });
};