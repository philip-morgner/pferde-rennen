const {
  mergeAll,
  isNil,
  isEmpty,
  pathOr,
  propOr,
  dissoc,
  find,
  propEq,
} = require("ramda");

const { shuffleCards } = require("../utils");
const ClientMiddleware = require("./index");

class Game {
  constructor(creatorId) {
    this.creatorId = creatorId;
    this.gameId = Math.floor(Math.random() * 1000).toString();
    this.cards = shuffleCards();
    this.members = [creatorId];
  }

  addMember(memberId) {
    this.members = this.members.concat(memberId);
  }

  removeMember(memberId) {
    this.members = this.members.filter((id) => id !== memberId);
  }

  reshuffle() {
    this.cards = shuffleCards();
  }
}

module.exports = class GameMiddleware extends ClientMiddleware {
  constructor(props) {
    super(props);

    this.games = [];
  }

  checkDuplicate = (id) => this.games.some((game) => game.gameId === id);

  createGameWithUniqueGameId = (userId) => {
    let newGame = new Game(userId);
    let isDuplicate = this.checkDuplicate(newGame.gameId);
    while (isDuplicate) {
      newGame = new Game(userId);
      isDuplicate = this.checkDuplicate(newGame.gameId);
    }

    return newGame;
  };

  createGame(userId) {
    try {
      const newGame = this.createGameWithUniqueGameId(userId);

      this.games = this.games.concat(newGame);

      const { gameId, cards } = newGame;

      const response = mergeAll([{ gameId, cards }, { type: "create" }]);

      this.sendTo(userId, response);
    } catch (error) {
      console.log("Error creating game.", error.message);
    }
  }

  addParticipant(userId, gameId) {
    try {
      console.log("Adding participant to game with gameId", gameId);
      if (isNil(userId) || isNil(gameId)) {
        throw new Error(
          `Undefined Parameter: userId: '${userId}', gameId: '${gameId}'`
        );
      }
      const game = find(propEq("gameId", gameId))(this.games);

      if (isNil(game)) {
        throw new Error(`Game not found. Provided gameId: '${gameId}'`);
      }

      game.addMember(userId);
    } catch (error) {
      console.log(
        `Error. Could not add participant with userId ${userId}`,
        error.message
      );
    }
  }

  removeGame(userId) {
    try {
      if (isNil(userId)) {
        throw new Error("Provided userId is undefined.");
      }
      console.log("Removing game created by player with  userId", userId);

      this.games = this.games.filter(({ creatorId }) => creatorId !== userId);
    } catch (error) {
      console.log("Error removing game", error.message);
    }
  }

  // send to all members in a group
  sendToGameMembers(gameId, data) {
    try {
      if (isNil(gameId) || isNil(data)) {
        throw new Error(
          `Undefined Parameter: gameId: '${gameId}', data: '${data}'`
        );
      }

      const json = JSON.stringify(data);

      const game = find(propEq("gameId", gameId))(this.games);

      if (isNil(game)) {
        throw new Error("Could not find game with gameId", gameId);
      }

      const members = game.members;

      members.forEach((userId) => {
        const client = pathOr({}, ["clients", userId], this);

        if (isEmpty(client)) {
          throw new Error("Could not find client with userId", userId);
        }

        client.sendUTF(json);
      });
    } catch (error) {
      console.log("Error at sendToGameMembers", error.message);
    }
  }

  startGame(gameId) {
    try {
      const start = { started: true };

      this.sendToGameMembers(gameId, start);
    } catch (error) {
      console.log("Error starting game.", error.message);
    }
  }

  restartGame(gameId) {
    try {
      const game = find(propEq("gameId", gameId))(this.games);

      if (isNil(game)) {
        throw new Error("Could not find game with gameId", gameId);
      }

      game.reshuffle();
      const cards = game.cards;

      this.sendToGameMembers(gameId, { cards, type: "restart" });
    } catch (error) {
      console.log("Error restarting game.", error.message);
    }
  }

  joinGame(userId, gameId) {
    try {
      if (isNil(userId) || isNil(gameId)) {
        throw new Error(
          `Undefined Parameter: gameId: '${gameId}', data: '${data}'`
        );
      }

      const game = find(propEq("gameId", gameId))(this.games);

      if (isNil(game)) {
        throw new Error("Could not find game with gameId", gameId);
      }

      const data = { gameId, cards: game.cards };

      const response = mergeAll([data, { type: "join" }]);

      this.addParticipant(userId, gameId);

      this.sendTo(userId, response);
    } catch (error) {
      console.log("Error joining game", error.message);
      const data = { type: "error", message: error.message };

      this.sendTo(userId, data);
    }
  }

  leaveGame(userId, gameId) {
    try {
      console.log("Leaving game with gameId", gameId);
      if (isNil(userId) || isNil(gameId)) {
        throw new Error(
          `Undefined Parameter: userId: '${userId}', gameId: '${gameId}'`
        );
      }

      const game = find(propEq("gameId", gameId))(this.games);

      if (isNil(game)) {
        throw new Error("Could not find game with gameId", gameId);
      }

      if (userId === game.creatorId) {
        const data = {
          type: "error",
          message: gameId + ": Game creator left",
        };
        // notify other players about removed game
        this.sendToGameMembers(gameId, data);

        // remove game
        this.removeGame(userId);
      } else {
        game.removeMember(userId);
      }

      // remove player from game
      this.sendTo(userId, { type: "leave", gameId: "" });
    } catch (error) {
      console.log("Error leaving game", error.message);
    }
  }
};
