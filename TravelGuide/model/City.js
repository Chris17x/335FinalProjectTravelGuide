const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
   cityName: {
      type: String,
      required: true
   },
   country: {
      type: String,
      required: true
   },
   latitude: {
      type: Number,
      required: true
   },
   longitude: {
      type: Number,
      required: true
   },
   funThings: {
      type: String,
      required: false
   },
   warnings: {
      type: String,
      required: false
   },
   comments: {
      type: String,
      required: false
   },
});

const City = mongoose.model("City", citiesSchema);
module.exports = City;
