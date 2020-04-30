const R = require("ramda");
const Boom = require("boom");

const GameDB = require("../database/game");
const Middleware = require("./index");

module.exports = class GameMW extends Middleware {
  constructor(props) {
    super(props);
    // all active games by creators' user id
    this.games = {};
    // all user ids for each game id
    this.users = {};

    this.gameDb = new GameDB();
  }

  saveGame = (userId, gameId) => {
    // save creator's user id
    Object.assign(this.games, { [userId]: gameId });
    // enable game to join
    Object.assign(this.users, { [gameId]: [] });
  };

  addParticipant = (userId, gameId) => {
    const { users } = this;

    users[gameId] = users[gameId].concat(userId);
  };

  getGameId = (userId) => {
    return this.games[userId];
  };

  removeGame = (userId) => {
    const gameId = this.getGameId(userId);

    this.gameDb.remove(gameId);
    delete this.games[userId];
  };

  // send to all members in a group
  sendToGameMembers = (gameId, data) => {
    const { clients, users } = this;

    const json = JSON.stringify(data);

    users[gameId].forEach((userId) => {
      clients[userId].sendUTF(json);
    });
  };

  startGame = (gameId) => {
    const start = { started: true };

    this.sendToGameMembers(gameId, start);
  };

  restartGame = (gameId) => {
    const { gameDb } = this;

    const cards = gameDb.update(gameId);

    this.sendToGameMembers(gameId, { cards, type: "restart" });
  };

  createGame = (userId) => {
    const { gameDb } = this;

    const gameId = gameDb.create();
    const data = gameDb.find(gameId);

    this.saveGame(userId, gameId);
    this.addParticipant(userId, gameId);

    const response = R.mergeAll([data, { type: "create" }]);

    this.sendTo(userId, response);
  };

  joinGame = (userId, gameId) => {
    const { gameDb } = this;
    try {
      const data = gameDb.find(gameId);

      if (R.isNil(data)) {
        throw Boom.notFound("Game id: " + gameId + " not found");
      }
      const response = R.mergeAll([data, { type: "join" }]);

      this.addParticipant(userId, gameId);

      this.sendTo(userId, response);
    } catch (err) {
      const data = { type: "error", message: err.message };

      this.sendTo(userId, data);
    }
  };

  leaveGame = (userId, gameId) => {
    const { users } = this;
    if (!R.isNil(users[gameId])) {
      users[gameId] = users[gameId].filter((id) => id !== userId);
    }
    this.sendTo(userId, { type: "leave", gameId: "" });

    try {
      const isCreator = Object.keys(this.games).includes(userId);

      if (isCreator) {
        throw Boom.notFound("Creator of game id: " + gameId + " left");
      }
    } catch (err) {
      const data = { type: "error", message: err.message };

      this.sendToGameMembers(gameId, data);
    }
  };
};
