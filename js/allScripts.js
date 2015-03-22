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
                        
                    },
                    maxPrice: {
                        min: 0,
                        number: true,
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

    });
 
})(jQuery, window, document);
