
var apiKey = "8726874b1726da562c6f4abe29bcb4d4"
var currentDay = dayjs().format("ddd, MMM D, YYYY H:mm A")
$('#currentDay').text('Today is ' + currentDay);

var places = [];
var cityFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday");
var searchButtonEl = document.querySelector("#recent-search-buttons");

var formSumbitHandler = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getCityWeather(city);
    places.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please enter a City");
  }
  saveSearch();
  pastSearch(city);
};

var saveSearch = function () {
  localStorage.setItem("places", JSON.stringify(places));
};

var getCityWeather = function (city) {
  var apiKey = "8726874b1726da562c6f4abe29bcb4d4";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=` + city + `&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
      get5Day(data.coord)
    });
  });
};

var displayWeather = function (weather, searchCity) {
  //clear old content
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;

  //console.log(weather);

  //create date element
  var currentDate = document.createElement("span");
  var currentDay = dayjs().format("ddd, MMM D, YYYY H:mm A")
  $('#currentDay').text('Today is ' + currentDay);
  citySearchInputEl.appendChild(currentDate);

  //create an image element
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInputEl.appendChild(weatherIcon);

  //create a span element to hold temperature data
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + "??F";
  temperatureEl.classList = "list-group-item";

  //create a span element to hold Humidity data
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  //create a span element to hold Wind data
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";

  //append to container
  weatherContainerEl.appendChild(temperatureEl);

  //append to container
  weatherContainerEl.appendChild(humidityEl);

  //append to container
  weatherContainerEl.appendChild(windSpeedEl);
  }
var get5Day = function (coord) {
 
  var apiKey = "8726874b1726da562c6f4abe29bcb4d4";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial&cnt=5`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

  
// where the 5day gets rendered
var display5Day = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 0; i < forecast.length; i++) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    console.log(dailyForecast)

    //create date element
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = dayjs
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //create an image element
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    //append to forecast card
    forecastEl.appendChild(weatherIcon);

    //create temperature span
    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " ??F";

    //append to forecast card
    forecastEl.appendChild(forecastTempEl);

    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    //append to forecast card
    forecastEl.appendChild(forecastHumEl);

    //append to five day container
    forecastContainerEl.appendChild(forecastEl);
  }
};

var pastSearch = function (pastSearch) {
  // console.log(pastSearch)

  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  searchButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
  
  }
};

cityFormEl.addEventListener("submit", formSumbitHandler);
searchButtonEl.addEventListener("click", pastSearchHandler);