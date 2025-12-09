const City = require("../model/City.js");

async function findCity(cityName) {
    try {
        let result = await City.find({ cityName: cityName });
        return result ? result : null;
   } catch (err) {
        console.error(err);
   }
}

module.exports = { findCity };