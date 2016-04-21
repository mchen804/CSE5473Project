function showHTTPS(){
 chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true, 'currentWindow': true }, function(tabs){ //Get active tab
        var currentTab = tabs[0];
        var selectedId = tabs[0].id;
        //console.log(selectedId);
        //console.log(currentTab.url);
        var host = getLocation(currentTab.url);
        console.log(host.protocol);
        if(host.protocol == 'http:'){
            //console.log("http");
            chrome.browserAction.setBadgeText({text : "HTTP", tabId: selectedId});
            chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000", tabId: selectedId});
        } else if(host.protocol == 'https:'){
            //console.log("https");
            chrome.browserAction.setBadgeText({text: "safe", tabId: selectedId});
            chrome.browserAction.setBadgeBackgroundColor({ color: "#00ff00", tabId: selectedId});
        } else {
            console.log("else");
            chrome.browserAction.setBadgeText({text: "none", tabId: selectedId});
        }
    });
};
chrome.tabs.onActivated.addListener(function(info){
    showHTTPS();
});

chrome.tabs.onUpdated.addListener(function(tabId , info) {
    if (info.status == "complete") {
        showHTTPS();
    }
});

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

var wr = chrome.webRequest;
var redirectCounter = {};

function onBeforeRequest(details) {

  var uri = document.createElement('a');
  uri.href = details.url;


  // Normalise hosts such as "www.example.com."
  var canonical_host = uri.hostname;
  if (canonical_host.charAt(canonical_host.length - 1) == ".") {
    while (canonical_host.charAt(canonical_host.length - 1) == ".")
      canonical_host = canonical_host.slice(0,-1);
    uri.hostname = canonical_host;
  }

  // If there is a username / password, put them aside during the ruleset
  // analysis process
  var using_credentials_in_url = false;
  if (uri.password || uri.username) {
      using_credentials_in_url = true;
      var tmp_user = uri.username;
      var tmp_pass = uri.password;
      uri.username = null;
      uri.password = null;
  }

  var canonical_url = uri.href;




  var newuristr = null;
    console.log(canonical_url);
    newuristr = canonical_url.replace("http:","https:");

  if (newuristr && using_credentials_in_url) {
    // re-insert userpass info which was stripped temporarily
    var uri_with_credentials = document.createElement('a');
    uri_with_credentials.href = newuristr;
    uri_with_credentials.username = tmp_user;
    uri_with_credentials.password = tmp_pass;
    newuristr = uri_with_credentials.href;
  }




  if (newuristr) {
    console.log(newuristr);
    return {redirectUrl: newuristr};
  } else {
    return {cancel: false};
  }
}

function onBeforeRedirect(details) {
    // Catch redirect loops (ignoring about:blank, etc. caused by other extensions)
    var prefix = details.redirectUrl.substring(0, 5);
    if (prefix === "http:" || prefix === "https") {
        if (details.requestId in redirectCounter) {
            redirectCounter[details.requestId] += 1;
        } else {
            redirectCounter[details.requestId] = 1;
        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        console.log("Attempted Request: " + info.url);
        var host = getLocation(info.url);
        var xmlhttp = new XMLHttpRequest();
        var trustworthiness = 0;
        var child_safety = 0;
        var r = false;
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var myArr = JSON.parse(xmlhttp.responseText);
                trustworthiness = myArr[host.hostname]["0"][0];
                child_safety = myArr[host.hostname]["4"][0];

                if (trustworthiness < 60 && child_safety < 60){
                    r = confirm("The site you are about to visit (" + host.hostname + ") has a low trustworthiness rating of " + trustworthiness + " and a low child safety rating of " + child_safety + ".\n\nAre you sure you want to proceed?");
                } else if (child_safety < 60){
                    r = confirm("The site you are about to visit (" + host.hostname + ") has a low child safety rating of " + child_safety + ".\n\nAre you sure you want to proceed?");
                } else if (trustworthiness < 60){
                    r = confirm("The site you are about to visit (" + host.hostname + ") has a low trustworthiness rating of " + trustworthiness + ".\n\nAre you sure you want to proceed?");
                }
            }
        };
        xmlhttp.open("GET", "http://api.mywot.com/0.4/public_link_json2?hosts="+host.hostname+"/&key=aac42146ef84f207eda6922c397768d57043c5f5", true);
        xmlhttp.send();
        return {cancel: r};
    },
    // filters
    {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    },
    // extraInfoSpec
    ["blocking"]);

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

// Registers the handler for requests
// We listen to all HTTP hosts, because RequestFilter can't handle tons of url restrictions.
wr.onBeforeRequest.addListener(onBeforeRequest, {urls: ["http://*/*"]}, ["blocking"]);


var httpsUrlsWeListenTo = ["https://*/*"];
// See: https://developer.chrome.com/extensions/match_patterns
wr.onBeforeRequest.addListener(onBeforeRequest, {urls: httpsUrlsWeListenTo}, ["blocking"]);


// Try to catch redirect loops on URLs we've redirected to HTTPS.
wr.onBeforeRedirect.addListener(onBeforeRedirect, {urls: ["https://*/*"]});
