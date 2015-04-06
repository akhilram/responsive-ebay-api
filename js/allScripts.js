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
        window.resultTemplate = Handlebars.compile($("#entry-template").html());
        Handlebars.registerHelper('ifTrue', function(v1, v2, options) {
            if(v1 == v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
        
        JQUERY4U.UTIL.setupFormValidation();
        
        $(".paginate").click(getJSONData);

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

        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_UK/all.js', function(){
            FB.init({
              appId: '1480111102248684',
          });     
            
        });

        

        // $.validator.addMethod("crossfield",
        //     function(value, element, param) {
        //         $("")
        //     }
        //     );

});

    // call web server and get the json data
    function getJSONData(e) {
        if($("#search-form").valid()) {
            // console.log(window.fbAsyncInit);
            var id = ($(e.target)).attr('id');
            
            //derive page
            if(id == "submit") {
                pageNum = 1;
            }
            else if(id == "previous" || id == "next") {
                var allPages = document.getElementsByClassName('page');
                for (var i=0; i<allPages.length; i++) {
                    if(allPages[i].parentNode.className == "active") {
                        if(id == "previous") {
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
                if(document.getElementById(id).parentNode.className == "disabled") {
                    return false;
                }
                pageNum = parseInt(document.getElementById(id).innerHTML);
            }

            //fill parameters for ajax get
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

        if(pageNum == 1) {
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
        var itemArray = [];
        for(var key in output) {
            if(key.substring(0,4) == "item" && key != "itemCount") {
                // addMediaObj(output[key], count);
                var thisI = output[key];
                output[key].shippingInfo.shippingType = output[key].shippingInfo.shippingType.replace(/([A-Z])/g, " $1");
                count++;
                itemArray.push(output[key]);
            }
        }
        var result = resultTemplate({items:itemArray});
        $("#resultset").html(result);
        $(".fblogo").click(postToFB); 
    }

    function postToFB(e) {
        console.log('clicked');
        e.preventDefault();

        var itemDiv = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

        var img = itemDiv.getElementsByClassName("image-thump");
        img = img[0];
        var title = itemDiv.getElementsByClassName("media-heading");
        title = title[0];
        var link = title.parentNode.href;

        var desc = '';
        var temp = itemDiv.getElementsByTagName("b");
        desc += temp[0].innerHTML;
        temp = itemDiv.getElementsByTagName("span");
        temp = temp[1];
        temp = temp.childNodes[2].textContent;
        desc += temp;
        temp = itemDiv.getElementsByTagName("i");
        desc += temp[0].innerHTML;


        FB.ui({
            method: 'feed',
            picture: img.src,
            link: link,
            caption: 'Search information from ebay.com',
            title: title.innerHTML,
            description: desc,

        }, function(response){});
        return false;
    }

    // function statusChangeCallback(response) {
    //     console.log('statusChangeCallback');
    //     console.log(response);
    //     if (response.status === 'connected') {
    //         testAPI();
    //     } 
    //     else if (response.status === 'not_authorized') {
    //         document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    //     } 
    //     else {
    //         document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    //     }
    // }

    // function checkLoginState() {
    //     FB.getLoginStatus(function(response) {
    //       statusChangeCallback(response);
    //   });
    // }

    // FB.getLoginStatus(function(response) {
    // statusChangeCallback(response);
    // });


})(jQuery, window, document);
