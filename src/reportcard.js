chrome.history.search({text: '', maxResults: 10}, function(data) {
    data.forEach(function(page) {
        var host = getLocation(page.url);
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
   		   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var myArr = JSON.parse(xmlhttp.responseText);
                var text2 = myArr[host.hostname]["0"][0];
                $('#report tr:last').after('<tr><td><h2>'+host.hostname+'</h2></td><td><h2>'+text2+'</h2></td></tr>');
   		   }
		};
    	xmlhttp.open("GET", "http://api.mywot.com/0.4/public_link_json2?hosts="+host.hostname+"/&key=aac42146ef84f207eda6922c397768d57043c5f5", true);
    	xmlhttp.send();
        
    });
});

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
