const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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

/*
*    app.get allows us to communicate to the server
*    By writing this piece of code, we tell the browser the location of the homepage
*/

app.get('/', (req, res) => {
    res.render("index");
});

/*
*    app.post allows us to control the response of what will happen after the user sumbits a message
*/


app.post('/', async (req, res) => {
    let location = await req.body.city;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+ location +'&appid=12e9dc1054ba8e41840b71053625bac5&units=metric';
    const response = await fetch(url);
    const weatherData = await response.json();
    const temp = Math.floor(weatherData.main.temp);
    const disc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imageUrl = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
    res.write("<h1>The current weather in "+location+" is "+ disc +"</h1>");
    res.write("<h1>The current temperature is "+temp+" degree celcius.</h1>");
    res.write("<img src='"+imageUrl+"'>");
});

