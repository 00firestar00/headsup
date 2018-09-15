let doc_headers = document.getElementsByClassName("header");
let row_count = 0;

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector(".active").addEventListener("input", saveHeaders);
document.querySelector(".clear").addEventListener("click", removeRow);

addButton = document.querySelector("#add_button");
addButton.addEventListener("click", addRow);

const ibutton = document.querySelector('#import_button');
const idialog = document.querySelector('#import_box');
ibutton.addEventListener('click', function() {
    idialog.showModal();
});
idialog.querySelector('.close').addEventListener('click', function() {
    idialog.close();
});

const ebutton = document.querySelector('#export_button');
const edialog = document.querySelector('#export_box');
ebutton.addEventListener('click', function() {
    edialog.showModal();
});
edialog.querySelector('.close').addEventListener('click', function() {
    edialog.close();
});

function saveHeaders() {
    let headers = [];
    for (let i = 0; i < doc_headers.length; i++) {
        let name = doc_headers[i].querySelector(".name");
        let value = doc_headers[i].querySelector(".value");
        let active = doc_headers[i].querySelector(".active");
        if (name.value === "" && value.value === "") {
            continue;
        }
        headers.push({"name": name.value, "value": value.value, "active": active.checked})
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
        let name = doc_headers[i].querySelector(".name");
        let value = doc_headers[i].querySelector(".value");
        let active = doc_headers[i].querySelector(".active");
        name.addEventListener("input", saveHeaders);
        value.addEventListener("input", saveHeaders);
        active.addEventListener("change", saveHeaders);
    }
}

function restoreOptions() {
    // Use defaults
    chrome.storage.sync.get({
        "headers": {"name": "", "value": "", "active": ""},
        "count": row_count
    }, function (items) {
        for (let i = 0; i < items.count; i++) {
            addRow();
            if (items.headers[i].name === "" || items.headers[i].value === "") {
                continue;
            }
            doc_headers[i].querySelector(".name").value = items.headers[i].name;
            doc_headers[i].querySelector(".value").value = items.headers[i].value;
            doc_headers[i].querySelector(".active").checked = items.headers[i].active;
        }
        console.log("Restore");
        console.log(items);
        addListeners();
    });
}

function removeRow() {
    row_count--;
    chrome.storage.sync.set({
        "count": row_count
    }, function () {
        console.log("Removed Row");
        console.log(row_count);
    });
    this.closest(".row").remove();
    saveHeaders();
}

function addRow() {
    let clone = document.querySelector("#first_row").cloneNode(true);
    let rand = Math.random().toString(36).substring(7);

    clone.setAttribute("id", "row"+rand);
    clone.removeAttribute("style");
    clone.classList.add("header");
    let a = clone.querySelector("#active");
    let lbl = clone.querySelector("#label_active");
    a.setAttribute("id", rand);
    lbl.setAttribute("for", rand);
    lbl.setAttribute("id", "label"+rand);
    componentHandler.upgradeElements(a);
    document.querySelector("#header_selector").appendChild(clone);

    let name = clone.querySelector(".name");
    let value = clone.querySelector(".value");
    let active = clone.querySelector(".active");
    let clear = clone.querySelector(".clear");

    name.value = "";
    value.value = "";
    name.addEventListener("input", saveHeaders);
    value.addEventListener("input", saveHeaders);
    active.addEventListener("input", saveHeaders);
    clear.addEventListener("click", removeRow);

    row_count++;
    chrome.storage.sync.set({
        "count": row_count
    }, function () {
        console.log("Added Row");
        console.log(row_count);
    });
}
