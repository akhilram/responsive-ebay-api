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
                        min: 0,
                        number: true
                    },
                    maxPrice: {
                        min: 0,
                        number: true,
                        greaterThan: "minPrice"
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
                        greaterThan: "Price has to be greater than 'from price'"
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

            console.log(arguments);
            var i = parseFloat($("#minPrice").val());
            var j = parseFloat($("#maxPrice").val());
            var stat = (i<=j) ? true : false;
            console.log(stat);
            return stat;
        }
    );

    });
 
})(jQuery, window, document);
