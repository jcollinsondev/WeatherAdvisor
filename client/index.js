const apiURL = "http://localhost:8080/api";

const searchbarInput = document.querySelector(".searchbar-input");
const banner = document.querySelector(".select-location-banner");
const searchSuggestions = document.querySelector("#search-suggestions");
const searchHistory = document.querySelector("#search-history");
const chatHeader = document.querySelector("#chat-header");
const chatInputSection = document.querySelector("#input");
const chatInput = document.querySelector("#chat-input");
const chatInputButton = document.querySelector("#chat-input-button");
const messages = document.querySelector("#messages");

searchbarInput.addEventListener("input", locationSearch);
searchbarInput.addEventListener("focusout", hideSearchResults);
searchbarInput.addEventListener("focusin", showSearchResults);

chatInputButton.addEventListener("click", askQuestion);
chatInput.addEventListener("keypress", ({ key }) => {
    if (key === 'Enter') askQuestion();
});

addEventListener("load", loadSavedLocations);

async function loadSavedLocations() {
    const locations = await fetchSavedLocations();
    if (!locations) return;

    locations.forEach(addToSearchHistory);
}

async function locationSearch(event) {
    searchHistory.classList.add("hidden");

    const searchText = event.target.value;
    if (searchText.length < 2) {
        searchSuggestions.innerHTML = "";
        searchSuggestions.classList.add("hidden");
        return;
    };
    
    const response = await fetch(`${apiURL}/location/search?name=${searchText}`);
    if (!response.ok) return;

    const json = await response.json();

    if (!json.results || json.results.length === 0) {
        searchSuggestions.innerHTML = "";
        searchSuggestions.classList.add("hidden");
        return;
    }

    searchSuggestions.classList.remove("hidden");
    searchSuggestions.innerHTML = "";
    json.results.forEach(location => {
        const resultItem = document.createElement("button");
        resultItem.className = "searchbar-result-item";
        resultItem.innerHTML = `${location.name}, ${location.country}`;
        resultItem.addEventListener("click", () => selectLocation(location, true));
        searchSuggestions.append(resultItem);
    });
}

function addToSearchHistory(location) {
    const historyItem = document.createElement("button");
    historyItem.className = "searchbar-history-item";

    const historyItemIcon = document.createElement("img");
    historyItemIcon.classList.add("searchbar-history-item-icon");
    historyItemIcon.setAttribute("src", `icons/ui/clock-rewind.svg`);

    const historyItemSpan = document.createElement("span");
    historyItemSpan.innerHTML = `${location.name}, ${location.country}`;

    historyItem.addEventListener("click", () => selectLocation(location, false));

    historyItem.append(historyItemIcon);
    historyItem.append(historyItemSpan);
    searchHistory.append(historyItem);
}

function hideSearchResults(event) {
    if (searchSuggestions.contains(event.relatedTarget)) return;
    if (searchHistory.contains(event.relatedTarget)) return;
    searchHistory.classList.add("hidden");
    searchSuggestions.classList.add("hidden");
}

function showSearchResults(event) {
    const searchText = event.target.value;
    if (searchText.length < 2) {
        searchHistory.classList.remove("hidden");
    } else {
        searchSuggestions.classList.remove("hidden");
    }
}

function selectLocation(location, save) {
    searchSuggestions.classList.add("hidden");
    searchHistory.classList.add("hidden");
    searchbarInput.value = "";
    insertLocation(location);
    if (save) saveLocation(location);
}

async function insertLocation(location) {
    const currentWeather = await fetchCurrentWeather(location);

    banner.classList.add("hidden");
    chatInputSection.classList.remove("hidden");
    chatHeader.classList.remove("hidden");

    const title = chatHeader.querySelector(".location-card-title");
    title.innerHTML = `${location.name}, ${location.country}`;

    const temperature = chatHeader.querySelector(".location-card-temperature");
    temperature.innerHTML = `${Math.round(currentWeather.temp)}°`;

    const humidity = chatHeader.querySelector(".location-card-weather-data-humidity");
    humidity.innerHTML = `${currentWeather.humidity}%`;

    const wind = chatHeader.querySelector(".location-card-weather-data-wind");
    wind.innerHTML = `${currentWeather.wind} km/h`;

    const icon = chatHeader.querySelector(".location-card-weather-icon");
    icon.setAttribute("src", `icons/weather/${currentWeather.weatherType}.svg`);
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

function askQuestion() {
    const waitingResponse = chatInput.getAttribute("waiting");
    if (waitingResponse) return;

    const question = chatInput.value;
    if (!question) return;

    addMessage(question);
    chatInput.value = "";

    chatInput.setAttribute("waiting", true);
    chatInputButton.setAttribute("waiting", true);
}

function addMessage(question) {
    const message = document.createElement("div");
    message.classList.add("chat-message");

    const text = document.createElement("div");
    text.classList.add("chat-message-text");
    text.innerHTML = question;

    message.append(text);
    messages.append(message);
}