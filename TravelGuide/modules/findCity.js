async function findCity(cityName) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        let result = await City.find({ cityName: cityName });
        return result ? result : null;
   } catch (err) {
        console.error(err);
   } finally {
        await mongoose.disconnect(); 
    }
}

module.exports = { findCity };