function getHeaders() {
    return JSON.parse(localStorage.getItem("headers"));
}

function modifyHeaders(details) {
    let headers = getHeaders();
    details.requestHeaders = details.requestHeaders.concat(headers);
    console.log(details.requestHeaders);
    return {requestHeaders: details.requestHeaders};
}
chrome.webRequest.onBeforeSendHeaders.addListener(
    modifyHeaders,
    {urls: ["<all_urls>"]},
    ['requestHeaders', 'blocking']
);
chrome.storage.sync.get({
    "headers": [],
}, function(items) {
    localStorage.setItem("headers", JSON.stringify(items.headers));
    console.log("Restore2");
    console.log(items);
});