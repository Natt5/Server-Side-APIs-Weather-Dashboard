// console.log('js is loaded');

//to capitalise displayed cities

function capitalize(str) {
return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

//event listener to be able to submit the form

document
.getElementById("search-form")
.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("search-input").value.trim();
    if (city) {
    fetchWeatherData(city);
    saveSearchHistory(city);
    displaySearchHistory();
    }
});

function fetchWeatherData(city) {
fetchCurrentWeather(city);
fetchForecast(city);
}

//function that fetches the current weather in the city

function fetchCurrentWeather(city) {
  //inserting API here
const apiKey = "fb9672b35cbc85ae3baf12fecedeb034";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

fetch(url)
    .then((response) => {
    if (!response.ok) {
        throw new Error("Current weather data not found.");
    }
    return response.json();
    })
    .then((data) => {
    updateCurrentWeather(data, city);
    })
    .catch((error) => {
    console.error("Error fetching current weather:", error);
    });
}

function updateCurrentWeather(data, city) {
const ukDate = new Date().toLocaleDateString("en-GB");
const formattedCity = capitalize(city);
const country = data.sys.country;
document.getElementById(
    "city-name"
).textContent = `Today in ${formattedCity}, ${country}`;
document.getElementById("current-date").textContent = ukDate;
document.getElementById(
    "temperature"
).textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
document.getElementById(
    "humidity"
).textContent = `Humidity: ${data.main.humidity}%`;
document.getElementById(
    "wind"
).textContent = `Wind: ${data.wind.speed.toFixed(1)} m/s`;
document.getElementById(
    "weather-icon"
).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
document.getElementById("weather-icon").style.display = "block";

document.getElementById('today').style.display = 'block'; //to hide/show display upon refresh
}

//fetching the 5 days forecast
function fetchForecast(city) {
const apiKey = "fb9672b35cbc85ae3baf12fecedeb034";
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

fetch(url)
    .then((response) => {
    if (!response.ok) {
        throw new Error("Forecast data not found.");
    }
    return response.json();
    })
    .then((data) => {
    updateForecastData(data);
    })
    .catch((error) => {
    console.error("Error fetching forecast data:", error);
    });

  //to update the forecast in the html

function updateForecastData(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    let nextDayIndex = data.list.findIndex((forecast) => {
    const now = new Date();
      const forecastDate = new Date(forecast.dt * 1000);
    return forecastDate.getDate() !== now.getDate();
    });

    data.list.forEach((forecast, index) => {
    if (index >= nextDayIndex && (index - nextDayIndex) % 8 === 0) {
        const dayCard = document.createElement("div");
        dayCard.className = "col";
        const date = new Date(forecast.dt * 1000);
        const ukDate = date.toLocaleDateString("en-GB");
        const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        dayCard.innerHTML = `
                        <div class="card text-bg-dark h-100">
                            <div class="card-body">
                                <h5 class="card-title">${ukDate}</h5>
                                <img src="${iconUrl}" alt="${
        forecast.weather[0].description
        }" class="weather-icon" />
                                <p class="card-text">Temp: ${forecast.main.temp.toFixed(
                                1
                                )}°C</p>
                                <p class="card-text">Humidity: ${
                                forecast.main.humidity
                                }%</p>
                                <p class="card-text">Wind: ${forecast.wind.speed.toFixed(
                                1
                                )} m/s</p>
                            </div>
                        </div>
                    `;
        forecastContainer.appendChild(dayCard);
    }
    });
    document.getElementById('forecast').style.display = 'flex';//new addition to hide/show upon refresh 
}
}

//saving search history here

function saveSearchHistory(city) {
let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
if (!searches.includes(city)) {
    searches.unshift(city);
    searches = searches.slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(searches));
}
}

//to display searched history here

function displaySearchHistory() {
const searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
const historyContainer = document.getElementById("history");
historyContainer.innerHTML = "";

searches.forEach((city) => {
    const cityEl = document.createElement("button");
    cityEl.textContent = city;
    cityEl.classList.add("list-group-item", "list-group-item-action");
    cityEl.addEventListener("click", () => {
    document.getElementById("forecast").innerHTML = "Loading...";
    fetchWeatherData(city);
    });
    historyContainer.appendChild(cityEl);
});
}

window.onload = displaySearchHistory;
