// state
let currCity = "Puerto Princesa";
let units = "metric";

// SelectorsF
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

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
    search.value = "";
});

document.body.addEventListener('submit', '.weather__search', function(e) {
    e.preventDefault();
});

document.querySelector(".weather__search").addEventListener('touchend', e => {
    e.preventDefault();
});
// units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // change to metric
        units = "metric";
        // get weather forecast 
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // change to imperial
        units = "imperial";
        // get weather forecast 
        getWeather();
    }
});

function convertTimeStamp(timestamp, timezone){
     const convertTimezone = timezone / 3600; // convert seconds to hours 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options);
}

// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country);
}

function getWeatherByCity(city) {
    const API_KEY = '4cc3334b0feaa2acb87f0dbfc0c8ba36';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            updateWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const API_KEY = '4cc3334b0feaa2acb87f0dbfc0c8ba36';

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`)
                .then(res => res.json())
                .then(data => {
                    updateWeather(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        }, error => {
            console.error('Error getting user location:', error);
            getWeatherByCity(currCity);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        getWeatherByCity(currCity);
    }
}

function updateWeather(data) {
    console.log(data);
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weather__forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
    weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
    weather__humidity.innerHTML = `${data.main.humidity}%`;
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`; 
    weather__pressure.innerHTML = `${data.main.pressure} hPa`;
}

// Initial weather fetch based on location
getWeatherByLocation();


/* Typewrite Animation */
const phrases = ["Sunny?", "Raining?", "Cloudy?","Windy?"];
const typewriteElement = document.getElementById("typewrite");
const cursorElement = document.getElementById("cursor");

let sleepTime = 100;

let curPhraseIndex = 0;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const writeloop = async () => {
    while (true) {
        let curWord = phrases[curPhraseIndex];

        for (let i = 0; i < curWord.length; i++) {
            typewriteElement.innerText = curWord.substring(0, i + 1);
            await sleep(sleepTime);
        }
        await sleep(sleepTime * 10);

        for (let i = curWord.length; i > 0; i--) {
            typewriteElement.innerText = curWord.substring(0, i - 1);
            await sleep(sleepTime);
        }
        await sleep(sleepTime * 5);

        if (curPhraseIndex === phrases.length - 1) {
            curPhraseIndex = 0;
        } else {
            curPhraseIndex++;
        }
    }
};

writeloop();

