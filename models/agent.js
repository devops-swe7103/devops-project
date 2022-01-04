const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const AgentsSchema = new Schema({
  agentCode: String,
  name: String,
  logo: String,
  address: String,
  phone: String,
  properties: [
    {
      type: Schema.Types.ObjectId,
      ref: `Property`,
    },
  ],
});

module.exports = mongoose.model(`Agent`, AgentsSchema);
