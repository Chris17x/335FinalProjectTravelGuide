const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   lat: {
      type: Number,
      required: true
   },
   lon: {
      type: Number,
      required: true
   },
   extraFieldA: {
      type: String,
      required: true
   },
   extraFieldB: {
      type: String,
      required: true
   },
   extraFieldC: {
      type: String,
      required: true
   },
});

const City = mongoose.model("City", citiesSchema);
module.exports = City;
