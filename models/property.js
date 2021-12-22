const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const PropertiesSchema = new Schema({
  agentCode: String,
  title: String,
  type: String,
  rent: String,
  area: String,
  postcode: String,
  bedrooms: Number,
  bathrooms: Number,
  latitude: Number,
  longitude: Number,
  features: [String],
  description: String,
});

module.exports = mongoose.model(`Property`, PropertiesSchema);
