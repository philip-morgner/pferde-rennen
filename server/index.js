const https = require("https");
const fs = require("fs");
const webSocketServer = require("websocket").server;
const express = require("express");
const cors = require("cors");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const times = require("ramda").times;

const shuffle = require("./shuffle");
const config = require("./config");

const ssl_credentials = {
  key: fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert),
};
// db
const adapter = new FileSync("db.json");
const db = lowdb(adapter);

db.defaults({ games: [] }).write();

// express
const app = express();
app.use(cors());

// websocket setup
const server = https.createServer(ssl_credentials);
server.listen(config.server.port);
const wsServer = new webSocketServer({
  httpServer: server,
});

// all active connections
const clients = {};
// all active games by user id
const games = {};
// all users for each game
const users = {};

// websocket logic
const getUniqueUserId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

const sendTo = (userId, data) => {
  const json = JSON.stringify(data);
  clients[userId].sendUTF(json);
};

const broadcast = (json) => {
  // send to all connected clients
  Object.keys(clients).forEach((client) => {
    clients[client].sendUTF(json);
  });
};

const startGame = (gameId) => {
  console.log("startGame -> gameId", gameId);
  const fire = JSON.stringify({ started: true });
  users[gameId].forEach((userId) => {
    clients[userId].sendUTF(fire);
  });
};

// server logic
const horses = ["clubs", "spades", "hearts", "diamonds"];

const prepareCards = () => {
  let cards = [];
  horses.forEach((horse) => times(() => cards.push(horse), 12));

  return shuffle(cards);
};

const getGameId = () => String(Math.floor(Math.random() * 1000));

const createGame = (userId) => {
  const cards = prepareCards();
  const gameId = getGameId();
  const game = { gameId, cards };

  db.get("games").push(game).write();

  games[userId] = gameId;
  users[gameId] = [].concat(userId);

  return game;
};

const findGame = (gameId) => {
  return db.get("games").find({ gameId }).value();
};

const removeGame = (gameId) => {
  db.get("games").remove({ gameId }).write();
};

// websocket
wsServer.on("request", function (req) {
  const userId = getUniqueUserId();
  console.log("Neue Verbindung von " + req.origin + ". Zeit: " + new Date());

  // rewrite this part of the code to accept only the requests from allowed origin
  const connection = req.accept(null, req.origin);
  clients[userId] = connection;
  console.log("User Id", userId);

  //   on message
  connection.on("message", function (message) {
    console.log("message", message);
    if (message.type === "utf8") {
      const clientData = JSON.parse(message.utf8Data);
      console.log("clientData", clientData);
      const { type, gameId } = clientData;

      if (type === "join") {
        const game = findGame(gameId);
        const data = { ...game, type };

        users[gameId].push(userId);

        sendTo(userId, data);
      }
      if (type === "start") {
        startGame(gameId);
      }
      if (type === "restart") {
        removeGame(gameId);
      }
      if (type === "create" || type === "restart") {
        const game = createGame(userId);
        const data = { ...game, type: "create" };

        sendTo(userId, data);
      }
    }
  });

  //   on close
  connection.on("close", function (connection) {
    console.log(" User " + userId + " kann nicht mehr. Zeit: " + new Date());
    const json = "close";
    const gameId = games[userId];
    removeGame(gameId);
    delete games[userId];
    delete clients[userId];
    broadcast(JSON.stringify(json));
  });
});
