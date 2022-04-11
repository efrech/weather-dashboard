//global variables
let searchHistory = [];
let searchCity = {
  name: "",
  temp: "",
  wind_speed: "",
  humidity: "",
  uvi: "",
};
// const apiKey = "ab6a1a7a5118ab88f137e081056c95e1";
//DOM element references
//#search form, #search-input, #today, #forecast, #history
let searchForm = $("#search-form");
let searchInputEl = $("#search-input");
let todayBox = $("#today_box");
let searchHistoryBox = $("#search-history");
let forecastBox = $("#forecast-box");
let searchDisplayBox
let weatherApiUrl
let geoApiUrl

//add TimeZone for days.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

//function to display search history
//localStorage to store any persistent data.
// geolocation API var weatherApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=$(city)&limit=5&appid=ab6a1a7a5118ab88f137e081056c95e1`;


function geoData(searchInput) {
  geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput+ "&limit=1&appid=ab6a1a7a5118ab88f137e081056c95e1"
    fetch(geoApiUrl)
      .then(function(res) {
          return res.json()
      })
      .then(function(data){
        geoHandleSucess(data);
      });
  }

function geoHandleSucess(data){
  if(data.length == 0) {
    alert("nothing found");
    return;
  } else {
    searchCity["name"] = data[0]["name"];
    //call function that stores data
    updateSearchHistory(searchCity["name"]);
    callWeatherData([data[0]["lat"], data[0]["lon"]]);
  }
}

//store city search
function updateSearchHistory(cityName){
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory == null) {
    localStorage.setItem("searchHistory", JSON.stringify([cityName]));
  } else {
    searchHistory.unshift(cityName);
    searchHistory = searchHistory.slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
  displayHistory();
}

function callWeatherData(latLon){
  weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+latLon[0]+ "&lon=" + latLon[1]+ "&units=imperial&exclude=hourly&appid=ab6a1a7a5118ab88f137e081056c95e1"

weatherData(weatherApiUrl);
}  


function weatherData(weatherApiUrl) {
    fetch(weatherApiUrl)
      .then(function(res) {
          return res.json()
      })
      .then(function(data){
        handleWeatherData(data);
      });
  }

function handleWeatherData(data){
  data["name"] = searchCity["name"];
  searchCity = data;
  console.log(searchCity);
  var todayUl = document.createElement('ul');
  todayBox.append(todayUl);
  todayUl.innerHTML = "<li>City: " +  searchCity["name"] + " (" + dayjs().format("MM/DD/YYYY") + ")" + " <img src='http://openweathermap.org/img/wn/" + searchCity["current"]["weather"][0]["icon"] + ".png' /></li>" +
  "<li> Temp: " + searchCity["current"]["temp"] + " F</li>" +
  "<li> Wind: " + searchCity["current"]["wind_speed"] + " MPH</li>" +
  "<li> Humidity: " + searchCity["current"]["humidity"] + " %</li>" +
  "<li> UV Index: " + searchCity["current"]["uvi"] + "</li>";
  var daily = data["daily"].slice(0, 5);
  var daySum = 1;
  for (day in daily){
    var forecastDiv = document.createElement('div')
    forecastBox.append(forecastDiv);
    forecastDiv.innerHTML = dayjs().add(daySum, 'day').format("MM/DD/YYYY") + " <img src='http://openweathermap.org/img/wn/" + daily[day]["weather"][0]["icon"] + ".png' /></li>" +
    "<li> Temp: " + daily[day]["temp"]["day"] + " F</li>" +
    "<li> Wind: " + daily[day]["wind_speed"] + " MPH</li>" +
    "<li> Humidity: " + daily[day]["humidity"] + " %</li>" ;
    daySum++;
  }
}

function displayHistory(){
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  var historyUl = document.createElement('ul');
  searchHistoryBox.append(historyUl);
  for (city in searchHistory){
    var cityLi = document.createElement('li')
    cityLi.textContent = searchHistory[city];
    historyUl.appendChild(cityLi);
  }
}

  var formSubmit = function (event) {
    event.preventDefault();
  
    var searchInput = searchInputEl.val();
  
    if (!searchInput) {
      alert('You need to fill out the form!');
      return;
    }
  
    // print card with guest data
    geoData(searchInput);
  
    // reset form
    searchInputEl.val('');
  };

  searchForm.on('submit', formSubmit);


//search for a city and retrieve current and future conditions for that city, including: city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index. and that city is added to the search history. 
//UV index, then user is presented with a color that indicates whether the conditions are favorable, moderate, or severe
//view future weather conditions for that city, then user is presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// when clicking on a city in the search history, then again presented with current and future conditions for that city