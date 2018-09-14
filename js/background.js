function getHeaders() {
    return JSON.parse(localStorage.getItem("headers"));
}

function setHeaders(headers) {
    localStorage.setItem("headers", JSON.stringify(headers));
}

function modifyHeaders(details) {
    let headers = getHeaders();
    headers.map(function(x) {
        delete x.active;
        return x
    });

    chrome.browserAction.setBadgeText({text: headers.length.toString()});
    details.requestHeaders = details.requestHeaders.concat(headers);
    console.log(details.requestHeaders);
    return {requestHeaders: details.requestHeaders};
}

function syncHeaders() {
    chrome.storage.sync.get({
        "headers": [],
    }, function (items) {
        let h = items.headers.filter(h => h.active);
        setHeaders(h);
        chrome.browserAction.setBadgeText({text: h.length.toString()});
        console.log("Restore2");
        console.log(items);
    });
}

document.addEventListener('DOMContentLoaded', syncHeaders);

chrome.webRequest.onBeforeSendHeaders.addListener(
    modifyHeaders,
    {urls: ["<all_urls>"]},
    ['requestHeaders', 'blocking']
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        syncHeaders();
        console.log("syncing headers from main")
    }
);

//{"title":"Profile 1","hideComment":true,"headers":[{"enabled":false,"name":"MyRyzenServer","value":"a7s8dhaisd7kaygsduykasgd6y","comment":""},{"enabled":false,"name":"Api-Key","value":"k6Bcg69pWqqGK9k","comment":""},{"enabled":false,"name":"Api-Appid","value":"2_22634_EYtdpSTNw","comment":""}],"respHeaders":[],"filters":[],"appendMode":""}