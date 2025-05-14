// My key
const myKey = '642bebcb0a18c1a62985bffe4e7ba1ad'; 
// Url
const weatherEndpoint = 'https://api.openweathermap.org/data/2.5';
// Icons 
const weatherIconPath = 'https://openweathermap.org/img/wn/';

// to Get all DOM elements 
const city_name = document.getElementById('city');
const search_button = document.getElementById('search_button');
const location_button = document.getElementById('location_button');
const search_list = document.getElementById('search_list');
const error_msg = document.getElementById('error_msg');
const errorMessage = document.getElementById('errorMessage');
const cityDisplay = document.getElementById('cityName');
const tempDisplay = document.getElementById('temperature');
const windDisplay = document.getElementById('wind');
const humidDisplay = document.getElementById('humidity');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const forecastContainer = document.getElementById('forecast_page');

// Setup everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    search_button.addEventListener('click', lookupCity);
    location_button.addEventListener('click', fetchMyLocation);
    city_name.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            lookupCity();
        }
    });
    city_name.addEventListener('input', showHistory);
    city_name.addEventListener('focus', showHistory);
    
    // Load search history
    getStoredHistory();
    
    // Show placeholder data
    showPlaceholders();
    
    // Hide dropdown when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!city_name.contains(e.target) && !search_list.contains(e.target)) {
            search_list.classList.add('hidden');
        }
    });
});

// Handle search button click
function lookupCity() {
    const city = city_name.value.trim();
    if (!city) {
        showAlert('You need to type a city name');
        return;
    }
    
    fetchWeatherData(city);
}

// Get weather for a city
async function fetchWeatherData(city) {
    try {
      // Clear any errors
        showAlert(''); 
        
        // Get current weather
        const weatherUrl = `${weatherEndpoint}/weather?q=${city}&units=metric&appid=${myKey}`;
        const weatherResp = await fetch(weatherUrl);
        
        if (!weatherResp.ok) {
            throw new Error("Can't find that city or there's an API problem");
        }
        
        const weatherData = await weatherResp.json();
        
        // Save to history
        addToHistory(city);
        
        // Get location coordinates
        const { lat, lon } = weatherData.coord;
        
        // Get forecast data
        const forecast_Url = `${weatherEndpoint}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${myKey}`;
        const forecastResp = await fetch(forecast_Url);
        
        if (!forecastResp.ok) {
            throw new Error("Something went wrong with the forecast");
        }
        
        const forecastData = await forecastResp.json();
        
        // Update the UI
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        
    } catch (err) {
        console.error('Problem getting weather:', err);
        showAlert(err.message || 'Something went wrong');
    }
}

// Get weather using geolocation
function fetchMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Get current weather
                    const weatherUrl = `${weatherEndpoint}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${myKey}`;
                    const weatherResp = await fetch(weatherUrl);
                    
                    if (!weatherResp.ok) {
                        throw new Error("Can't get weather for your location");
                    }
                    
                    const weatherData = await weatherResp.json();
                    
                    // Get forecast
                    const forecast_Url = `${weatherEndpoint}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${myKey}`;
                    const forecastResp = await fetch(forecast_Url);
                    
                    if (!forecastResp.ok) {
                        throw new Error("Can't get forecast for your location");
                    }
                    
                    const forecastData = await forecastResp.json();
                    
                    // Update UI
                    displayCurrentWeather(weatherData);
                    displayForecast(forecastData);
                    
                    // Update input with city name
                    city_name.value = weatherData.name;
                    
                    // Add to history
                    addToHistory(weatherData.name);
                    
                } catch (err) {
                    console.error('Problem getting weather:', err);
                    showAlert(err.message || 'Something went wrong');
                }
            },
            (err) => {
                console.error('Location error:', err);
                showAlert('Please allow location access in your browser');
            }
        );
    } else {
        showAlert('Your browser does not support location services');
    }
}

// Show current weather
function displayCurrentWeather(data) {
    const cityAndDate = `${data.name} (${new Date().toISOString().split('T')[0]})`;
    const temperature = `🌡️ Temperature: ${data.main.temp.toFixed(2)}°C`;
    const wind = `💨 Wind: ${data.wind.speed.toFixed(2)} M/S`;
    const humidity = `💧 Humidity: ${data.main.humidity}%`;
    const iconCode = data.weather[0].icon;
    const iconUrl = `${weatherIconPath}${iconCode}.png`;
    const description = data.weather[0].description;
    
    cityDisplay.textContent = cityAndDate;
    tempDisplay.textContent = temperature;
    windDisplay.textContent = wind;
    humidDisplay.textContent = humidity;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherDescription.textContent = description;
}

// Show 5-day forecast
function displayForecast(data) {
    forecastContainer.innerHTML = ''; // Clear old forecast
    
   
    const dayForecast = {};
    
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];
        
        // Use noon data or first available for each day
        if (time === '12:00:00' || !dayForecast[date]) {
            dayForecast[date] = item;
        }
    });
    
    // Get next 5 days 
    const dateList = Object.keys(dayForecast).sort();
    const today = new Date().toISOString().split('T')[0];
    const startIdx = dateList[0] === today ? 1 : 0;
    const nextFiveDays = dateList.slice(startIdx, startIdx + 5);
    
    // cards for each day
    nextFiveDays.forEach(date => {
        const forecast = dayForecast[date];
        if (!forecast) return;
        
        const card = document.createElement('div');
        card.className = 'bg-white/10 backdrop-blur-md text-white p-4 rounded-xl shadow text-center';
        
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `${weatherIconPath}${iconCode}.png`;
        const description = forecast.weather[0].description;
        
        card.innerHTML = `
            <h4 class="font-semibold mb-2">${date}</h4>
            <img
                src="${iconUrl}"
                alt="${description}"
                class="mx-auto w-10 mb-2" />
            <p>Temp: ${forecast.main.temp.toFixed(2)}°C</p>
            <p>Wind: ${forecast.wind.speed.toFixed(2)} M/S</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        
        forecastContainer.appendChild(card);
    });
    
    // Fill remaining cards 
    if (nextFiveDays.length < 5) {
        const lastDate = nextFiveDays[nextFiveDays.length - 1];
        const lastDateObj = new Date(lastDate);
        
        for (let i = nextFiveDays.length; i < 5; i++) {
            lastDateObj.setDate(lastDateObj.getDate() + 1);
            const nextDate = lastDateObj.toISOString().split('T')[0];
            
            // Empty card
            const card = document.createElement('div');
            card.className = 'bg-white/10 backdrop-blur-md text-white p-4 rounded-xl shadow text-center';
            
            card.innerHTML = `
                <h4 class="font-semibold mb-2">${nextDate}</h4>
                <img
                    src="${weatherIconPath}03d.png"
                    alt="No data"
                    class="mx-auto w-10 mb-2" />
                <p>Temp: N/A</p>
                <p>Wind: N/A</p>
                <p>Humidity: N/A</p>
            `;
            
            forecastContainer.appendChild(card);
        }
    }
}

// Show placeholder data
function showPlaceholders() {
    cityDisplay.textContent = "Enter a city to see weather";
    tempDisplay.textContent = "🌡️ Temperature: --°C";
    windDisplay.textContent = "💨 Wind: -- M/S";
    humidDisplay.textContent = "💧 Humidity: --%";
    weatherIcon.src = `${weatherIconPath}03d.png`;
    weatherIcon.alt = "Weather Icon";
    weatherDescription.textContent = "Weather";
    
    // Reset forecast with placeholders
    forecastContainer.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const card = document.createElement('div');
        card.className = 'bg-white/10 backdrop-blur-md text-white p-4 rounded-xl shadow text-center';
        
        card.innerHTML = `
            <h4 class="font-semibold mb-2">YYYY-MM-DD</h4>
            <img
                src="${weatherIconPath}03d.png"
                alt="Weather Icon"
                class="mx-auto w-10 mb-2" />
            <p>Temp: --°C</p>
            <p>Wind: -- M/S</p>
            <p>Humidity: --%</p>
        `;
        
        forecastContainer.appendChild(card);
    }
}

// Search history 
function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Remove if exists 
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    history.unshift(city);
    history = history.slice(0, 5);
    
    // Save
    localStorage.setItem('recentSearches', JSON.stringify(history));
}

function getStoredHistory() {
    const history = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Clear dropdown
    search_list.innerHTML = '';
    
    // Hide if empty
    if (history.length === 0) {
        search_list.classList.add('hidden');
        return;
    }
    
    // Add items to dropdown
    history.forEach(city => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 cursor-pointer hover:bg-white/30 text-white';
        item.textContent = city;
        item.addEventListener('click', () => {
            city_name.value = city;
            search_list.classList.add('hidden');
            fetchWeatherData(city);
        });
        
        search_list.appendChild(item);
    });
}

function showHistory() {
    const history = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    if (history.length === 0) {
        search_list.classList.add('hidden');
        return;
    }
    
    // Filter based on input
    const matches = history.filter(city => 
        city.toLowerCase().includes(city_name.value.toLowerCase())
    );
    
    // Clear dropdown
    search_list.innerHTML = '';
    
    // Add filtered items
    matches.forEach(city => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 cursor-pointer hover:bg-white/30 text-white';
        item.textContent = city;
        item.addEventListener('click', () => {
            city_name.value = city;
            search_list.classList.add('hidden');
            fetchWeatherData(city);
        });
        
        search_list.appendChild(item);
    });
    
    // Show/hide based on results
    if (matches.length > 0) {
        search_list.classList.remove('hidden');
    } else {
        search_list.classList.add('hidden');
    }
}

// Handle errors
function showAlert(message) {
    if (!message) {
        error_msg.classList.add('hidden');
        return;
    }
    
    errorMessage.textContent = message;
    error_msg.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        error_msg.classList.add('hidden');
    }, 5000);
}