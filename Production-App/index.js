const express = require("express");
const format = require("date-format");
const app = express();

// Swagger Docs Code
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //This is a middleware and will be discussed in detail later

const PORT = process.env.PORT || 4000; //PORT = 4000 if process.env.PORT doesn't exist

app.get("/", (req, res) => {
  //   res.send("<h1>Hello From Raghav</h1>");

  //This helps us to send a status as well ->
  //{Google HTTP Status codes to learn more!}
  //{Also, go through res.send in express documentation 4.x API}
  res.status(200).send("<h1>Hello from Raghav (Check Postman for Status)</h1>");
});

//For API 'v1' denotes the version-1 of API
//Also, Date.now() doesn't give the date in a good format and hence we installed 'date-format' package from NPM
app.get("/api/v1/instagram", (req, res) => {
  const instaInfo = {
    username: "raghavHere",
    followers: 100,
    follows: 300,
    date: format.asString("dd-MM-yyyy - hh:mm:ss", new Date()),
  };

  res.status(200).json(instaInfo); //For sending JSON Object, we use json instead of res.send
});

app.get("/api/v1/facebook", (req, res) => {
  const instaInfo = {
    username: "raghavHereOnFacebook",
    followers: 12,
    follows: 6,
    date: Date.now(),
  };

  res.status(200).json(instaInfo); //For sending JSON Object, we use json instead of res.send
});

app.get("/api/v1/linkedin", (req, res) => {
  const instaInfo = {
    username: "raghavHereOnLinkedin",
    followers: 16,
    follows: 30,
    date: Date.now(),
  };

  res.status(200).json(instaInfo); //For sending JSON Object, we use json instead of res.send
});

//Since the routes are matched in order, this will run in the end and hence won't interfere with the above routes
app.get("/api/v1/:token", (req, res) => {
  console.log(req.params.token);
  res.status(200).json({ param: req.params.token });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
