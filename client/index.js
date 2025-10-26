const apiURL = "http://localhost:8080";

const searchbarInput = document.querySelector(".searchbar-input");
const searchbarResults = document.querySelector(".searchbar-results");

searchbarInput.addEventListener("input", async (event) => {
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
    json.results.forEach(result => {
        const resultItem = document.createElement("div");
        resultItem.className = "searchbar-result-item";
        resultItem.innerHTML = result.name;
        searchbarResults.append(resultItem);
    });
});