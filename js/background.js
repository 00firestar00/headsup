function getHeader() {
    return JSON.parse(localStorage.getItem("header"));
}

function modifyHeaders(details) {
    header = getHeader();
    details.requestHeaders.push(header);
    return {requestHeaders: details.requestHeaders};
}
chrome.webRequest.onBeforeSendHeaders.addListener(
    modifyHeaders,
    {urls: ["<all_urls>"]},
    ['requestHeaders', 'blocking']
);
