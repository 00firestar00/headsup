let doc_headers = document.getElementsByClassName("header");
let row_count = 0;

function saveHeaders() {
    let headers = [];
    for (let i = 0; i < doc_headers.length; i++) {
        let name = doc_headers[i].getElementsByClassName("name")[0];
        let value = doc_headers[i].getElementsByClassName("value")[0];
        if (name.value === "" || value.value === "") {
            continue;
        }
        headers.push({"name": name.value, "value": value.value})
    }

    chrome.storage.sync.set({
        "headers": headers
    }, function () {
        console.log("Saved");
        console.log(headers);
    });
    chrome.runtime.sendMessage({headers: "headers"});
}

function addListeners() {
    for (let i = 0; i < doc_headers.length; i++) {
        let name = doc_headers[i].getElementsByClassName("name")[0];
        let value = doc_headers[i].getElementsByClassName("value")[0];
        name.addEventListener('input', saveHeaders);
        value.addEventListener('input', saveHeaders);
    }
}

function restore_options() {
    // Use defaults
    chrome.storage.sync.get({
        "headers": {"name": "", "value": ""},
        "count": row_count
    }, function (items) {
        for (let i = 0; i < items.count; i++) {
            addRow();
        }
        for (let i = 0; i < doc_headers.length; i++) {
            if (items.headers[i].value === "" || items.headers[i].value === "") {
                continue;
            }
            doc_headers[i].getElementsByClassName("name")[0].value = items.headers[i].name;
            doc_headers[i].getElementsByClassName("value")[0].value = items.headers[i].value;
        }
        console.log("Restore");
        console.log(items);
        addListeners();
    });
}

function addRow() {
    let row = document.querySelector("#first_row");
    let clone = row.cloneNode(true);
    clone.removeAttribute("id");
    document.querySelector("#header_selector").appendChild(clone);
    let name = clone.getElementsByClassName("name")[0];
    let value = clone.getElementsByClassName("value")[0];
    name.addEventListener('input', saveHeaders);
    value.addEventListener('input', saveHeaders);
    row_count++;
    chrome.storage.sync.set({
        "count": row_count
    }, function () {
        console.log("Saved count");
        console.log(row_count);
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

addButton = document.querySelector("#add_button");
addButton.addEventListener('click', addRow);