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

// Include the City schema -- may not be needed now since things moved around
const City = require("./model/City.js");

// Include Mongo Functions
const { insertCity, updateCity } = require("./modules/insertCity.js");
const { listCities } = require("./modules/listCities.js");
const { findCity } = require("./modules/findCity.js");

// Include API function
const { fetchWeather } = require("./modules/fetchWeather.js");


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
    const { cityName, country, latitude, longitude, funThings, warnings, comments} = request.body; 
    // Try to update the content - if the find for city fails then we return false and go to insert
    if (!(await updateCity(cityName, country, latitude, longitude, funThings, warnings, comments))) {
        await insertCity(cityName, country, latitude, longitude, funThings, warnings, comments); 
    }
    response.render('addCityConfirmation', { cityName, country, latitiude, longitude, funThings, warnings, comments });  
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
                <td style="border: 1px solid black; padding: 2px;">${cit.cityName || "None"}</td>
                <td style="border: 1px solid black; padding: 2px;">${cit.latitiude || "None"}</td>
                <td style="border: 1px solid black; padding: 2px;">${cit.longitude || "None"}</td>
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
    if (result) {
        const lat = result.latitiude;
        const lon = result.longitude;
        const weatherReport = await fetchWeather(lat, lon); 
        response.render('viewCityResponse', { result, weatherReport });
    } else {
        response.render('viewCityResponseFailed', { name });
    }
});



/* Command line interpreter */
process.stdin.on('readable', () => {  
	let dataInput;
	while ((dataInput = process.stdin.read()) !== null) {
		const command = dataInput.toString().trim();
		if (command === "stop") {
            process.stdout.write("Disconnecting from database.\n"); 
            mongoose.disconnect()
            .then(()=> {
                process.stdout.write("Shutting down the server"); 
                process.exit(0);
            })
            .catch((err) => {
                console.error("Error during disconnection:", err);
                console.exit(1);
            })
        }  else {
			console.log(`Invalid command: ${command}`);
            process.stdout.write('Stop to shutdown the server: ');
		}
		process.stdin.resume(); 
    }
});

/* Start the server */
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log("Database connection secured.");
    app.listen(portNumber, () => {
        console.log(`Web server started and running at http://localhost:${portNumber}`);
        process.stdout.write('Stop to shutdown the server: ');
    });
})
.catch((err) => console.error(err))
