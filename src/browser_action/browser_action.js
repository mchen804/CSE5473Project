$(document).ready(function(){
    var trustworthiness = "Error";
    var child_safety = "Error";
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs){ //Get active tab
        var currentTab = tabs[0];
        var host = getLocation(currentTab.url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { //Wait for results to return
                var myArr = JSON.parse(xmlhttp.responseText);
                trustworthiness = myArr[host.hostname]["0"][0];
                child_safety = myArr[host.hostname]["4"][0];
                $('#trustworthiness').html(trustworthiness); //Update text in DOM
                $('#child_safety').html(child_safety);
            }
        };
        xmlhttp.open("GET", "http://api.mywot.com/0.4/public_link_json2?hosts="+host.hostname+"/&key=aac42146ef84f207eda6922c397768d57043c5f5", true);
        xmlhttp.send();
        $('#hostname').html(host.hostname);
    });
});

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
