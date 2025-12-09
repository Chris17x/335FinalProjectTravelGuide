async function listCities() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        let cities = await City.find({});
        return cities ? cities : null;
   } catch (err) {
        console.error(err);
   } finally {
        await mongoose.disconnect(); 
    }
}

module.exports = { listCities };