// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    console.log("Attempted Request: " + info.url);
    // Redirect the lolcal request to a random loldog URL.
    return {redirectUrl: "https://www.facebook.com/"};
  },
  // filters
  {
    urls: [
      "https://www.google.com/*"
    ],
    types: ["main_frame"]
  },
  // extraInfoSpec
  ["blocking"]);
