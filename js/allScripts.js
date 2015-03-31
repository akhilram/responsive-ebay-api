(function($,W,D)
{
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            //form validation rules
            $("#search-form").validate({
                rules: {
                    keywords: "required",
                    minPrice: {
                        number: true,
                        min: 0
                        // greaterThan: "minPrice"
                    },
                    maxPrice: {
                        number: true,
                        min: 0,
                        greaterThan: "minPrice"
                    },
                    maxHandlingDays: {
                        digits: true,
                        min: 1
                    }
                },
                messages: {
                    keywords: "Please enter keywords",
                    minPrice: {
                        min: "Price cannot be negative",
                        number: "Price has to be a proper number"
                    },
                    maxPrice: {
                        min: "Price cannot be negative",
                        number: "Price has to be a proper number",
                        greaterThan: "Maximum price cannot be less than Minimum price"
                    },
                    maxHandlingDays: {
                        number: "Maximum Handling days should be a valid number",
                        min: "Maximum Handling days should be greater than or equal to 1"
                    }
                },
                submitHandler: function(form) {
                    form.submit();
                }
            });
}
}

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
        // $("#search-form").on('submit', getJSONdata);
        document.getElementById('submit').onclick = getJSONdata;
        document.getElementById('1').onclick = getJSONdata;
        document.getElementById('2').onclick = getJSONdata;
        document.getElementById('3').onclick = getJSONdata;
        document.getElementById('4').onclick = getJSONdata;
        document.getElementById('5').onclick = getJSONdata;
        document.getElementById('previous').onclick = getJSONdata;
        document.getElementById('next').onclick = getJSONdata;

        // max price greater than min price
        $.validator.addMethod("greaterThan",
            function(value, element, param) {
                var i = parseFloat($("#minPrice").val());
                var j = parseFloat($("#maxPrice").val());
                if (isNaN(i)||isNaN(j)) {
                    return true;
                };
                var stat = (i<=j) ? true : false;
                console.log(stat);
                return stat;
            }
            );

        // $.validator.addMethod("crossfield",
        //     function(value, element, param) {
        //         $("")
        //     }
        //     );

});

    // call web server and get the json data
    function getJSONdata(pageNumber) {
        if($("#search-form").valid()) {

            if(pageNumber.srcElement.id == "submit") {
                pageNum = 1;
            }
            else if(pageNumber.srcElement.id == "previous" || pageNumber.srcElement.id == "next") {
                var allPages = document.getElementsByClassName('page');
                for (var i=0; i<allPages.length; i++) {
                    if(allPages[i].parentNode.className == "active") {
                        if(pageNumber.srcElement.id == "previous") {
                            if(document.getElementById('previous').parentNode.className == "disabled") {
                                return false;
                            }
                            pageNum = parseInt(allPages[i].innerHTML)-1;
                        }
                        else {
                            if(document.getElementById('next').parentNode.className == "disabled") {
                                return false;
                            }
                            pageNum = parseInt(allPages[i].innerHTML)+1;
                        }
                        break;
                    }
                }
            }
            else {
                if(document.getElementById(pageNumber.srcElement.id).parentNode.className == "disabled") {
                    return false;
                }
                pageNum = parseInt(document.getElementById(pageNumber.srcElement.id).innerHTML);
            }

            var url = "/search-ebay.php";
            var data2 = {};
            data2["keywords"] = document.getElementById("inputKeyWords").value;
            data2["sortOrder"] = document.getElementById("sortOrder").options[document.getElementById("sortOrder").selectedIndex].value;
            data2["entriesPerPage"] = document.getElementById("resultsPerPage").options[document.getElementById("resultsPerPage").selectedIndex].value;
            data2["MaxHandlingTime"] = document.getElementById("maxHandlingDays").value;
            data2["pageNum"] = pageNum;
            if(document.getElementById("minPrice").value != '') { 
                data2["MinPrice"] = document.getElementById("minPrice").value;
            }
            if(document.getElementById("maxPrice").value != '') {
                data2["MaxPrice"] = document.getElementById("maxPrice").value;
            }
            if(document.getElementById("new").checked) {
                data2["New"] = "on";
            }
            if(document.getElementById("used").checked) {
                data2["Used"] = "on";
            }
            if(document.getElementById("good").checked) {
                data2["Good"] = "on";
            }
            if(document.getElementById("veryGood").checked) {
                data2["VeryGood"] = "on";
            }
            if(document.getElementById("acceptable").checked) {
                data2["Acceptable"] = "on";
            }

            if(document.getElementById("buyItNow").checked) {
                data2["FixedPrice"] = "on";
            }
            if(document.getElementById("auction").checked) {
                data2["Auction"] = "on";
            }
            if(document.getElementById("classifiedAds").checked) {
                data2["Classified"] = "on";
            }

            if(document.getElementById("returnAccepted").checked) {
                data2["ReturnsAcceptedOnly"] = "on";
            }

            if(document.getElementById("freeShipping").checked) {
                data2["FreeShippingOnly"] = "on";
            }
            if(document.getElementById("expeditedShipping").checked) {
                data2["ExpeditedShippingType"] = "on";
            }

            $.ajax({    
                url: url,
                data: data2,
                dataType : "json",
                type: 'GET',
                success: function(output) {
                    processData(output, pageNum);
                },
            //     error:  function(){
            //         console.log("Output error");
            //     }   
        });
            

            
            console.log("Form submitted");
            return false;
        }
        else {
            console.log("not Done");
            return false;
        }
    }

    function processData(output, pageNumber) {
        if(output.resultCount == 0) {
            document.getElementById('results').style.display = "none";
            document.getElementById('failure').style.display = "inline";
            return;
        }
        document.getElementById('failure').style.display = "none";
        addResultCount(output);
        addResults(output);
        document.getElementById('results').style.display = "inline";
        pageProcess(pageNumber, output["resultCount"], output["itemCount"]);
    }
    function pageProcess(pageNum, resCount, itCount) {

        var pageId = (pageNum%5 == 0 ? 5 : pageNum%5);
        var maxpage = Math.ceil(resCount/itCount);

        if(pageId == 1) {
            document.getElementById('previous').parentNode.className = "disabled";
        }
        else {
            document.getElementById('previous').parentNode.className = "";
        }

        var allPages = document.getElementsByClassName('page');
        for (var i=0; i<allPages.length; i++) {
            allPages[i].parentNode.className = "";
            if(parseInt(allPages[i].innerHTML) > maxpage) {
                allPages[i].parentNode.className = "disabled";
            }
        }
        
        document.getElementById(pageId.toString()).parentNode.className = "active";    
        
        var currHighest = parseInt(document.getElementById("5").innerHTML);
        var currLowest = parseInt(document.getElementById("1").innerHTML);

        if(pageNum == currHighest+1) {
            for (var i=0; i<allPages.length; i++) {
                allPages[i].innerHTML = parseInt(allPages[i].innerHTML)+5;
            }
        }
        if(pageNum == currLowest-1) {
            for (var i=0; i<allPages.length; i++) {
                allPages[i].innerHTML = parseInt(allPages[i].innerHTML)-5;
            }
        }
        if(currHighest >= maxpage) {
            document.getElementById('next').parentNode.className = "disabled";
        }
        else {
            document.getElementById('next').parentNode.className = "";
        }
    }
    function addResultCount(output) {
        var pageStart = ((output["pageNumber"]-1)*output["itemCount"])+1;
        var pageEnd = Math.min(pageStart + output["itemCount"] - 1, output["resultCount"]);
        document.getElementById('pagestat').innerHTML = pageStart + '-' + pageEnd + ' items out of ' + output["resultCount"];
        document.getElementById('results').style.display = "inline";
    }
    function addResults(output) {
        document.getElementById('resultset').innerHTML = '';
        var count = 0;
        for(var key in output) {
            if(key.substring(0,4) == "item" && key != "itemCount") {
                addMediaObj(output[key], count);
                count++;
            }
        }
    }
    function addMediaObj(item, count) {
        var divMedia = document.createElement("div");
        divMedia.className = "mediaelement";
        var divMediaLeft = document.createElement("div");
        divMediaLeft.className = "media-left media-middle";
        
        //***image**********************************************
        var _img_a = document.createElement("a");
        _img_a.href = "#";
        $(_img_a).attr("data-toggle", "modal");
        $(_img_a).attr("data-target", count);
        
        var _img = document.createElement("img");
        _img.className = "media-object image-thump";
        _img.src = item.basicInfo.galleryURL;
        _img_a.appendChild(_img);

        divMediaLeft.appendChild(_img_a);
        //***image**********************************************
        
        //***modalimage*****************************************
        var modal = document.createElement("div");
        modal.className = "modal fade " + count;
        modal.tabIndex = "-1";
        modal.role = "dialog";
        $(modal).attr("aria-labelledby", count);
        $(modal).attr("aria-hidden", "true");
        $(modal).attr("role", "dialog");
        // modal.aria-labelledby="myImgModalLabel";
        // modal.aria-hidden="true";

        var modalLg = document.createElement("div");
        modalLg.className = "modal-dialog modal-lg";
        var modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.innerHTML = "<img src=" + item.basicInfo.pictureURLSuperSize + ">";
        modalLg.appendChild(modalContent);

        modal.appendChild(modalLg);
        divMediaLeft.appendChild(modal);
        //***modalimage*****************************************
        
        var divMediaBody = document.createElement("div");
        divMediaBody.className = "media-body";
        var _a = document.createElement("a");
        _a.href = item.basicInfo.viewItemURL;
        var _h4 = document.createElement("p");
        _h4.className = "media-heading";
        _h4.innerHTML = item.basicInfo.title;
        _a.appendChild(_h4);
        divMediaBody.appendChild(_a);
        var _b = document.createElement("b");
        _b.innerHTML = "Price: $" + item.basicInfo.convertedCurrentPrice;
        divMediaBody.appendChild(_b);
        if(item.basicInfo.shippingServiceCost == 0) {
            divMediaBody.innerHTML += "&nbsp(FREE SHIPPING)";
        }
        else {
            divMediaBody.innerHTML += "&nbsp(+$" + item.basicInfo.shippingServiceCost + " for shipping)";
        }

        var _i = document.createElement("i");
        _i.innerHTML = "&nbsp&nbsp&nbspLocation: " + item.basicInfo.location;
        divMediaBody.appendChild(_i);

        var _img_top = document.createElement("img");
        
        var details = document.createElement("a");
        details.href = "#";
        details.innerHTML = "&nbsp&nbspView Details";
        divMediaBody.appendChild(details);

        divMedia.appendChild(divMediaLeft);
        divMedia.appendChild(divMediaBody);
        document.getElementById('resultset').appendChild(divMedia);
        // <div class="media">
        //                     <div class="media-left media-middle">
        //                         <img class="media-object image-thump" src="http://thumbs2.ebaystatic.com/m/mqajRbE-6CfHvlB64wNF5Ew/140.jpg">
        //                     </div>
        //                     <div class="media-body">
        //                         <h4 class="media-heading">Middle aligned media</h4>
        //                         Price: $84(Free Shipping) Location: Rainbow city, AL, USA View Details
        //                     </div>
        //                 </div>
    }

})(jQuery, window, document);
