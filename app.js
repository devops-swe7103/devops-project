const express = require("express");
const path = require(`path`);

const app = express();

app.get(`/`, (req, res) => {
  // res.send(`GET: /`);
  res.render(`home`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `views`));

app.listen(3000, () => {
  console.log(`Serving on port 3000`);
});
