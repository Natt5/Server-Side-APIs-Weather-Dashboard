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
