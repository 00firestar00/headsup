
let headers = document.getElementsByClassName("header");

function saveHeader(header) {
    chrome.storage.sync.set({
        header: header
    }, function() {
        console.log("Saved");
    });
}

function restore_options() {
    // Use defaults
    chrome.storage.sync.get({
        header: { "name": "", "value": ""},
    }, function(items) {
        for (let i = 0; i < headers.length; i++) {
            headers[i].getElementsByClassName("name")[0].value = items.header.name;
            headers[i].getElementsByClassName("value")[0].value = items.header.value;
        }
    });
}

for (let i = 0; i < headers.length; i++) {
    let name = headers[i].getElementsByClassName("name")[0];
    let value = headers[i].getElementsByClassName("value")[0];
    name.addEventListener('input', saveHeader);
    value.addEventListener('input', saveHeader);
    saveHeader({ "name": name.value, "value": value.value});
}

document.addEventListener('DOMContentLoaded', restore_options);