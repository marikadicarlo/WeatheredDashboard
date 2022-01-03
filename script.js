$('#search-button').on('click', function(event){
    var userInput = $('#city-input').val();
    event.preventDefault();

    cityHistory.push(userInput);
    weather(userInput);
    renderCities();
});

var weather = function(userInput) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=293af217c8a05dd02fb63f4741d095dd")
    .then(response => response.json())
    .then(data => {
        var nameValue = data['name'];


        
    })


}




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