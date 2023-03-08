//setting API Key from open weather
var APIkey = 'fc33bb2e8ba02c7ae3ef4f857902ce74'

//Manipulating ID via DOM
var weatherContainer = document.getElementById("weatherContainer");
var foreCastContainer = document.getElementById("foreCastContainer");
var textInput = document.getElementById("text-input")
var submitButton = document.getElementById("search-button")
var saveHistory = document.getElementById("history-container")

//Fetching API, getting latitude and longitude for the city
async function getCoordinates(city) {
  var lat, long;
  var coordinatesURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=' + 1 + '&appid=' + APIkey;
  var response = await fetch(coordinatesURL);

  // check if respone is ok
  if (response.ok) {
    var jsonData = await response.json();
    if (jsonData.length != 0) {
      lat = jsonData[0].lat;
      long = jsonData[0].lon;
      // get the weather forecast if the respone is ok
      getWeatherForecast(lat, long);
      // if not saved to history, save it
      if (!saveHistory.innerHTML.toLowerCase().includes(city.toLowerCase())) {
        saveToHistory(city)
      }
      //saving the city to localstorage searched by user
      localStorage.setItem('city', city)
    }
    else {
      // if city not valid, display message
      document.getElementById("alert-message").innerHTML = "Please enter a valid city!!"
    }
  }
  else {
    console.log("HTTPS Error");
    return;
  }
}

//Using the value of latitude and longitude respectively to get current weather and 5 days forecast 
async function getWeatherForecast(lat, long) {
  var weatherForecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIkey;
  var response = await fetch(weatherForecastURL);
  if (response.ok) {
    var jsonData = await response.json();
    console.log(jsonData)
    showCurrentWeather(jsonData)
    show5DaysForeCast(jsonData)
  }
  else {
    console.log("error")
  }
}

//Funtion to show the current weather of a city and also getting the values
function showCurrentWeather(jsonData) {
  var date = new Date(jsonData.list[0].dt * 1000).toLocaleDateString();
  var cityName = jsonData.city.name
  var icon = jsonData.list[0].weather[0].icon;
  var temp = jsonData.list[0].main.temp
  var humidity = jsonData.list[0].main.humidity
  var wind = jsonData.list[0].wind.speed

  var cityrow = document.createElement("div");
  cityrow.className = "current-weather";

  var img = document.createElement('img');
  img.src = "https://openweathermap.org/img/w/" + icon + ".png";
  img.alt = jsonData.list[0].weather[0].description;

  var currentCity = document.createElement("h2");
  currentCity.innerHTML = cityName + " (" + date + ")";
  cityrow.appendChild(currentCity);
  cityrow.appendChild(img);

  var cityTemperature = document.createElement("p");
  cityTemperature.innerHTML = "Temp : " + temp + "&deg;F";
  cityrow.appendChild(cityTemperature);

  var cityWind = document.createElement("p");
  cityWind.innerHTML = "Wind: " + wind + " MPH";
  cityrow.appendChild(cityWind);

  var cityHumidity = document.createElement("p");
  cityHumidity.innerHTML = "Humidity: " + humidity + " %";
  cityrow.appendChild(cityHumidity);
  weatherContainer.innerHTML = ''

  // appends to weather container
  weatherContainer.appendChild(cityrow)
}

// filtering out the arrays to show weather of certain time for the forcast of 5 days
function show5DaysForeCast(jsonData) {
  var forecast = jsonData.list.filter(function (data, index) {
    return index != 0 && index % 7 === 0;
  });

  foreCastContainer.innerHTML = '';
  document.getElementById("forecastTitle").style.display = "block"

  //looping through the 5 days forecast.
  for (var i = 0; i < forecast.length; i++) {
    var date = new Date(forecast[i].dt * 1000).toLocaleDateString();
    var temp = forecast[i].main.temp
    var humidity = forecast[i].main.humidity
    var wind = forecast[i].wind.speed
    var icon = forecast[i].weather[0].icon;

    //Appending the html elements in one conatiner
    var box = document.createElement("div");
    box.className = "weather-box";
    box.id = "box" + i;

    var forecastDate = document.createElement("h2");
    forecastDate.innerHTML = date;
    box.appendChild(forecastDate);

    var img = document.createElement('img');
    img.src = "https://openweathermap.org/img/w/" + icon + ".png";
    img.alt = forecast[i].weather[0].description;
    box.appendChild(img);

    var cityTemperature = document.createElement("p");
    cityTemperature.innerHTML = "Temp : " + temp + "&deg;F";
    box.appendChild(cityTemperature);

    var cityWind = document.createElement("p");
    cityWind.innerHTML = "Wind: " + wind + " MPH";
    box.appendChild(cityWind);

    var cityHumidity = document.createElement("p");
    cityHumidity.innerHTML = "Humidity: " + humidity + " %";
    box.appendChild(cityHumidity);

    // Appends to forecast container
    foreCastContainer.appendChild(box);
  }
}

//Adding event listener to submit button
submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  var textValue = textInput.value.trim()
  if (textValue == "") {
    document.getElementById("alert-message").innerHTML = "Please enter a city!"
    return;
  }
  document.getElementById("alert-message").innerHTML = "";
  getCoordinates(textValue)
})

// Adding listener to saved city in history 
saveHistory.addEventListener("click", function (event) {
  var city = event.target.textContent;
  getCoordinates(city);
})

// Saving the city to history
function saveToHistory(city) {
  var button = document.createElement("button")
  button.textContent = city
  saveHistory.appendChild(button);
}

// Load the last searched city when the page load, if it exists in localstorage
if (localStorage.getItem("city") !== null) {
  getCoordinates(localStorage.getItem("city"));
}












