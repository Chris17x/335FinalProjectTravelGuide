/* Imports */
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const { MongoClient, ServerApiVersion } = require("mongodb");

/* Setup some of the tools -- WILL NEED MORE*/
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
process.stdin.setEncoding("utf8"); /* encoding */

/* Ensure one extra arg. Use 2 since node is 0 and app is 1
   We should probably exit if going further would yield errors */
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.log("Usage: travelGuideServer.js");
    process.exit(1);
} 

/* Control for the pages */
/* Home */
app.get("/", (request, response) => { 
    response.render('index');
});

/* City Add */
app.get("/", (request, response) => { 
    
});

/* City Add Confirmation */
app.post("/", async (request, response) => { 
     
});

/* City List */
app.get("/", (request, response) => { 
    
});

/* City List Post */
app.post("/", async (request, response) => { 
   
});

/* Specific Info By City */
app.get("/", (request, response) => { 

});

/* Info By City Post */
app.post("/", async (request, response) => { 
    
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