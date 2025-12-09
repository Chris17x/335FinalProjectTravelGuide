const City = require("../model/City.js");

async function insertCity(cityName, country, latitude, longitude, funThings, warnings, comments) { 
    try {
        await City.create({
            cityName: cityName,
            country: country,
            latitude: latitude,
            longitude: longitude,
            funThings: funThings,
            warnings: warnings,
            comments: comments
        });
    } catch (err) {
        console.error(err);
    } 
}

async function updateCity(cityName_in, country_in, latitude_in, longitude_in, funThings_in, warnings_in, comments_in) { 
    try {
        const filter = { cityName: cityName_in };
        let result = await City.find(filter);
        if (result) {
            let { cityName, country, latitude, longitude, funThings, warnings, comments } = result;
            funThings += "\n" + funThings_in;
            warnings += "\n" + warnings_in;
            comments += "\n" + comments_in;

            const update = { funThings: funThings, warnings: warnings, comments: comments };
            const options = { new:true };
           
            await City.findOneAndUpdate(filter, update, options);
        } else {
            return false;
        }
        
    } catch (err) {
        console.error(err);
    }
}

module.exports = { insertCity, updateCity };