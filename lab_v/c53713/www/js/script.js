const API_KEY = "7fc8faf23b8e3bb18ea102f039ca2dd3";
const weatherBtn = document.getElementById("weatherBtn");
const cityInput = document.getElementById("cityInput");
const currentWeatherData = document.getElementById("currentWeatherData");
const forecastData = document.getElementById("forecastData");

function displayHourlyForecast(data) {
    const today = new Date().toLocaleDateString();
    const hourlyData = data.list.filter(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        return date === today;
    });

    const hourlyForecastHTML = hourlyData.slice(0, 6).map(item => {
        const time = new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        return `
            <div class="hourly-card">
                <span class="hourly-time">${time}</span>
                <img src="${iconUrl}" alt="Ikona pogody">
                <span class="hourly-temp">${item.main.temp.toFixed(1)}&#176C</span>
                <span>${item.weather[0].description}</span>
            </div>
        `;
    }).join("");

    document.getElementById("hourlyForecastData").innerHTML = hourlyForecastHTML;
}

function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayForecast(data); // Prognoza 5-dniowa
            displayHourlyForecast(data); // Prognoza godzinowa na dzisiaj
        })
        .catch(() => alert("Błąd podczas pobierania prognozy pogody."));
}


function fetchCurrentWeather(city) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            //console.log(data);
            displayCurrentWeather(data);
        } else {
            alert("Nie znaleziono miasta. Spróbuj ponownie.");
        }
    };
    xhr.onerror = function () {
        alert("Wystąpił błąd podczas wysyłania żądania.");
    };
    xhr.send();
}

function displayCurrentWeather(data) {
    //console.log(data);
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentWeatherData.innerHTML = `
        <div class="weather-card">
            <div>
                <h3>${data.name}, ${data.sys.country}</h3>
                <p>${data.weather[0].description}</p>
                <p class="temp">${data.main.temp.toFixed(1)}&#176C</p>
            </div>
            <img src="${iconUrl}" alt="Ikona pogody">
        </div>
    `;
}

function displayForecast(data) {
    //console.log(data);
    const forecastByDay = {};
    data.list.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        if (!forecastByDay[date]) forecastByDay[date] = [];
        forecastByDay[date].push(item);
    });

    //console.log(forecastByDay);

    const days = Object.keys(forecastByDay).slice(0, 5);
    forecastData.innerHTML = days.map(day => {
        const dailyForecast = forecastByDay[day][0];
        const iconUrl = `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`;
        return `
            <div class="weather-card">
                <div>
                    <h3>${day}</h3>
                    <p>${dailyForecast.weather[0].description}</p>
                    <p class="temp">${dailyForecast.main.temp.toFixed(1)}&#176C</p>
                </div>
                <img src="${iconUrl}" alt="Ikona pogody">
            </div>
        `;
    }).join("");
}

weatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city);
    } else {
        alert("Wprowadz nazwe miasta!");
    }
});
