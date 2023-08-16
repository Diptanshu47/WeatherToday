const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine",'ejs');


app.get('/',function(req,res){
    res.render('main.ejs')
});


app.post('/',function(req,res){
    
    var location = req.body.search ;
    var URL="https://api.openweathermap.org/data/2.5/weather?appid=89cc4894da03988b0b6546acfecbc78f&q="+ location +"&units=metric";

    https.get(URL,function(response){
        response.on('data',function(data){
            var info = JSON.parse(data);

            /*****Checking status****/
            const check = info.cod;

            if(check === '404'){
                res.render('error.ejs');
            }else{
                    /***Informartion***/
                /****Date/day****/
                var today = new Date();
                var options={weekday : 'long',day : 'numeric',month : 'long'}            
                const date = today.toLocaleDateString('en-us',options);
                
                const location = info.name;

                const mainweather = info.weather[0].main;
                const descriptionweather = info.weather[0].description;

                /***Temperature***/
                const maintemp = info.main.temp;
                const feeltemp = info.main.feels_like;
                const mintemp = info.main.temp_min;
                const maxtemp = info.main.temp_max;
                const humidity = info.main.humidity;

                /****Image******/
                const weathericon = info.weather[0].icon;
                var imageUrl = 'https://openweathermap.org/img/wn/'+ weathericon +'@2x.png'

                res.render('result.ejs',{
                    location : location,
                    time : date,
                    weather : mainweather,
                    description : descriptionweather,
                    temp: maintemp,
                    feeltemp: feeltemp,
                    maxtemp: maxtemp,
                    mintemp: mintemp,
                    humidity: humidity,
                    image : imageUrl
                });
            }
        })
    });
});


app.listen(2000,function(){
    console.log('app is running on port 2000');
});