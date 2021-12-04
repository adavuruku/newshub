require("dotenv").config();

const express = require("express");
const path = require("path");
const nconf = require("./config");
// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
const methodOverride = require("method-override");
let errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const setAuthUser = require("./middlewares/setAuthUser");
let neo4jSessionCleanup = require("./middlewares/neo4jSessionCleanup");
let writeError = require("./helpers/response").writeError;

const app = express();


/*
var swaggerDefinition = {
  info: {
    title: "Neo4j Movie Demo API (Node/Express)",
    version: "1.0.0",
    description: "",
  },
  host: "localhost:3000",
  basePath: "/",
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['api/v1/index.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
*/

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler())
}
app.use(methodOverride());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});


// api custom middlewares
app.use(setAuthUser);
app.use(neo4jSessionCleanup);

//map the v1 routes
const v1Routes = require('./api/v1/index')
app.use(nconf.get("api_path"), v1Routes)

//api error handler
app.use((err, req, res, next)=> {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});


module.exports = app;
