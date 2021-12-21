const mongoose = require(`mongoose`);
const Property = require(`../models/property`);
const Agent = require(`../models/agent`);
const { helperFunctions, totalProperties, totalAgents } = require(`./helpers`);

// connecting to the localhost mongodb server
mongoose.connect(`mongodb://localhost:27017/propertyApp`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// setting up mongoose to connect to mongodb
const db = mongoose.connection;
db.on(`error`, console.error.bind(console.log(`MongoDB connection error`)));
db.once(`open`, () => {
  console.log(`MongoDB connected`);
});

// clearing database before seeding
const seedDataToDB = async () => {
  // clear the property collection before adding any new property
  // console.log(`=== Deleting all data on DB ===`);
  await Property.deleteMany({});
  await Agent.deleteMany({});

  // generating properties
  for (let index = 0; index < totalProperties; index++) {
    console.log(`Generating Property ${index + 1}`);
    // using the helper function to generate a property
    // console.log(`=== CREATING A JS PROPERTY OBJECT ===`);
    const property = helperFunctions.generateProperty();
    // console.log(property);

    // create a new MongoDB Object containing property details
    // console.log(`=== CREATING A MONGO PROPERTY OBJECT ===`);
    const propertyMongoObject = new Property({ ...property });

    // save to Mongo
    // console.log(`=== BEGINNING DB DATA SAVE ===`);
    await propertyMongoObject.save();

    // console.log(`=== PROPERTY DATA SAVED ===`);
    // console.log(propertyMongoObject);
  }

  // generating agents
  for (let index = 0; index < totalAgents; index++) {
    console.log(`Generating Agent ${index + 1}`);

    // using the helper function to generate an agent
    // console.log(`=== CREATING A JS AGENT OBJECT ===`);
    const agent = helperFunctions.generateAgent(index + 1);
    // console.log(agent);

    // create a new MongoDB Object containing agent details
    // console.log(`=== CREATING A MONGO AGENT OBJECT ===`);
    const agentMongoObject = new Agent({ ...agent });

    // save to Mongo
    // console.log(`=== BEGINNING DB DATA SAVE ===`);
    await agentMongoObject.save();

    // console.log(`=== AGENT DATA SAVED ===`);
    // console.log(agentMongoObject);
  }
};

seedDataToDB();
