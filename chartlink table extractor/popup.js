const displayOutput = () => {
    chrome.storage.sync.get("stocks", ({ stocks }) => {
        const container = document.getElementById("output");
        container.innerHTML = "";

        for (const category of Object.keys(stocks)) {
            const outputChildElement = document.createElement("div");
            const newHeading = document.createElement("p");
            newHeading.textContent = category;
            const newStocksInCSV = document.createElement("textarea");
            newStocksInCSV.textContent = stocks[category];
            newStocksInCSV.addEventListener("click", function () {
                this.focus();
                this.select();
            });
            outputChildElement.appendChild(newHeading);
            outputChildElement.appendChild(newStocksInCSV);
            container.appendChild(outputChildElement);
        }
    });
};

const convertStocksToCSV = () => {
    let stocks = {};
    let tableDivs = [];
    tableDivs = document.querySelectorAll(
        ".vue-grid-item:not(.vue-grid-placeholder)"
    );
    [...tableDivs].forEach((tableDiv) => {
        let tableNameDiv = tableDiv.querySelector(".truncate");
        if (tableNameDiv) {
            let tableName = tableNameDiv.innerText;
            console.log(tableName);

            let tableBodyDiv = tableDiv.querySelector("tbody");
            console.log(tableBodyDiv);

            let symbolLinks = tableBodyDiv.querySelectorAll("a");
            let symbolsInCSV = "";
            for (let i = 0; i < symbolLinks.length; i++) {
                symbolsInCSV += symbolLinks[i].text + ",";
            }
            console.log(symbolsInCSV);

            stocks[tableName] = symbolsInCSV;
        }
    });
    console.log(stocks);
    chrome.storage.sync.set({ stocks });
};

document.addEventListener("DOMContentLoaded", async () => {
    let stocks = {};
    chrome.storage.sync.set({ stocks });

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: convertStocksToCSV,
    });

    setTimeout(displayOutput, 300);
});

const refreshButton = document.getElementById("refresh");

refreshButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: convertStocksToCSV,
    });

    setTimeout(displayOutput, 300);
});
