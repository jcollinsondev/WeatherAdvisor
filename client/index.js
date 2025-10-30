const apiURL = "http://localhost:8080/api";

const searchbarInput = document.querySelector(".searchbar-input");
const searchbarResults = document.querySelector(".searchbar-results");
const locationsContainer = document.querySelector("#locations");

searchbarInput.addEventListener("input", locationSearch);
searchbarInput.addEventListener("focusout", hideSearchResults);
searchbarInput.addEventListener("focusin", showSearchResults);

addEventListener("load", loadSavedLocations);

async function loadSavedLocations() {
    const locations = await fetchSavedLocations();
    if (!locations) return;

    locations.forEach(insertLocation);
}

async function locationSearch(event) {
    const searchText = event.target.value;
    if (searchText.length < 2) {
        searchbarResults.innerHTML = "";
        searchbarResults.classList.add("hidden");
        return;
    };
    
    const response = await fetch(`${apiURL}/location/search?name=${searchText}`);
    if (!response.ok) return;

    const json = await response.json();

    if (!json.results || json.results.length === 0) {
        searchbarResults.innerHTML = "";
        searchbarResults.classList.add("hidden");
        return;
    }

    searchbarResults.classList.remove("hidden");
    searchbarResults.innerHTML = "";
    json.results.forEach(location => {
        const resultItem = document.createElement("button");
        resultItem.className = "searchbar-result-item";
        resultItem.innerHTML = `${location.name}, ${location.country}`;
        resultItem.addEventListener("click", () => selectLocation(location));
        searchbarResults.append(resultItem);
    });
}

function hideSearchResults(event) {
    if (searchbarResults.contains(event.relatedTarget)) return;
    searchbarResults.classList.add("hidden");
}

function showSearchResults(event) {
    const searchText = event.target.value;
    if (searchText.length < 2) return;

    searchbarResults.classList.remove("hidden");
}

function selectLocation(location) {
    searchbarResults.classList.add("hidden");
    searchbarInput.value = "";
    insertLocation(location);
    saveLocation(location);
}

async function insertLocation(location) {
    const currentWeather = await fetchCurrentWeather(location);

    const card = document.createElement("div");
    card.classList.add("location-card");
    card.classList.add(currentWeather.weatherType);

    const title = document.createElement("h4");
    title.classList.add("location-card-title");
    title.innerHTML = `${location.name}, ${location.country}`;

    

    const info = document.createElement("div");
    info.classList.add("location-card-info");

    const temperature = document.createElement("h1");
    temperature.classList.add("location-card-temperature");
    temperature.innerHTML = `${Math.round(currentWeather.temp)}°`;

    const humidityData = document.createElement("div");
    humidityData.classList.add("location-card-weather-data-value");

    const humidityIcon = document.createElement("img");
    humidityIcon.classList.add("location-card-weather-data-icon");
    humidityIcon.setAttribute("src", `icons/weather/humidity.svg`);

    const humidityValue = document.createElement("span");
    humidityValue.innerHTML = `${currentWeather.humidity}%`;

    const windData = document.createElement("div");
    windData.classList.add("location-card-weather-data-value");

    const windIcon = document.createElement("img");
    windIcon.classList.add("location-card-weather-data-icon");
    windIcon.setAttribute("src", `icons/weather/wind.svg`);

    const windValue = document.createElement("span");
    windValue.innerHTML = `${currentWeather.wind} km/h`;

    const icon = document.createElement("img");
    icon.classList.add("location-card-weather-icon");
    icon.setAttribute("src", `icons/weather/${currentWeather.weatherType}.svg`);

    const content = document.createElement("div");
    content.classList.add("location-card-content");

    const chatLink = document.createElement("button");
    chatLink.classList.add("location-card-chat-link");
    chatLink.innerHTML = "Start a Chat";
    
    card.append(title);
    humidityData.append(humidityIcon);
    humidityData.append(humidityValue);
    windData.append(windIcon);
    windData.append(windValue);
    info.append(temperature);
    info.append(humidityData);
    info.append(windData);
    content.append(icon);
    content.append(info);
    card.append(content);
    card.append(chatLink);
    
    locationsContainer.append(card);
}

async function fetchCurrentWeather(location) {
    const response = await fetch(`${apiURL}/weather/current?lon=${location.lon}&lat=${location.lat}&timezone=${location.timezone}`);
    if (!response.ok) return;

    return await response.json();
}

async function saveLocation(location) {
    await fetch(`${apiURL}/location/save`, {
        method: "POST",
        body: JSON.stringify({ location }),
    });
}

async function fetchSavedLocations() {
    const response = await fetch(`${apiURL}/location/list`);
    if (!response.ok) return;

    return await response.json();
}