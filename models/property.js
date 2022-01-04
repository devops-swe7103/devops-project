const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const PropertiesSchema = new Schema({
  agentCode: String,
  title: String,
  image: String,
  type: String,
  rent: Number,
  area: String,
  city: String,
  postcode: String,
  bedrooms: Number,
  bathrooms: Number,
  latitude: Number,
  longitude: Number,
  features: [String],
  description: String,
  agentID: {
    type: Schema.Types.ObjectId,
    ref: `Agent`,
  },
});

module.exports = mongoose.model(`Property`, PropertiesSchema);
