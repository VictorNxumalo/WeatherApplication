// Function to fetch weather data from 7Timer! API
async function fetchWeather(lat, lon) {
    const currentWeatherEndpoint = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
    const currentWeatherResponse = await fetch(currentWeatherEndpoint);
    

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log the data for debugging
        updateWeatherUI(data);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        alert('Could not fetch weather data. Please try again.');
    }
}

// Function to fetch coordinates by city name
async function fetchCoordinates(city) {
    const apiKey = 'bf9b579ef496aea7f99616a000892409';
    const endpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const loadingSpinner = document.querySelector('#search-loading');
    const searchButton = document.querySelector('#search-button span');
    const searchInput = document.querySelector('#city-name');

    try {
        // Show loading state
        loadingSpinner.classList.remove('hidden');
        searchButton.textContent = 'Searching...';
        searchInput.disabled = true;
        searchButton.disabled = true;

        console.log('Fetching coordinates from:', endpoint);
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Geocoding API response:', data);

        if (data.length === 0) {
            throw new Error('City not found. Please enter a valid city name.');
        }

        const { lat, lon } = data[0];
        await fetchWeather(lat, lon);

    } catch (error) {
        console.error('Failed to fetch coordinates:', error);
        alert(error.message || 'Could not fetch coordinates. Please try again.');
    } finally {
        // Reset loading state
        loadingSpinner.classList.add('hidden');
        searchButton.textContent = 'Search';
        searchInput.disabled = false;
        searchButton.disabled = false;
    }
}
// Function to update the UI with weather data

// function updateWeatherUI(data) {
//     // Select the elements using the correct IDs
//     const temperatureElement = document.querySelector('#current-temperature');
//     const humidityElement = document.querySelector('#current-humidity');
//     const windSpeedElement = document.querySelector('#current-wind-speed');
//     const descriptionElement = document.querySelector('#current-description');

//     // Check if elements exist before updating
//     if (!temperatureElement || !humidityElement || !windSpeedElement || !descriptionElement) {
//         console.error('One or more weather elements not found in the DOM');
//         return;
//     }

//     try {
//         // Extract weather data from the API response
//         const forecast = data.dataseries[0];
//         const temperature = forecast.temp2m; // Temperature at 2 meters
//         const weather = forecast.weather; // Weather condition
//         const windSpeed = forecast.wind10m.speed; // Wind speed
//         const humidity = forecast.rh2m; // Relative humidity

//         // Update the elements with the fetched data
//         temperatureElement.textContent = `${temperature}°C`;
//         humidityElement.textContent = `${humidity}%`;
//         windSpeedElement.textContent = `${windSpeed} km/h`;
//         descriptionElement.textContent = weather;

//         console.log('Weather UI updated successfully');
//     } catch (error) {
//         console.error('Error updating weather UI:', error);
        
//         // Set default values if update fails
//         temperatureElement.textContent = '--°C';
//         humidityElement.textContent = '--%';
//         windSpeedElement.textContent = '-- km/h';
//         descriptionElement.textContent = '--';
//     }
// }
// Function to save recent
// function saveRecentSearch(city) {
//     const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
//     if (!recentSearches.includes(city)) {
//         recentSearches.unshift(city);
//         if (recentSearches.length > 5) recentSearches.pop();
//         localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
//     }
// }

// function displayRecentSearches() {
//     const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
//     const container = document.getElementById('recent-searches');
//     if (container && recentSearches.length > 0) {
//         container.innerHTML = recentSearches
//             .map(city => `
//                 <button class="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
//                     onclick="fetchCoordinates('${city}')">
//                     ${city}
//                 </button>
//             `)
//             .join('');
//     }
// }

async function getForecastData(latitude, longitude) {
    const API_KEY = 'bf9b579ef496aea7f99616a000892409';
    const endpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getForecastData:', error);
        throw error;
    }
}
function createForecastCard(forecast) {
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    const icon = forecast.weather[0].icon;

     // Change http:// to https://
     return `
     <div class="snap-center min-w-[200px] bg-white/20 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all">
         <div class="text-center">
             <h3 class="text-lg font-semibold text-white mb-2">${dayName}</h3>
             <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="w-16 h-16 mx-auto">
             <p class="text-2xl font-bold text-white mb-2">${temp}°C</p>
             <p class="text-sm text-gray-200 capitalize">${description}</p>
         </div>
     </div>
 `;
}
async function fetchWeather(lat, lon) {
    try {
        // Use OpenWeatherMap API for current weather instead of 7timer
        const apiKey = 'bf9b579ef496aea7f99616a000892409';
        const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const currentWeatherResponse = await fetch(currentWeatherEndpoint);
        
        if (!currentWeatherResponse.ok) {
            throw new Error(`Error: ${currentWeatherResponse.status}`);
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Transform OpenWeatherMap data to match your UI expectations
        const transformedData = {
            dataseries: [{
                temp2m: Math.round(currentWeatherData.main.temp),
                weather: currentWeatherData.weather[0].main,
                wind10m: {
                    speed: Math.round(currentWeatherData.wind.speed * 3.6) // Convert m/s to km/h
                },
                rh2m: currentWeatherData.main.humidity
            }]
        };
        
        updateWeatherUI(transformedData);

        // Fetch forecast data
        const forecastData = await getForecastData(lat, lon);
        displayForecast(forecastData);

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        alert('Could not fetch weather data. Please try again.');
    }
}
function displayForecast(data) {
    const forecastContainer = document.querySelector('.overflow-x-auto');
    if (!forecastContainer) return;

    // Clear existing forecast
    forecastContainer.innerHTML = '';

    // Get one forecast per day (every 8th item as the API returns 3-hour forecasts)
    const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 7);

    // Create and append forecast cards
    dailyForecasts.forEach(forecast => {
        forecastContainer.innerHTML += createForecastCard(forecast);
    });
}
// Add this to js/main.js
const weatherIcons = {
    'Clear': 'images/clear.png',
    'Clouds': 'images/cloudy.png',
    'Rain': 'images/rain.png',
    'Snow': 'images/snow.png',
    'Thunderstorm': 'images/tsrain.png',
    'default': 'images/cloudy.png'
};

function getWeatherIcon(condition) {
    return weatherIcons[condition] || weatherIcons.default;
}

// Update the updateWeatherUI function to include weather icons
function updateWeatherUI(data) {
    // ... existing code ...
    // Select the elements using the correct IDs
    const temperatureElement = document.querySelector('#current-temperature');
    const humidityElement = document.querySelector('#current-humidity');
    const windSpeedElement = document.querySelector('#current-wind-speed');
    const descriptionElement = document.querySelector('#current-description');

    // Check if elements exist before updating
    if (!temperatureElement || !humidityElement || !windSpeedElement || !descriptionElement) {
        console.error('One or more weather elements not found in the DOM');
        return;
    }

    try {
        // Extract weather data from the API response
        const forecast = data.dataseries[0];
        const temperature = forecast.temp2m; // Temperature at 2 meters
        const weather = forecast.weather; // Weather condition
        const windSpeed = forecast.wind10m.speed; // Wind speed
        const humidity = forecast.rh2m; // Relative humidity

        // Update the elements with the fetched data
        temperatureElement.textContent = `${temperature}°C`;
        humidityElement.textContent = `${humidity}%`;
        windSpeedElement.textContent = `${windSpeed} km/h`;
        descriptionElement.textContent = weather;

        console.log('Weather UI updated successfully');
    } catch (error) {
        console.error('Error updating weather UI:', error);
        
        // Set default values if update fails
        temperatureElement.textContent = '--°C';
        humidityElement.textContent = '--%';
        windSpeedElement.textContent = '-- km/h';
        descriptionElement.textContent = '--';
    }
    const weatherIcon = document.querySelector('#weather-icon');
    if (weatherIcon) {
        weatherIcon.src = getWeatherIcon(weather);
        weatherIcon.alt = weather;
    }
}
// Update the initializeForecast function with better logging
// async function initializeForecast() {
//     const forecastContainer = document.getElementById('forecast-container');
//     const loadingIndicator = document.getElementById('loading-indicator');

//     try {
//         console.log('===== Starting Forecast Initialization =====');
//         forecastContainer.innerHTML = '';
//         loadingIndicator.innerHTML = createLoadingSpinner();
//         loadingIndicator.style.display = 'block';

//         // Get location
//         console.log('Requesting user location...');
//         const coords = await Promise.race([
//             getUserLocation(),
//             new Promise((_, reject) => 
//                 setTimeout(() => reject(new Error('Location request timed out')), 10000)
//             )
//         ]);
//         console.log('Location received:', coords);

//         // Get weather data
//         console.log('Requesting weather data...');
//         const weatherData = await Promise.race([
//             getForecastData(coords.latitude, coords.longitude),
//             new Promise((_, reject) => 
//                 setTimeout(() => reject(new Error('Weather data request timed out')), 15000)
//             )
//         ]);
//         console.log('Weather data processing started');

//         // Process data
//         if (!weatherData?.daily?.length) {
//             throw new Error('No daily forecast data available');
//         }

//         // Create cards
//         console.log('Creating forecast cards...');
//         weatherData.daily.slice(0, 7).forEach((day, index) => {
//             try {
//                 console.log(`Creating card for day ${index + 1}`);
//                 const cardData = {
//                     date: day.dt * 1000,
//                     temp: Math.round(day.temp.day),
//                     temp_max: Math.round(day.temp.max),
//                     temp_min: Math.round(day.temp.min),
//                     condition: day.weather[0]?.main || 'Unknown',
//                     humidity: day.humidity || 0,
//                     wind_speed: Math.round(day.wind_speed) || 0
//                 };
                
//                 const cardHTML = createForecastCard(cardData);
//                 forecastContainer.insertAdjacentHTML('beforeend', cardHTML);
//                 console.log(`Card ${index + 1} created successfully`);
//             } catch (cardError) {
//                 console.error(`Error creating card ${index + 1}:`, cardError);
//             }
//         });

//         // Hide loading indicator
//         loadingIndicator.style.display = 'none';
//         console.log('===== Forecast Initialization Complete =====');

//     } catch (error) {
//         console.error('Forecast initialization failed:', error);
//         loadingIndicator.innerHTML = `
//             <div class="text-center space-y-4 p-6">
//                 <div class="text-red-400">${error.message}</div>
//                 <div class="text-gray-400 text-sm">
//                     ${error.message.includes('Location') 
//                         ? 'Please enable location services and refresh the page.' 
//                         : 'Please check your internet connection and try again.'}
//                 </div>
//                 <button onclick="initializeForecast()" 
//                     class="px-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 
//                     border border-indigo-500/30 rounded-lg transition-all
//                     text-white hover:scale-105">
//                     Retry
//                 </button>
//             </div>
//         `;
//     }
// }
// List of predefined cities
const cities = ['Amsterdam', 'Berlin', 'London', 'Paris', 'Rome'];

// Function to fetch weather data for multiple cities
// Remove duplicate event listener and fix the fetchWeatherSuggestions function
async function fetchWeatherSuggestions() {
    const suggestionsContainer = document.getElementById('weather-suggestions');
    if (!suggestionsContainer) {
        console.error('Weather suggestions container not found');
        return;
    }

    const weatherSuggestions = [
        { city: 'Amsterdam', temp: 15, condition: 'Cloudy', wind: '10 km/h', humidity: '80%', description: 'Partly cloudy skies with a chance of rain.' },
        { city: 'Berlin', temp: 18, condition: 'Sunny', wind: '12 km/h', humidity: '70%', description: 'Clear skies with lots of sunshine.' },
        { city: 'London', temp: 12, condition: 'Rainy', wind: '8 km/h', humidity: '90%', description: 'Rain showers expected throughout the day.' }
    ];

    try {
        suggestionsContainer.innerHTML = '';
        weatherSuggestions.forEach(({ city, temp, condition, wind, humidity, description }) => {
            suggestionsContainer.innerHTML += `
                <div class="weather-card glass-card p-6 relative cursor-pointer" onclick="openWeatherModal('${city}', ${temp}, '${condition}', '${wind}', '${humidity}', '${description}')">
                    <h3 class="text-lg font-semibold mb-2 text-white">${city}</h3>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <img src="https://openweathermap.org/img/wn/03d.png" alt="${condition}" class="w-10 h-10">
                            <p class="text-gray-300">${temp}°C</p>
                        </div>
                        <p class="text-gray-300">${condition}</p>
                    </div>
                    <div class="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                    <p class="text-sm text-gray-400 mt-2">Wind: ${wind} | Humidity: ${humidity}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error creating weather suggestions:', error);
    }
}

// Single event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherSuggestions();
    
    // Add search button functionality
    const searchButton = document.querySelector('#search-button');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const cityInput = document.querySelector('#city-name');
            if (cityInput && cityInput.value) {
                fetchCoordinates(cityInput.value);
            } else {
                alert('Please enter a city name.');
            }
        });
    }
});
function openWeatherModal(city, temp, condition, wind, humidity, description) {
    try {
        const modal = document.getElementById('weather-modal');
        const modalElements = {
            title: document.getElementById('modal-title'),
            temp: document.getElementById('modal-temp'),
            condition: document.getElementById('modal-condition'),
            wind: document.getElementById('modal-wind'),
            humidity: document.getElementById('modal-humidity'),
            description: document.getElementById('modal-description'),
            icon: document.getElementById('modal-icon')
        };

        // Check if all elements exist
        if (!modal || Object.values(modalElements).some(el => !el)) {
            throw new Error('Modal elements not found');
        }

        modalElements.title.textContent = city;
        modalElements.temp.textContent = `${temp}°C`;
        modalElements.condition.textContent = `Condition: ${condition}`;
        modalElements.wind.textContent = `Wind Speed: ${wind}`;
        modalElements.humidity.textContent = `Humidity: ${humidity}`;
        modalElements.description.textContent = description;

        const iconMap = {
            'Cloudy': '03d',
            'Sunny': '01d',
            'Rainy': '09d',
            'Snowy': '13d'
        };

        modalElements.icon.src = `https://openweathermap.org/img/wn/${iconMap[condition] || '01d'}@2x.png`;
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error opening weather modal:', error);
    }
}
// Remove the duplicate initialization and combine into one function
function initializeMap() {
    if (typeof ol === 'undefined') {
        console.error('OpenLayers library not loaded');
        return;
    }

    try {
        const map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([0, 0]),
                zoom: 2
            })
        });

        // Add weather layer
        const weatherLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`,
                attributions: 'Weather data © OpenWeatherMap'
            })
        });
        map.addLayer(weatherLayer);

        return { map, weatherLayer };
    } catch (error) {
        console.error('Error initializing map:', error);
        return null;
    }
}

// Single event listener for map initialization
document.addEventListener('DOMContentLoaded', () => {
    const mapInstance = initializeMap();
    if (mapInstance) {
        const { map, weatherLayer } = mapInstance;
        
        // Add layer switching functionality
        const layerSelect = document.getElementById('map-layer');
        if (layerSelect) {
            layerSelect.addEventListener('change', (e) => {
                const layer = e.target.value;
                weatherLayer.getSource().setUrl(
                    `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`
                );
            });
        }
    }
});
function closeWeatherModal() {
    // Hide the modal
    document.getElementById('weather-modal').classList.add('hidden');
}
// Call the function to fetch weather suggestions on page load
document.addEventListener('DOMContentLoaded', fetchWeatherSuggestions);

// Call the function to fetch weather suggestions on page load
document.addEventListener('DOMContentLoaded', fetchWeatherSuggestions);



// Add event listener to the search button
document.querySelector('#search-button').addEventListener('click', () => {
    const city = document.querySelector('#city-name').value;

    if (city) {
        fetchCoordinates(city); // Fetch coordinates by city name
    } else {
        alert('Please enter a city name.');
    }
});

const OPENWEATHERMAP_API_KEY = 'bf9b579ef496aea7f99616a000892409';

function initWeatherMap() {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`,
                    attributions: 'Weather data © OpenWeatherMap'
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2
        })
    });

    // Handle layer switching
    document.getElementById('map-layer').addEventListener('change', function(e) {
        const layer = e.target.value;
        map.getLayers().getArray()[1].getSource().setUrl(
            `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`
        );
    });

    // Add geolocation control
    const geolocation = new ol.Geolocation({
        projection: map.getView().getProjection(),
        trackingOptions: {
            enableHighAccuracy: true
        }
    });

    // Center map on user's location when available
    geolocation.on('change:position', function() {
        const coordinates = geolocation.getPosition();
        map.getView().animate({
            center: coordinates,
            zoom: 10
        });
    });
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initWeatherMap);

// Initialize map after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof ol === 'undefined') {
            console.error('OpenLayers not loaded');
            return;
        }

        const map = new ol.Map({
            target: 'map',
            layers: [
                // Base map layer
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([0, 0]),
                zoom: 2
            })
        });

        // Add weather layer
        const weatherLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`,
                attributions: 'Weather data © OpenWeatherMap'
            })
        });
        map.addLayer(weatherLayer);

        // Handle layer switching
        const layerSelect = document.getElementById('map-layer');
        if (layerSelect) {
            layerSelect.addEventListener('change', (e) => {
                const layer = e.target.value;
                weatherLayer.getSource().setUrl(
                    `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`
                );
            });
        }
    } catch (error) {
        console.error('Error initializing map:', error);
    }
});

// Add error handling to particle creation
function createParticle() {
    try {
        const particlesContainer = document.getElementById('particles-background');
        if (!particlesContainer) return;

        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-white/10 rounded-full';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const duration = 3 + Math.random() * 4;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    } catch (error) {
        console.error('Error creating particle:', error);
    }
}
// Add this to your main.js file
function handleApiError(error) {
    console.error('API Error:', error);
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = 'An error occurred while fetching weather data. Please try again.';
        errorMessage.classList.remove('hidden');
    }
}

// Wrap API calls in try-catch blocks
async function fetchWeatherData(cityName) {
    try {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');
        
        // Your API call here
        
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    } catch (error) {
        handleApiError(error);
    }
}

// Add this to your main.js file
function handleApiError(error) {
    console.error('API Error:', error);
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = 'An error occurred while fetching weather data. Please try again.';
        errorMessage.classList.remove('hidden');
    }
}

// Wrap API calls in try-catch blocks
async function fetchWeatherData(cityName) {
    try {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');
        
        // Your API call here
        
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    } catch (error) {
        handleApiError(error);
    }
}

// Add this to your main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initializeElements();
});

function initializeElements() {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Scroll buttons
    const scrollContainer = document.querySelector('.scrollbar-hide');
    const leftBtn = document.querySelector('.scroll-left-btn');
    const rightBtn = document.querySelector('.scroll-right-btn');
    if (scrollContainer && leftBtn && rightBtn) {
        initializeScrollButtons(scrollContainer, leftBtn, rightBtn);
    }
}

// Mobile Menu Handler
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Close menu when clicking links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Responsive Map Handler
function handleMapResize() {
    const map = document.getElementById('map');
    if (map) {
        const updateMapHeight = () => {
            const vh = window.innerHeight;
            map.style.height = `${vh * 0.6}px`;
        };
        window.addEventListener('resize', updateMapHeight);
        updateMapHeight();
    }
}

// Initialize all responsive features
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    handleMapResize();
});

function initializeTouchEvents() {
    const forecastContainer = document.querySelector('.overflow-x-auto');
    if (forecastContainer) {
        let touchStartX = 0;
        let scrollLeft = 0;

        forecastContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - forecastContainer.offsetLeft;
            scrollLeft = forecastContainer.scrollLeft;
        });

        forecastContainer.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const x = e.touches[0].pageX - forecastContainer.offsetLeft;
            const walk = (x - touchStartX) * 2;
            forecastContainer.scrollLeft = scrollLeft - walk;
        });

        forecastContainer.addEventListener('touchend', () => {
            touchStartX = null;
        });
    }
}