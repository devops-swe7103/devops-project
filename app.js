const express = require("express");
const path = require(`path`);
const mongoose = require(`mongoose`);
const methodOverride = require("method-override");
const Property = require(`./models/property`);
const Agent = require(`./models/agent`);

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

// initialize app to express()
const app = express();

// setting ejs template engine and views base folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `views`));

// handling JSON and URL encoded form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE/PATCH
app.use(methodOverride("_method"));

// route management
app.get(`/`, (req, res) => {
  console.log(`GET: /`);
  // res.send(`GET: /`);
  res.render(`home`);
});

// property routes
app.get(`/properties`, async (req, res) => {
  console.log(`GET: /properties`);
  const properties = await Property.find({});
  const agents = await Agent.find({});
  res.render(`properties/index`, { properties, agents });
});

app.get(`/properties/add/`, (req, res) => {
  console.log(`GET: /properties/add`);
  // console.log(``)
  // res.send(`GET: /properties/add`);
  res.render(`properties/newPropertyForm`);
});
app.post(`/properties/add/`, async (req, res) => {
  console.log(`POST: /properties/add`);

  // console.log(`=== Recieved form data ===`);
  // processing the form submitted data to generate a property object
  const { generatePropertyFromForm } = require("./seeds/helpers");
  const newProperty = new Property({ ...generatePropertyFromForm(req.body) });

  // console.log(`=== Saving Property Data to MongoDB ===`);
  // adding new property to MongoDB
  await newProperty.save();
  // console.log(`=== Save Successful ===`);

  // console.log(`=== Redirecting to the newly added Property Page ===`);
  res.redirect(`/properties/${newProperty._id}/`);
});

app.get(`/properties/:id`, async (req, res) => {
  console.log(`GET: /properties/:id`);
  // const { id } = req.params;

  const property = await Property.findById(req.params.id);
  // // // console.log(`🚀 ✩ app.get ✩ property`, property);

  const agent = await Agent.findOne({ agentCode: property.agentCode });
  // // // console.log(`🚀 ✩ app.get ✩ agent`, agent);

  res.render(`properties/showProperty`, { property, agent });
});
app.put(`/properties/:id`, async (req, res) => {
  const { id } = req.params;
  console.log(`🚀 ✩ app.put ✩ id`, id);
  // const { id } = req.body;
  // console.log(`🚀 ✩ app.put ✩ id`, id);

  const updatedProperty = await Property.findByIdAndUpdate(
    { _id: id },
    { ...req.body }
  );
  console.log(`🚀 ✩ app.put ✩ updatedProperty`, updatedProperty);
  res.redirect(`/properties/${id}/`);
});

app.get(`/properties/:id/edit/`, async (req, res) => {
  const { id } = req.params;
  console.log(`GET: /properties/${id}/edit/`);

  // getting the property data from the DB
  const property = await Property.findById(id);
  // // console.log(`🚀 ✩ app.get ✩ property`, property);

  // res.send(`GET: /properties/${id}/edit/`);
  res.render(`properties/editPropertyForm`, { property });
});

// agent routes
app.get(`/agents`, async (req, res) => {
  console.log(`GET: /agents`);
  const agents = await Agent.find({});
  res.render(`agents/index`, { agents });
});

app.get(`/agents/:id`, async (req, res) => {
  console.log(`GET: /agents/:id`);
  const { id } = req.params;

  const agent = await Agent.findById(id);
  // // // console.log(`🚀 ✩ app.get ✩ agent`, agent);

  const properties = await Property.find({ agentCode: agent.agentCode });
  // // // console.log(`🚀 ✩ app.get ✩ properties`, properties);

  res.render(`agents/showAgent`, { agent, properties });
});

// starting the server
app.listen(3000, () => {
  console.log(`Serving on port 3000`);
});
