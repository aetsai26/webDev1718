var carsData=[];
            $(document).ready(function() {
                $.ajax({
                    url: "https://data.cityofchicago.org/resource/suj7-cg3j.json?$select=vehicle_make_model,COUNT(vehicle_make_model)&$group=vehicle_make_model",
                    success: function(result) {
                        var output = "";
                        $.each(result, function(index, value){
                            carsData.push({make: value.vehicle_make_model, num: parseInt(value.COUNT_vehicle_make_model)});
                        });
                        
                        //$("#results").html(output);
                    }
                })
                
            });