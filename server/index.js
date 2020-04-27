const https = require("https");
const fs = require("fs");
const webSocketServer = require("websocket").server;
const express = require("express");
const cors = require("cors");

const config = require("./config");
const GameMW = require("./middleware/game");

const ssl_credentials = {
  key: fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert),
};

// db
const mw = new GameMW();

// express
const app = express();
app.use(cors());

// websocket setup
const server = https.createServer(ssl_credentials);
server.listen(config.server.port);

const wsServer = new webSocketServer({
  httpServer: server,
});

// websocket
wsServer.on("request", function (req) {
  console.log("Neue Verbindung von " + req.origin + ". Zeit: " + new Date());

  // rewrite this part of the code to accept only the requests from allowed origin
  const connection = req.accept(null, req.origin);
  const userId = mw.addClient(connection);
  console.log("User Id", userId);

  //   on message
  connection.on("message", function (message) {
    console.log("message", message);
    if (message.type === "utf8") {
      const clientData = JSON.parse(message.utf8Data);
      const { type, gameId } = clientData;
      console.log("clientData", clientData);

      if (type === "join") {
        mw.joinGame(userId, gameId);
      }
      if (type === "start") {
        mw.startGame(gameId);
      }
      if (type === "restart") {
        mw.removeGame(userId);
      }
      if (type === "create" || type === "restart") {
        mw.createGame(userId);
      }
    }
  });

  //   on close
  connection.on("close", function (connection) {
    console.log(" User " + userId + " kann nicht mehr. Zeit: " + new Date());
    const json = "close";
    mw.removeGame(userId);
    mw.leave(userId);
    mw.broadcast(JSON.stringify(json));
  });
});
