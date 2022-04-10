//global variables
const searchHistory = [];
// const weatherApiUrl = "https://api.openweathermap.org/";
// const apiKey = "ab6a1a7a5118ab88f137e081056c95e1";
//DOM element references
//#search form, #search-input, #today, #forecast, #history
let searchForm = document.querySelector("#search-form");
let searchInput
let todayBox
let forecastBox
let searchDisplayBox

//add TimeZone for days.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

//function to display search history
//localStorage to store any persistent data.
// geolocation API var weatherApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=$(city)&limit=5&appid=ab6a1a7a5118ab88f137e081056c95e1`;
var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=imperial&exclude=hourly,daily&appid=ab6a1a7a5118ab88f137e081056c95e1`

function weatherData(weatherApiUrl) {
    fetch(weatherApiUrl)
      .then(function(res) {
          return res.json()
      })
      .then(function(data){
        console.log(data);
      });
  }
  weatherData(weatherApiUrl);

//search for a city and retrieve current and future conditions for that city, including: city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index. and that city is added to the search history. 
//UV index, then user is presented with a color that indicates whether the conditions are favorable, moderate, or severe
//view future weather conditions for that city, then user is presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// when clicking on a city in the search history, then again presented with current and future conditions for that city