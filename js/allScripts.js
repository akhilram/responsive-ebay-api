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
    function getJSONdata() {
        if($("#search-form").valid()) {
            var url = "http://akhilram-cs571-webapp.elasticbeanstalk.com/search-ebay.php";
            var data = {
                "keywords": document.getElementById("inputKeyWords").value,
                "MinPrice": document.getElementById("minPrice").value,
                "MaxPrice": document.getElementById("maxPrice").value,
                "New": document.getElementById("new").checked ? "on" : "",
                "Used": document.getElementById("used").checked ? "on" : "",
                "Good": document.getElementById("good").checked ? "on" : "",
                "VeryGood": document.getElementById("veryGood").checked ? "on" : "",
                "Acceptable": document.getElementById("acceptable").checked ? "on" : "",

                "FixedPrice": document.getElementById("buyItNow").checked ? "on" : "",
                "Auction": document.getElementById("auction").checked ? "on" : "",
                "Classified": document.getElementById("classifiedAds").checked ? "on" : "",

                "ReturnsAcceptedOnly": document.getElementById("returnAccepted").checked ? "on" : "",

                "FreeShippingOnly": document.getElementById("freeShipping").checked ? "on" : "",
                "ExpeditedShippingType": document.getElementById("expeditedShipping").checked ? "on" : "",

                "MaxHandlingTime": document.getElementById("maxHandlingDays").value,

                "sortOrder": document.getElementById("sortOrder").options[document.getElementById("sortOrder").selectedIndex].value,
                "entriesPerPage": document.getElementById("resultsPerPage").options[document.getElementById("resultsPerPage").selectedIndex].value
                
            }
            $.ajax({    
                url: url,
                data: data,
                dataType : "json",
                type: 'GET',
                success: function(output) {
                    processData(output);
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

    function processData(output) {
        console.log(output["json"]);
    }

})(jQuery, window, document);
