const https = require("https");
const http = require("http");
const fs = require("fs");
const webSocketServer = require("websocket").server;

const config = require("./config");
const GameMW = require("./middleware/game");

// secure websocket server setup
// const ssl_credentials = {
// key: fs.readFileSync(config.ssl.key),
// cert: fs.readFileSync(config.ssl.cert),
// };

// const server = https.createServer(ssl_credentials);

// server.listen(config.server.port, () =>
//   console.log("Server is listening on port: ", config.server.port)
// );

// const wsServer = new webSocketServer({
//   httpServer: server,
// });

const devServer = http.createServer();

devServer.listen(config.server.port, () =>
  console.log("Server is listening on port: ", config.server.port)
);

const devWsServer = new webSocketServer({
  httpServer: devServer,
});

// middleware
const mw = new GameMW();

// websocket
devWsServer.on("request", function (req) {
  console.log("Neue Verbindung von " + req.origin + ". Zeit: " + new Date());

  // rewrite this part of the code to accept only the requests from allowed origin
  const connection = req.accept(null, req.origin);
  const userId = mw.addClient(connection);
  console.log("User Id", userId, " assigned to", req.origin);

  //   on message
  connection.on("message", function (message) {
    console.log("message", message);
    try {
      if (message.type === "utf8") {
        const { type, gameId } = JSON.parse(message.utf8Data);

        if (type === "join") {
          mw.joinGame(userId, gameId);
        }
        if (type === "start") {
          mw.startGame(gameId);
        }
        if (type === "restart") {
          mw.restartGame(gameId);
        }
        if (type === "create") {
          mw.createGame(userId);
        }
        if (type === "leave") {
          mw.leaveGame(userId, gameId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  //   on close
  connection.on("close", function () {
    try {
      console.log(" User " + userId + " kann nicht mehr. Zeit: " + new Date());
      const json = "close";

      mw.removeGame(userId);
      mw.leave(userId);
      mw.broadcast(JSON.stringify(json));
    } catch (error) {
      console.error(error.message);
    }
  });
});
