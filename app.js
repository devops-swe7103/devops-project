const express = require("express");
const path = require(`path`);
const mongoose = require(`mongoose`);
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
app.post(`/properties/add/`, (req, res) => {
  console.log(`POST: /properties/add`);
  console.log(`req.body: `, req.body);

  const { generatePropertyFromForm } = require("./seeds/helpers");
  // const { randMinMaxFloor, randArrEle, randMinMax, generatePropertyFromForm } = helperFunctions;

  console.log(generatePropertyFromForm(req.body));
  // res.render(`properties/newPropertyForm`);
});

app.get(`/properties/:id`, async (req, res) => {
  console.log(`GET: /properties/:id`);
  // const { id } = req.params;

  const property = await Property.findById(req.params.id);
  // console.log(`🚀 ✩ app.get ✩ property`, property);

  const agent = await Agent.findOne({ agentCode: property.agentCode });
  // console.log(`🚀 ✩ app.get ✩ agent`, agent);

  res.render(`properties/showProperty`, { property, agent });
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
  // console.log(`🚀 ✩ app.get ✩ agent`, agent);

  const properties = await Property.find({ agentCode: agent.agentCode });
  // console.log(`🚀 ✩ app.get ✩ properties`, properties);

  res.render(`agents/showAgent`, { agent, properties });
});

// starting the server
app.listen(3000, () => {
  console.log(`Serving on port 3000`);
});
