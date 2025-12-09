const City = require("../model/City.js");


async function listCities() {
    try {
        let cities = await City.find({});
        return cities ? cities : null;
   } catch (err) {
        console.error(err);
   } 
}

module.exports = { listCities };