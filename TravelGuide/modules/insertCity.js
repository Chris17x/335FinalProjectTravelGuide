async function insertCity(cityName, country, latitude, longitude, funThings, warnings, comments) { 
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
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
    } finally {
        await mongoose.disconnect(); 
    }
}

async function updateCity(cityName_in, country_in, latitude_in, longitude_in, funThings_in, warnings_in, comments_in) { 
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
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
    } finally {
        await mongoose.disconnect(); 
    }
}

module.exports = { insertCity, updateCity };