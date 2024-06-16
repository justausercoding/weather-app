// ---------- CONNECTION TO API ----------
async function checkEnteredCity(city) {
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/search.json?key=b43d0f88c6274dffa0a35845241306&q=${city}`, {mode: "cors"});
        let json = await response.json();
        return json;
    } catch(error) {
        throw new Error(error);
    }
}


async function fetchWeatherData(location) {
    // "hour=24" in the api call makes the api not returning hourly forecasts (saving traffic data)
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b43d0f88c6274dffa0a35845241306&q=${location}&days=3&hour=24`, {mode: "cors"});
        if (response.status == 200) {
            let json = await response.json();
            return json;
        } else {
            throw new Error(response.status)
        }
    } catch(error) {
        throw new Error(error)
    }
}



// ---------- HELPER FUNCTIONS ----------
function formatDate(dateObj) {
    return `${dateObj.getDate()}.${dateObj.getMonth()}.${dateObj.getFullYear()}`;
}

function getWeekday(dateObj) {
    const week = [
        "sunday", 
        "monday", 
        "tuesday", 
        "wednesday",
        "thursday", 
        "friday", 
        "saturday"
    ]
    return week[dateObj.getDay()];
}

function getTime(dateObj) {
    let min = String(dateObj.getMinutes());
    min = min.padStart(2, "0");
    return `${dateObj.getHours()}:${min}`;
}



// ---------- CHANGE DOM ----------
async function changeCityDataHtml(cityName) {
    let cityExists;
    try {
        cityExists = await checkEnteredCity(cityName);
    } catch(error) {
        console.log(error);
    }
    if (cityExists.length != 0) {

        const divCity = document.querySelector(".t__city");
        const divCountry = document.querySelector(".t__country");
        const divDatetime = document.querySelector(".t__datetime");
        const divTempData = document.querySelector(".t__temp-data");
        const divTempUnit = document.querySelector(".t__temp-unit");
        const divDescription = document.querySelector(".t__descr-text");
        const imgDescription = document.querySelector(".t__descr-symbol");
        const divFeels = document.querySelector(".t__info-data.feels");
        const divHumidity = document.querySelector(".t__info-data.humidity");
        const divVisibility = document.querySelector(".t__info-data.visibility");
        const divWind = document.querySelector(".t__info-data.wind");
        const divForecastDate1 = document.querySelector(".f__oneday .f__date");
        const divForecastTemp1 = document.querySelector(".f__oneday .f__temp");
        const imgForecast1 = document.querySelector(".f__oneday .f__symbol");
        console.log
        const divForecastDate2 = document.querySelector(".f__twodays .f__date");
        const divForecastTemp2 = document.querySelector(".f__twodays .f__temp");
        const imgForecast2 = document.querySelector(".f__twodays .f__symbol");

        let data;
        try {
            data = await fetchWeatherData(cityName);
        } catch(error) {
            console.log(error);
        }

        const locale = data.location;
        const now = data.current;
        const forecast1 = data.forecast.forecastday[1];
        const forecast2 = data.forecast.forecastday[2];

        const date = new Date(locale.localtime);
        const datePlusOne = new Date(forecast1.date);
        const datePlusTwo = new Date(forecast2.date);

        divCity.textContent = locale.name;
        divCountry.textContent = locale.country;
        divDatetime.textContent = `${getWeekday(date)} | ${getTime(date)} | ${formatDate(date)}`
        divTempData.textContent = now.temp_c;
        divTempUnit.textContent = "°C";
        divDescription.textContent = now.condition.text;
        imgDescription.src = `https:${now.condition.icon}`;
        divFeels.textContent = `${now.feelslike_c} °C`;
        divHumidity.textContent = `${now.humidity} %`;
        divVisibility.textContent = `${now.vis_km} km`;
        divWind.textContent = `${now.wind_kph} km/h`;

        divForecastDate1.textContent = formatDate(datePlusOne);
        divForecastTemp1.textContent = `${forecast1.day.maxtemp_c} °C`;
        imgForecast1.src = `https:${forecast1.day.condition.icon}`;

        divForecastDate2.textContent = formatDate(datePlusTwo);
        divForecastTemp2.textContent = `${forecast2.day.maxtemp_c} °C`;
        imgForecast2.src = `https:${forecast2.day.condition.icon}`;
    }
}


// ---------- EVENT LISTNERS ----------
function eventListener() {
    const inputSearch = document.querySelector("#form__input");
    inputSearch.addEventListener("keydown", e => {
        if (e.key == "Enter") {
            const cityName = inputSearch.value;
            inputSearch.value = "";
            changeCityDataHtml(cityName);
        }
    })
}



// ---------- MAIN ----------
eventListener();
changeCityDataHtml("Berlin")
