const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const notifier = require('node-notifier');
const app = express();

require('dotenv').config();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

/*
*    app.listen lets me tune my website to Port 3000
*    Whenever I want to view my website in a brower, I will now have to write localhost:3000
*    But I have to type "node server.js" in the command line before I get access to the port
*/

app.listen(3000, () => {
    console.log("Server 3000 is running");
});

// app.get allows us to communicate to the server

app.get('/', (req, res) => {
    const sendData = {location: "Location", temp: "Temp", desc: "Description", feel: "Feel-like", humidity: "Humidity", speed: "Speed"};
    res.render("index", {sendData: sendData});
});

// app.post allows us to control the response of what will happen after the user sumbits a message

app.post('/', async (req, res) => {
    try {
        let location = await req.body.city;
        let sendData = {
            "temp": "Temp",
            "desc": "Description",
            "location": "Location",
            "feel": "Feel-like",
            "humidity": "Humidity",
            "speed": "Speed"
        }
        const url = 'https://api.openweathermap.org/data/2.5/weather?q='+ location +'&appid='+process.env.APIKEY+'&units=metric';

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        weatherData = await fetch(url, requestOptions)
            .then(async response => {
                return response.json();
            })
            .catch(error => {
                console.error('has error here!', error);  
            });

        if (weatherData.cod === 200) {
            const temp = Math.floor(weatherData.main.temp);
            const desc = weatherData.weather[0].description;
            sendData.temp = temp;
            sendData.desc = desc;
            sendData.location = location;
            sendData.feel = weatherData.main.feels_like;
            sendData.humidity = weatherData.main.humidity;
            sendData.speed = weatherData.wind.speed;
        } else {
            notifier.notify({
                title: 'Error',
                message: weatherData.message,
                sound: true,
                wait: true
            });
        }
        res.render("index", {sendData: sendData});
    } catch (error) {
        notifier.notify({
            title: 'Error',
            message: error,
            sound: true,
            wait: true
        });
    }
});
