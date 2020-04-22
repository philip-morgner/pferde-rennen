const http = require("http");
const webSocketServer = require("websocket").server;
const express = require("express");
const cors = require("cors");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const times = require("ramda").times;

const { horses } = require("./config");
const shuffle = require("./shuffle");

// db
const adapter = new FileSync("db.json");
const db = lowdb(adapter);

db.defaults({ games: [] }).write();

// express
const app = express();
app.use(cors());

// websocket setup
const webSocketsServerPort = 8000;
const server = http.createServer(app);
server.listen(webSocketsServerPort);
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
  const fire = JSON.stringify({ started: true });
  Object.keys(users[gameId]).forEach((userId) => {
    clients[userId].sendUTF(fire);
  });
};

// server logic
const prepareCards = () => {
  let cards = [];
  horses.forEach((horse) => times(() => cards.push(horse), 12));

  return shuffle(cards);
};

const getGameId = () => Math.floor(Math.random() * 1000);

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
        console.log("join -> game found:", game.gameId, type);

        users[gameId].push(userId);
        // clients[userId].sendUTF(JSON.stringify(game));
        sendTo(userId, data);

        console.log("???? userId", userId);
      }
      if (type === "start") {
        startGame(gameId);

        console.log("start -> broadcasted");
      }
      if (type === "restart") {
        removeGame(gameId);
      }
      if (type === "create" || type === "restart") {
        const game = createGame(userId);
        const data = { ...game, type: "create" };

        console.log("userId", userId);
        console.log("create -> game", game);

        // clients[userId].sendUTF(JSON.stringify(game));
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
