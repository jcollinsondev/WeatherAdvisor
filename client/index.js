//#region SETUP
const apiURL = "/api";

let currentLocation = undefined;

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

chatInputButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", ({ key }) => {
    if (key === 'Enter') sendMessage();
});

addEventListener("load", loadSavedLocations);

//#endregion SETUP

async function loadSavedLocations() {
    const locations = await fetchSavedLocations();
    if (!locations) return;

    // Populate recent locations for suggestion
    locations.forEach(addToSearchHistory);
}

async function locationSearch(event) {
    // Hide recent locations to make space for the search locations
    searchHistory.classList.add("hidden");

    // Call API only with a string > 2
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

    // Populate search results
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
    currentLocation = location;
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

function sendMessage() {
    // Check if a question is still waiting for a response
    const waitingResponse = chatInput.getAttribute("waiting");
    if (waitingResponse === true) return;

    const question = chatInput.value;
    if (!question) return;

    const responseText = addMessage(question);
    chatInput.value = "";

    // Disable chat while waiting for a response
    chatInput.setAttribute("waiting", true);
    chatInputButton.setAttribute("waiting", true);

    askQuestion(question, responseText);
}

function addMessage(question) {
    const message = document.createElement("div");
    message.classList.add("chat-message");

    const text = document.createElement("div");
    text.classList.add("chat-message-text");
    text.innerHTML = question;

    const response = document.createElement("div");
    response.classList.add("chat-response");

    const responseText = document.createElement("div");
    responseText.classList.add("chat-response-text");
    responseText.innerHTML = "Thinking...";

    message.append(text);
    messages.append(message);
    response.append(responseText);
    messages.append(response);

    return responseText;
}

async function askQuestion(question, responseText) {
    if (!currentLocation) return;

    const [timeframe, dataType] = calculateTimeframe();

    const response = await fetch(`${apiURL}/llm/ask`, {
        method: "POST",
        body: JSON.stringify({ 
            question,
            location: currentLocation,
            timeframe,
            dataType,
        }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    responseText.innerHTML = "";
    const writer = new Typewriter(responseText, 25);
    
    await read(reader, decoder, writer);
    chatInput.setAttribute("waiting", false);
    chatInputButton.setAttribute("waiting", false);
}

function calculateTimeframe() {
    const radioValue = document.querySelector('input[name="timeframe-radio"]:checked').value;

    if (radioValue === "today") {
        const timeframe = {
            from: new Date(),
            to: new Date(new Date().setHours(24, 0, 0, 0)),
        };
        const dataType = "hourly";

        return [timeframe, dataType];
    }

    if (radioValue === "week") {
        const timeframe = {
            from: new Date(),
            to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        const dataType = "daily";

        return [timeframe, dataType];
    }

    if (radioValue === "weekend") {
        const now = new Date();
        const day = now.getDay();

        const daysUntilSaturday = (6 - day + 7) % 7 || 7;

        const from = new Date(now);
        from.setDate(now.getDate() + daysUntilSaturday);
        from.setHours(0, 0, 0, 0);

        const to = new Date(from);
        to.setDate(from.getDate() + 1);
        to.setHours(23, 59, 59, 999);

        const timeframe = { from, to };
        const dataType = "daily";

        return [timeframe, dataType];
    }
}

async function read(reader, decoder, writer, buffer = "") {
    const { done, value } = await reader.read();
    if (done) {
        return;
    }

    // Save the value in buffer because a full line with a valid JSON is not guaranteed
    buffer += decoder.decode(value, { stream: true });

    // Read only the complete lines and keep the uncomplete line in the buffer
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const json = JSON.parse(line);
            // Using a writer class for a smoother print
            writer.enqueue(json.response);
        } catch {
            console.warn("Skipping invalid JSON line:", line);
        }
    }

    read(reader, decoder, writer, buffer);
}

class Typewriter {
    constructor(element, delay = 30) {
        this.element = element;
        this.delay = delay;
        this.queue = [];
        this.isTyping = false;
    }

    // A queue for asyncronous printing guarantees the correct order of words
    enqueue(text) {
        this.queue.push(text);
        if (!this.isTyping) {
            this.processQueue();
        }
    }

    async processQueue() {
        this.isTyping = true;

        while (this.queue.length > 0) {
            const text = this.queue.shift();
            await this.typeText(text);
        }

        this.isTyping = false;
    }

    typeText(text) {
        return new Promise(resolve => {
            let i = 0;
            // The interval is necessary to avoid a big chunk of text to be printed all together
            const interval = setInterval(() => {
                this.element.append(text[i] ?? "");
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, this.delay);
        });
    }
}