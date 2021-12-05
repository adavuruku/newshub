require("dotenv").config();

const express = require("express");
const path = require("path");
const nconf = require("./config");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
const methodOverride = require("method-override");
// let errorHandler = require("errorhandler");
let errorHandler = require("./helpers/erors");
const bodyParser = require("body-parser");

let neo4jSessionCleanup = require("./middleware/neo4jSessionCleanup");
let writeError = require("./helpers/response").writeError;

const app = express();


app.use(methodOverride());
app.use(cookieParser());
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
app.use(neo4jSessionCleanup);

// //map the v1 routes
const v1Routes = require('./api/v1/index');
const AppError = require("./helpers/app-error");
app.use(nconf.get("api_path"), v1Routes)



//general error handle of new Error class error unhadle
app.use((req, res, next)=> {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
});
app.use('*',(req, res, next)=> {
    return next(new AppError('Not Found', 404))
});
//api error handler -> custom error thrown from the api
app.use(errorHandler)
app.use((err, req, res, next)=> {
    if (err && err.status) {
      writeError(res, err);
    } else next(err);
  });

module.exports = app;
