let emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z._-]+\.[a-zA-Z]{2,})/gi; 
let phoneRegex = /(\+91)?[\s-]?[6789]\d{9}/g;

let companyName = document.title.split('-')[0].trim() || 'Unknown'; // Simple extraction
let emails = document.body.textContent.match(emailRegex) || []; // Store all email matches
let phones = document.body.textContent.match(phoneRegex) || [];
let url = window.location.href;

console.log("Emails:", emails);
console.log("Phones:", phones);


console.log("Content script running");
chrome.runtime.sendMessage({ 
    type: "webInfo", 
    data: { companyName, emails, phones, url } 
});

// Simple URL validation (enhance as needed)
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

if (isValidUrl(url) && companyName) {
    chrome.storage.local.get("webInfo", function(result) {
        let storedInfo = result.webInfo || [];

        let domainIndex = storedInfo.findIndex(info => new URL(info.url).hostname === new URL(url).hostname);

        if (domainIndex !== -1) {
            // Domain already exists
            let domainInfo = storedInfo[domainIndex];

            // Check for new unique emails and phones
            let newEmails = emails.filter(email => !domainInfo.emails.includes(email));
            let newPhones = phones.filter(phone => !domainInfo.phones.includes(phone));

            // Update domainInfo with new emails and phones
            domainInfo.emails.push(...newEmails);
            domainInfo.phones.push(...newPhones);

            // Update storedInfo
            storedInfo[domainIndex] = domainInfo;
        } else {
            // Domain doesn't exist, add new entry
            storedInfo.push({
                companyName,
                url,
                emails,
                phones
            });
        }

        // Store updated data
        chrome.storage.local.set({ webInfo: storedInfo }); 
    });
}


// if (isValidUrl(url) && companyName) {
//     chrome.storage.local.get("webInfo", function(result) {
//         let storedInfo = result.webInfo || [];

//         // Check if the current data already exists in the storedInfo
//         let exists = storedInfo.some(info => {
//             return info.url === url && info.companyName === companyName;
//         });

//         if (!exists) { 
//             // Create a Set to store unique emails and phones
//             let uniqueEmails = new Set(emails);
//             let uniquePhones = new Set(phones);

//             // Convert sets back to arrays
//             let uniqueEmailsArray = Array.from(uniqueEmails);
//             let uniquePhonesArray = Array.from(uniquePhones);

//             // Store only if the data doesn't exist
//             storedInfo.push({
//                 companyName,
//                 url,
//                 emails: uniqueEmailsArray,
//                 phones: uniquePhonesArray
//             });
//             chrome.storage.local.set({ webInfo: storedInfo }); 
//         }
//     });
// }

