let doc_headers = document.getElementsByClassName("header");

document.addEventListener("DOMContentLoaded", restoreOptions);

const addButton = document.querySelector("#add_button");
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

function restoreOptions() {
    // Use defaults
    chrome.storage.sync.get({
        "headers": {"name": "", "value": "", "active": ""},
    }, function (items) {
        for (let i = 0; i < items.headers.length; i++) {
            addRow();
            if (items.headers[i].name === "" || items.headers[i].value === "") {
                continue;
            }

            doc_headers[i].querySelector(".name").value = items.headers[i].name;
            doc_headers[i].querySelector(".value").value = items.headers[i].value;
            const a = doc_headers[i].querySelector(".active");
            a.checked = items.headers[i].active;
            if (a.checked) {
                const l = a.closest(".label");
                l.classList.add("is-checked");
                componentHandler.upgradeElements(a);
                componentHandler.upgradeElements(l);
            }
        }
        console.log("Restore");
        console.log(items);
    });
}

function removeRow() {
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
}
// <span class="mdl-list__item-secondary-action">
//     <label id="labelud0t57" class="label mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked" for="ud0t57" data-upgraded=",MaterialCheckbox,MaterialRipple">
//     <input type="checkbox" id="ud0t57" class="active mdl-checkbox__input">
//     <span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span>
// </span><span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple">
// <span class="mdl-ripple">
// </span></span></label>
// </span>
// <span class="mdl-list__item-secondary-action">
//     <label id="labelvrkqr" class="label mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect is-checked mdl-js-ripple-effect--ignore-events is-upgraded" for="vrkqr" data-upgraded=",MaterialCheckbox,MaterialRipple">
//     <input type="checkbox" id="vrkqr" class="active mdl-checkbox__input">
//     <span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span>
// </span><span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple">
// <span class="mdl-ripple is-animating" style="width: 103.823px; height: 103.823px; transform: translate(-50%, -50%) translate(18px, 18px);">
// </span></span></label>
// </span>