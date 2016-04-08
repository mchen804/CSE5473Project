var listCategories = function(list){
    var len = Object.keys(list).length;
    var categories = [];
    var ctr = 0;
    $.each(list, function(index, item){
        var desc;
        switch(index){
            //Negative
            case "101":
                desc = "Malware/Viruses";
                break;
            case "102":
                desc = "Poor Customer Experience";
                break;
            case "103":
                desc = "Phishing";
                break;
            case "104":
                desc = "Scam";
                break;
            case "105":
                desc = "Potentially Illegal";
                break;
            //Questionable
            case "201":
                desc = "Misleading Claims/Unethical";
                break;
            case "202":
                desc = "Privacy Risks";
                break;
            case "203":
                desc = "Suspicious";
                break;
            case "204":
                desc = "Hate/Discrimination";
                break;
            case "205":
                desc = "Spam";
                break;
            case "206":
                desc = "Potentially Unwanted Programs";
                break;
            case "207":
                desc = "Ads/Pop-Ups";
                break;
            //Neutral
            case "301":
                desc = "Online Tracking";
                break;
            case "302":
                desc = "Alternative/Controversial Medicine";
                break;
            case "303":
                desc = "Opinions, Religion, Politics";
                break;
            case "304":
                desc = "Other";
                break;
            //Positive:
            case "501":
                desc = "Good Site";
                break;
            //Child Safety
            case "401":
                desc = "Adult Content";
                break;
            case "402":
                desc = "Incidental Nudity";
                break;
            case "403":
                desc = "Gruesome/Shocking";
                break;
            case "404":
                desc = "Site for Kids";
                break;
            default:
                desc = "No Description";
        }
        if (ctr == len - 1){
            categories.push(desc);
        } else {
            categories.push(desc + ", ");
        }
        ctr++;
    });
    return categories.join("");
}
