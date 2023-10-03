// state
let currCity = "Chandigarh";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let dateTime = document.querySelector(".weather__datetime");
let weatherForecast = document.querySelector('.weather__forecast');
let weatherTemperature = document.querySelector(".weather__temperature");
let weatherIcon = document.querySelector(".weather__icon");
let weatherMinMax = document.querySelector(".weather__minmax")
let weatherRealfeel = document.querySelector('.weather__realfeel');
let weatherHumidity = document.querySelector('.weather__humidity');
let weatherWind = document.querySelector('.weather__wind');
let weatherPressure = document.querySelector('.weather__pressure');

// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // prevent default action
    e.preventDefault();
    // change current city
    currCity = search.value;
    // get weather forecast 
    getWeather();
    // clear form
    search.value = ""
})

// units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    
    if(units !== "metric"){
        // change to metric
        units = "metric"
        // get weather forecast 
        getWeather()
    }
})

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // change to imperial
        units = "imperial"
        // get weather forecast 
        getWeather()
    }
})

function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600; // convert seconds to hours 

   const date = new Date(timestamp * 1000);
   console.log(convertTimezone);
   console.log(date);
   const options = {
       weekday: "long",
       day: "numeric",
       month: "long",
       year: "numeric",
       hour: "numeric",
       minute: "numeric",
       timeZone: `Etc/GMT${convertTimezone >= 0 ? "+" : "-"}${Math.abs(convertTimezone)}`,
       hour12: true,
   }
   return date.toLocaleString("en-IN", options)
  
}



// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function getWeather(){
    const API_KEY = 'f7baff3d72f5f84f768d9df4f2af207b'

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res => res.json()).then(data => {
   // console.log(data)

    // Data is fetched from API
    // To set the city name and code
    // The innerHTML is used to set their attributes
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    // dateTime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weatherForecast.innerHTML = `<p>${data.weather[0].main}`
    weatherTemperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    weatherIcon.innerHTML = `   <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    weatherMinMax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    weatherRealfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
    weatherHumidity.innerHTML = `${data.main.humidity}%`
    weatherWind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weatherPressure.innerHTML = `${data.main.pressure} hPa`
    //console.log(convertTimeStamp(data.dt, data.timezone));
})
}

document.body.addEventListener('load', getWeather())
