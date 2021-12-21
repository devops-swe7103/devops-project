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

// route management
app.get(`/`, (req, res) => {
  console.log(`GET: /`);
  // res.send(`GET: /`);
  res.render(`home`);
});

app.get(`/properties`, async (req, res) => {
  console.log(`GET: /properties`);
  const properties = await Property.find({});
  const agents = await Agent.find({});
  res.render(`properties/index`, { properties, agents });
});

// starting the server
app.listen(3000, () => {
  console.log(`Serving on port 3000`);
});
