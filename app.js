const express = require("express");
const path = require(`path`);
const mongoose = require(`mongoose`);
const methodOverride = require("method-override");
const morgan = require(`morgan`);
const ejsMate = require(`ejs-mate`);

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

// using eja-mate engine
app.engine(`ejs`, ejsMate);
// setting ejs template engine and views base folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `views`));

// make /public accessible
const publicDirectoryPath = path.join(__dirname, "./assets");
app.use(express.static(publicDirectoryPath));

// handling JSON and URL encoded form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE/PATCH
app.use(methodOverride("_method"));
// using morgan to log request data
app.use(morgan(`dev`));

// route management
app.get(`/`, (req, res) => {
  res.render(`home`);
});

// property routes
app.get(`/properties`, async (req, res) => {
  const properties = await Property.find({});
  const agents = await Agent.find({});
  res.render(`properties/index`, { properties, agents });
});

app.get(`/properties/add/`, (req, res) => {
  // res.send(`GET: /properties/add`);
  res.render(`properties/newPropertyForm`);
});
app.post(`/properties/add/`, async (req, res) => {
  // processing the form submitted data to generate a property object
  const { generatePropertyFromForm } = require("./seeds/helpers");
  const newProperty = new Property({ ...generatePropertyFromForm(req.body) });

  await newProperty.save();
});

app.get(`/properties/:id`, async (req, res) => {
  const property = await Property.findById(req.params.id);

  const agent = await Agent.findOne({ agentCode: property.agentCode });

  res.render(`properties/showProperty`, { property, agent });
});
app.put(`/properties/:id`, async (req, res) => {
  const { id } = req.params;
  const updatedProperty = await Property.findByIdAndUpdate(
    { _id: id },
    { ...req.body }
  );
  res.redirect(`/properties/${id}/`);
});
app.delete(`/properties/:id`, async (req, res) => {
  console.log(`DELETE REQUEST`);
  const { id } = req.params;
  await Property.findByIdAndDelete(id);
  res.redirect(`/properties/`);
});

app.get(`/properties/:id/edit/`, async (req, res) => {
  const { id } = req.params;

  // getting the property data from the DB
  const property = await Property.findById(id);

  // res.send(`GET: /properties/${id}/edit/`);
  res.render(`properties/editPropertyForm`, { property });
});

// agent routes
app.get(`/agents`, async (req, res) => {
  const agents = await Agent.find({});
  res.render(`agents/index`, { agents });
});

app.get(`/agents/:id`, async (req, res) => {
  const { id } = req.params;

  const agent = await Agent.findById(id);

  const properties = await Property.find({ agentCode: agent.agentCode });

  res.render(`agents/showAgent`, { agent, properties });
});

// 404 route
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// starting the server
app.listen(3000, () => {
  console.log(`Serving on port 3000`);
});
