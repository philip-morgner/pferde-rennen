const R = require("ramda");
const Boom = require("boom");

const GameDB = require("../database/game");
const Middleware = require("./index");

module.exports = class GameMW extends Middleware {
  constructor(props) {
    super(props);
    // all active games by user id
    this.games = {};
    // all users for each game
    this.users = {};

    this.game = new GameDB();
  }

  getGameId = (userId) => {
    return this.games[userId];
  };

  removeGame = (userId) => {
    const gameId = this.getGameId(userId);

    this.game.remove(gameId);
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

  createGame = (userId) => {
    const { games, users, game } = this;

    const gameId = game.create();
    const data = game.find(gameId);

    games[userId] = gameId;
    users[gameId] = [].concat(userId);

    const response = R.mergeAll([data, { type: "create" }]);

    this.sendTo(userId, response);
  };

  joinGame = (userId, gameId) => {
    const { users, game } = this;
    try {
      const data = game.find(gameId);

      if (R.isNil(data)) {
        throw Boom.notFound("Game Id:" + gameId + " not found");
      }
      const response = R.mergeAll([data, { type: "join" }]);

      users[gameId].push(userId);

      this.sendTo(userId, response);
    } catch (err) {
      const data = { type: "error", message: err.message };

      this.sendTo(userId, data);
    }
  };
};
