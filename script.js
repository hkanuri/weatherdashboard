$(document).ready(function () {


    var searchTerm = $("#search_city");// need .val() upon search
    var cityName = $("#city_Name");
    var currentTemp = $("#temp");
    var currentHumidity = $("#humidity");
    var windSpeed = $("#wind_Speed");
    var uvIndex = $("#UV_index");
    var daysForecast = $("#forecast");
    var searchButton = $("#search_button");
    var currectPic = $("#current_pic");
    var cityList = $("#city_List");
    var searchValue = "";
    // api key and query URL

    var APIKey = "d351b3f4da2d1712fe6e7917c1a018d4";
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=dallas&appid=d351b3f4da2d1712fe6e7917c1a018d4";


    // on click function to get city name

    var cityarr = [];
    var cities = JSON.parse(localStorage.getItem("cityinput")) || [];

    for (var i = 0; i < cities.length; i++) {
        var cityPush = $("<button id= 'searchButton' >").text(cities[i]);
        cityList.append(cityPush);
    }
    //create a for loop to create a p tag for the cities entered. 
    // cityList.text(cities);

    //take the last item of the cityarr and look into pop() and display it on doc ready 
    //pass that name from the item you just grabbed into the functions...reassign searchValue to be the last item of that array
    function search(cityView) {
        searchValue = searchTerm.val();

        console.log(searchValue);


        cityarr.push(searchValue);
        console.log(cityarr);
        localStorage.setItem("cityinput", JSON.stringify(cityarr));

        fiveDayForecast(searchValue);
        currentWeather(searchValue);
    }


    searchButton.on("click", function (event) {
        event.preventDefault();

        search();



        // to get curret date, took reference from stack over flow. 

        // to get all current values


        //this refreshes the page
        // location.reload();
        //call both forecast and current weather 
    });

    function fiveDayForecast(searchValue) {
        // to get 5 day forecast from the city entered.

        var URL1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + APIKey;
        console.log(URL1);
        $.ajax({
            url: URL1,
            method: "GET"
        }).then(function (forecastResults) {
            console.log(forecastResults);
            $("#5day").empty();
            for (var i = 0; i < forecastResults.list.length; i++) {
                if (forecastResults.list[i].dt_txt.indexOf("15:00:00") !== -1) {


                    var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");

                    var date = new Date(forecastResults.list[i].dt_txt).toLocaleDateString();

                    var temp = Math.ceil(((forecastResults.list[i].main.temp - 273.15) * 1.8) + 32);

                    var hum = forecastResults.list[i].main.humidity;

                    var forecastPic = forecastResults.list[i].weather[0].icon;
                    // forecastPic.attr("src", "https://openweathermap.org/img/w/" + forecastPic + ".png");
                    // var dayPic


                    console.log("date here", date);
                    console.log("temperature", temp);
                    console.log("humidity", hum);
                    console.log("forecastpic", forecastPic);

                    var h5date = $("<h5 class='card-title'>").text(date);
                    var pTemp = $("<p class='card-text'>").text("Temp: " + temp + "F");;
                    var pHum = $("<p class='card-text'>").text("Humidity " + hum + "%");;

                    fiveDayDiv.append(h5date);
                    fiveDayDiv.append(forecastPic);
                    fiveDayDiv.append(pTemp);
                    fiveDayDiv.append(pHum);
                    $("#5day").append(fiveDayDiv);

                };

            }
        })
    }




    function currentWeather(searchValue) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response)

            currentHumidity = response.main.humidity;
            console.log("currenthum", currentHumidity);

            currentTemp = Math.ceil(((response.main.temp - 273.15) * 1.8) + 32); //to convert from kelvin
            console.log("currenttemp", currentTemp.toFixed(2));

            var weatherPic = response.weather[0].icon;
            console.log("currectpic", weatherPic);
            currectPic.attr("src", "https://openweathermap.org/img/w/" + weatherPic + ".png")

            windSpeed = response.wind.speed;
            console.log("currentwindspeed", windSpeed);

            $("#temp").html(currentTemp + " F");
            $("#current_pic").append(weatherPic);
            $("#humidity").html(currentHumidity + "%");
            $("#wind_speed").text(windSpeed + " MPH");
            $("#city_name").text(searchValue);

            // currentTemp.text("#temp");
            //$("#current").html(newDiv)
            //currentHumidity.append("#humidity");
            // windSpeed.appendTo("#wind_speed");

            var lat = response.coord.lat;
            var long = response.coord.lon;
            var LLUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + APIKey;
            // http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}
            console.log(LLUrl)
            console.log(lat);
            console.log(long);
            $.ajax({
                url: LLUrl,
                method: "GET"
            }).then(function (result) {
                console.log(result);
                var UV = result.value;
                console.log("currentUV", UV);
                $("#UV_index").text("UV Index: " + UV);
            })



        });

    }

    $(document).on("click", "#searchButton", function(event) {
        event.preventDefault();
        var cityView = $(this).text()
        console.log(cityView);
        fiveDayForecast(cityView);
        currentWeather(cityView);
    })



});


