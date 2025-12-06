/* Imports */
const express = require("express");
const portNumber = 7000;
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
// Do not need this for deployment. May be used for local testing.
// Used for both Mongo and Mongoose
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const mongoose = require("mongoose");

// Include the City schema
const City = require("./model/City.js");



/* Setup some of the tools -- WILL NEED MORE*/
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
process.stdin.setEncoding("utf8"); /* encoding */
/* Adds the CSS as a resource */
app.use(express.static('public'));

/* Ensure proper usage */
const args = process.argv.slice(2);
if (args.length !== 0) {
    console.log("Usage: travelGuideServer.js");
    process.exit(1);
} 

/* Control for the pages */
/* Home */
app.get("/", (request, response) => { 
    response.render('index');
});

/* City Add
    Form page to add city info */
app.get("/addCity", (request, response) => { 
    response.render('addCity');  
});

/* City Add Confirmation
    Take info from city add's form, echo the info,
    and use mongoose to add it to DB */
app.post("/addProcess", async (request, response) => { 
    const { name, lat, lon } = request.body; //add the other fields (and in ./model/City.js)
    await insertCity(name, lat, lon); //add the other fields (and in ./model/City.js)
    response.render('addCityConfirmation', { name, lat, lon });  //add the other fields (and in ./model/City.js)
});

/* City List
    Create a table of the cities and render the page
    with that table variable */
app.get("/cityList", async (request, response) => { 
    const arr = await listCities(); 
    let displayTable = `
        <table style="border: 2px solid black;">
            <tr>
                <th style="border: 1px solid black; padding: 2px;">City Name</th>
                <th style="border: 1px solid black; padding: 2px;">Latitude</th>
                <th style="border: 1px solid black; padding: 2px;">Longitude</th>
            </tr>
    `;

    for (const cit of arr) {
        displayTable += `
            <tr>
                <td style="border: 1px solid black; padding: 2px;">${cit.name || "None"}</td>
                <td style="border: 1px solid black; padding: 2px;">${cit.lat || "None"}</td>
                <td style="border: 1px solid black; padding: 2px;">${cit.lon || "None"}</td>
            </tr>
        `;
    }
    displayTable += `</table>`;
    response.render('cityList', { displayTable});   
});


/* Specific Info By City 
    Show a form to show a city*/
app.get("/cityInfo", (request, response) => { 
    response.render('viewCity');  
});

/* Info By City Post 
    Take info from city info's form and fetch from DB
    using mongoose, including an API call and displaying
    that information with the template using template vars*/
app.post("/infoProcess", async (request, response) => { 
    const { name } = request.body; 
    const result = await findCity(name);
    const weatherReport = await fetchWeather(lat, lon); //must define lat and lon from result
    response.render('viewCityResponse');  
});



/* Command line interpreter */
process.stdin.on('readable', () => {  
	let dataInput;
	while ((dataInput = process.stdin.read()) !== null) {
		const command = dataInput.toString().trim();
		if (command === "stop") {
			process.stdout.write("Shutting down the server"); 
            process.exit(0); 
        }  else {
			console.log(`Invalid command: ${command}`);
            process.stdout.write('Stop to shutdown the server: ');
		}
		process.stdin.resume(); 
    }
});

/* Start the server */
app.listen(portNumber, () => {
    console.log(`Web server started and running at http://localhost:${portNumber}`);
    process.stdout.write('Stop to shutdown the server: ');
});

/* Begin Mongoose */

/* Add a city */
async function insertCity(name, lat, lon) { //add the other fields (and in ./model/City.js)
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        await City.create({
            name: name,
            lat: lat,
            lon: lon
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect(); 
    }
}

/* Return cities */
async function listCities() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        let cities = await City.find({});
        return cities ? cities : null;
   } catch (err) {
        console.error(err);
   } finally {
        await mongoose.disconnect(); 
    }
}

/* Find a city */
async function findCity(name) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        let result = await City.find({ name: name });
        return result ? result : null;
   } catch (err) {
        console.error(err);
   } finally {
        await mongoose.disconnect(); 
    }
}

/* Find the weather report for a lat x lon */
async function fetchWeather(lat, lon) {
    /* Implement me. Make api call */
}