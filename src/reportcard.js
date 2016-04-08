var table = document.getElementById("report");
chrome.history.search({text: '', maxResults: 10}, function(data) {
    data.forEach(function(page) {
    	var tr = document.createElement('tr');
    	var td1 = document.createElement('td');
    	var td2 = document.createElement('td');
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var h21 = document.createElement('h2');
        var h22 = document.createElement('h2');
        var host = getLocation(page.url);
        var text1 = document.createTextNode(host.hostname);
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
   		   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var myArr = JSON.parse(xmlhttp.responseText);
                var text2 = document.createTextNode(myArr[host.hostname][0][0]);
                h22.className = "text-center";
                h22.appendChild(text2);
   		   }
		};
    	xmlhttp.open("GET", "http://api.mywot.com/0.4/public_link_json2?hosts="+host.hostname+"/&key=aac42146ef84f207eda6922c397768d57043c5f5", true);
    	xmlhttp.send();
        div1.className = "col-md-6";
        div2.className = "col-md-6";
        h21.className = "text-center";
        h21.appendChild(text1);
        div1.appendChild(h21);
        div2.appendChild(h22);
		td1.appendChild(div1);
        td2.appendChild(div2);
		tr.appendChild(td1);
		tr.appendChild(td2);
        table.appendChild(tr);
    });
});

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
