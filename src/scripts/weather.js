const apiKey = '5698d87213f334af33f74621c1609000';
const city = 'Harrisonburg';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        const { name } = data;
        const { description, icon } = data.weather[0];
        const { temp, feels_like, temp_min, temp_max, humidity } = data.main;
        const { speed, deg } = data.wind;
        const { all: cloudiness } = data.clouds;
        const { sunrise, sunset } = data.sys;
        const localTime = new Date((data.dt + data.timezone) * 1000);

        document.getElementById('city-name').innerText = name;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.getElementById('weather-icon').alt = description;
        document.getElementById('weather-desc').innerText = `Description: ${description}`;
        document.getElementById('temp').innerText = `Temperature: ${temp}°F`;
        document.getElementById('feels-like').innerText = `Feels Like: ${feels_like}°F`;
        document.getElementById('min-max').innerText = `Min: ${temp_min}°F / Max: ${temp_max}°F`;
        document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
        document.getElementById('wind').innerText = `Wind: ${speed} m/s, ${deg}°`;
        document.getElementById('clouds').innerText = `Cloudiness: ${cloudiness}%`;
        document.getElementById('sunrise').innerText = `Sunrise: ${new Date(sunrise * 1000).toLocaleTimeString()}`;
        document.getElementById('sunset').innerText = `Sunset: ${new Date(sunset * 1000).toLocaleTimeString()}`;
        document.getElementById('local-time').innerText = `Local Time: ${localTime.toLocaleTimeString()} UTC`;
    })
    .catch(error => {
        console.error("Error fetching weather data:", error);
    });

const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
        //stores one forecast per day
        const dailyData = {};

        //process forcasts
        data.list.forEach(entry => {
            //gets date
            const date = entry.dt_txt.split(' ')[0];
            //gets hour
            const hour = entry.dt_txt.split(' ')[1].split(':')[0];

            if (!dailyData[date] || Math.abs(hour - 12) < Math.abs(dailyData[date].hour - 12)) {
                dailyData[date] = {
                    hour: hour,
                    temp: entry.main.temp,
                    description: entry.weather[0].description,
                    icon: entry.weather[0].icon,
                };
            }
        });

        //rend forecast div cards for next 3 days
        const forecastCards = document.getElementById('forecastCards');
        const dates = Object.keys(dailyData).slice(1, 4);
        dates.forEach(date => {
            const { temp, description, icon } = dailyData[date];

            //creates forecast card
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
            <h3>${new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${temp.toFixed(1)}°F</p>
            <p>${description}</p>
          `;
            // adds card to container
            forecastCards.appendChild(card);
        });
    })
    .catch(error => console.error("Error fetching forecast:", error));