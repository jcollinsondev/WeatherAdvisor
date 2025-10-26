const apiURL = "http://localhost:8080/api";

const searchbarInput = document.querySelector(".searchbar-input");
const searchbarResults = document.querySelector(".searchbar-results");
const locationsContainer = document.querySelector("#locations");

searchbarInput.addEventListener("input", locationSearch);
searchbarInput.addEventListener("focusout", hideSearchResults);
searchbarInput.addEventListener("focusin", showSearchResults);

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
        resultItem.addEventListener("click", selectLocation(location));
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
    return async () => {
        searchbarResults.classList.add("hidden");
        const locationCard = document.createElement("div");
        locationCard.className = "location-card";
        locationCard.innerHTML = `${location.name}, ${location.country}`;
        locationsContainer.append(locationCard);

        const currentWeather = await fetchCurrentWeather(location);
        console.log(currentWeather);
    }
}

async function fetchCurrentWeather(location) {
    const response = await fetch(`${apiURL}/weather/current?lon=${location.lon}&lat=${location.lat}&timezone=${location.timezone}`);
    if (!response.ok) return;

    return await response.json();
}