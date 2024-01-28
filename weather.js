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