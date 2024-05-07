const infoList = document.getElementById("info-list");
const sendButton = document.getElementById("send-button");
const clearButton = document.getElementById("clear-button");

clearButton.addEventListener("click", () => {
  chrome.storage.local.remove("webInfo", function () {
    displayInfo([]); // Display the empty list
  });
});

function displayInfo() {
  chrome.storage.local.get("webInfo", function (result) {
    const storedInfo = result.webInfo || [];
    infoList.innerHTML = "";

    storedInfo.forEach((info) => {
      let row = document.createElement("tr");

      let companyCell = document.createElement("td");
      companyCell.textContent = info.companyName;
      row.appendChild(companyCell);

      let urlCell = document.createElement("td");
      urlCell.textContent = info.url;
      row.appendChild(urlCell);

      let emailsCell = document.createElement("td");
      emailsCell.textContent = info.emails ? info.emails.join(", ") : "";

      let phonesCell = document.createElement("td");
      phonesCell.textContent = info.phones ? info.phones.join(", ") : "";

      row.appendChild(companyCell);
      row.appendChild(urlCell);
      row.appendChild(emailsCell);
      row.appendChild(phonesCell);
      infoList.appendChild(row);
    });
    console.log(storedInfo);
  });
}

sendButton.addEventListener("click", () => {
  chrome.storage.local.get("webInfo", function (result) {
    const storedInfo = result.webInfo || [];
    // Replace with your actual API call
    fetch("your-api-endpoint", {
      method: "POST",
      body: JSON.stringify(storedInfo),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        chrome.storage.local.remove("webInfo");
        displayInfo([]); // Clear list after send
      })
      .catch((error) => console.error("Error sending data:", error));
  });
});

displayInfo();
