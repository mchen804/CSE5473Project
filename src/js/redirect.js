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