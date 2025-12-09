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
        let result = await City.findOne(filter);
        if (result) {
            const update = { 
                funThings: result.funThings ? `${result.funThings}\n${funThings_in}` : funThings_in, 
                warnings: result.warnings ? `${result.warnings}\n${warnings_in}` : warnings_in, 
                comments: result.comments ?  `${result.comments}\n${comments_in}` : comments_in, 
                country: country_in || result.country,
                latitude: latitude_in || result.latitude,
                longitude: longitude_in || result.longitude
            };
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