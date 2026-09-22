
let blockedUrls = [],
    response = () => {
        return {
            redirectUrl: chrome.extension.getURL("redirect.html")
        };
    };

const FETCH_URLS = "url.json";


(() => {
    fetch(FETCH_URLS)
        .then(response => response.json())
        .then(data => {
            data.BLOCKEDDOMAINS.forEach(element => {
                blockedUrls.push(element.url);
            });
        }).then(() => {
        chrome.webRequest.onBeforeRequest.addListener(response, {urls: blockedUrls}, ['blocking']);
    }).catch(err => console.log(err));
})();

