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

module.exports = { insertCity };