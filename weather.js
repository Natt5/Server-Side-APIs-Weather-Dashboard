// console.log('js is loaded');

//event listener to be aable to submit the form

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const city = document.getElementById('search-input').ariaValueMax.trim();
    if (city) {
        fetchWeatherData(city);
        saveSearchHistory (city);
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
    const apiKey = 'fb9672b35cbc85ae3baf12fecedeb034';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Current weather data not found');
        }
        return response.json();
    })
    .then(data => {
        updateCurrentWeather(data, city);
    })
    .catch(error => {
        console.error('Error fetching current weather:', error);
    });
}

function updateCurrentWeather(data, city) {
    const ukDate = new Date().toLocaleDateString('en-GB');
    document.getElementById('city-name'.textContent = `Today in ${city}, ${country}`);
    document.getElementById('current-date').textContent = ukDate;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed.toFixed(1)} m/s`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('weather-icon').style.display = 'block';
}

//fetching the 5 days forecast
function fetchForecast(city) {

const apiKey = 'fb9672b35cbc85ae3baf12fecedeb034';
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Forecast data not found.');
        }
        return response.json();
    })
    .then(data => {
        updateForecastData(data);
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
    });
}

//saving search history here

function saveSearchHistory(city) {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searches.includes(city)) {
        searches.unshift(city);
        searches = searches.slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(searches));
    }
}

//to display searched history here 

function displaySearchHistory() {
    const searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';

    searches.forEach(city => {
        const cityEl = document.createElement('button');
        cityEl.textContent = city;
        cityEl.classList.add('list-group-item', 'list-group-item-action');
        cityEl.addEventListener('click', () => {
            document.getElementById('forecast').innerHTML = 'Loading...';
            fetchWeatherData(city); // Fetch both current weather and forecast
        });
        historyContainer.appendChild(cityEl);
    });
}
