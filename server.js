//create server object
const http = require('http');
const nconf = require("./config");
const app = require('./app');
const port = nconf.get("PORT");

//create the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(
      `Express server listening on ${nconf.get("base_url")} see docs at ${nconf.get("base_url")}/api/v1/docs`
    );
});


// var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','localhost'))



