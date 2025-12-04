/* Imports */
const express = require("express");
const portNumber = 7000;
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
// Do not need this for deployment. May be used for local testing.
// require("dotenv").config({
//    path: path.resolve(__dirname, "credentialsDontPost/.env"),
// });
const { MongoClient, ServerApiVersion } = require("mongodb");

/* Setup some of the tools -- WILL NEED MORE*/
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
process.stdin.setEncoding("utf8"); /* encoding */

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
    response.render('addCityConfirmation');  
});

/* City List
    Create a table of the cities and render the page
    with that table variable */
app.get("/cityList", (request, response) => { 
    response.render('cityList');   
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




/* MONGOOSE GOES HERE */