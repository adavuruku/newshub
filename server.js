//create server object
const http = require('http');
const nconf = require("./config"),
const app = require('./app');
const port = nconf.get("PORT");

//create the server
const server = http.createServer(app);
// const WebSockets = require('./socketConnection');
// const socketio = require("socket.io")
// global.io = socketio(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       // allowedHeaders: ["my-custom-header"],
//       credentials: true,
//       transports: ['websocket', 'polling'],
//     },
//     allowEIO3: true
//   });
// global.io.on('connection', WebSockets.connection)

// server.listen(app.get("port"), () => {
//     console.log(
//       "Express server listening on port " + app.get("port") + " see docs at /docs"
//     );
// });
server.listen(port, () => {
    console.log(
      `Express server listening on port " + ${port} + " see docs at ${nconf.get("base_url")}/api/v1/docs`
    );
});


// var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','localhost'))



