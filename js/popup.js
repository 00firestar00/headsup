
let doc_headers = document.getElementsByClassName("header");

function saveHeaders() {
    let headers = [];
    for (let i = 0; i < doc_headers.length; i++) {
        let name = doc_headers[i].getElementsByClassName("name")[0];
        let value = doc_headers[i].getElementsByClassName("value")[0];
        if (name.value === "" || value.value === "") {
            continue;
        }
        headers.push({ "name": name.value, "value": value.value})
    }

    chrome.storage.sync.set({
    "headers": headers
    }, function() {
        console.log("Saved");
        console.log(headers);
    });
}

function restore_options() {
    // Use defaults
    chrome.storage.sync.get({
        "headers": { "name": "", "value": ""},
    }, function(items) {
        for (let i = 0; i < doc_headers.length; i++) {
            if (items.headers[i].value === "" || items.headers[i].value === "") {
                continue;
            }
            doc_headers[i].getElementsByClassName("name")[0].value = items.headers[i].name;
            doc_headers[i].getElementsByClassName("value")[0].value = items.headers[i].value;
        }
        console.log("Restore");
        console.log(items);
    });
}

for (let i = 0; i < doc_headers.length; i++) {
    let name = doc_headers[i].getElementsByClassName("name")[0];
    let value = doc_headers[i].getElementsByClassName("value")[0];
    name.addEventListener('input', saveHeaders);
    value.addEventListener('input', saveHeaders);
}

document.addEventListener('DOMContentLoaded', restore_options);
