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
                var categories = myArr[host.hostname]["categories"];
                trustworthiness = myArr[host.hostname]["0"][0];
                child_safety = myArr[host.hostname]["4"][0];
                $('#trustworthiness').html(trustworthiness); //Update text in DOM
                $('#child_safety').html(child_safety);
                //Change trustworthiness badge color based on rating
                if(trustworthiness >= 60){
                    $('#trustworthiness').addClass("label-success");
                } else if(trustworthiness >= 40){
                    $('#trustworthiness').addClass("label-warning");
                } else {
                    $('#trustworthiness').addClass("label-danger");
                }
                //Change child safety badge color based on rating
                if(child_safety >= 60){
                    $('#child_safety').addClass("label-success");
                } else if(child_safety >= 40){
                    $('#child_safety').addClass("label-warning");
                } else {
                    $('#child_safety').addClass("label-danger");
                }
                $('#categories').html(listCategories(categories)); // Populate Categories
            }
        };
        xmlhttp.open("GET", "http://api.mywot.com/0.4/public_link_json2?hosts="+host.hostname+"/&key=aac42146ef84f207eda6922c397768d57043c5f5", true);
        xmlhttp.send();
        $('#hostname').html(host.hostname);
//        if(location.protocol == 'http:'){
//	       $('#connection').html("HTTP");
//           $('#connection').addClass("label-warning");
//        } else if(location.protocol == 'https:'){
//	       $('#connection').html("HTTPS");
//           $('#connection').addClass("label-success");
//        } else {
//            $('#connection').html("Unknown");
//            $('#connection').addClass("label-default");
//        }
    });
});

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
