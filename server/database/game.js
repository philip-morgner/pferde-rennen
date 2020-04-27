const R = require("ramda");
const Database = require("./index");
const shuffle = require("../shuffle");

class GameDB extends Database {
  constructor(props) {
    super(props);

    this.db.set("games", []).write();
    this.horses = ["clubs", "spades", "hearts", "diamonds"];
  }

  #get = () => {
    return this.db.get("games");
  };

  find = (gameId) => {
    const games = this.#get();

    return games.find({ gameId }).value();
  };

  create = () => {
    const cards = this.#prepareCards();
    const gameId = this.#getGameId();
    const games = this.#get();

    const game = { gameId, cards };

    games.push(game).write();

    return gameId;
  };

  remove = (gameId) => {
    const games = this.#get();

    games.remove({ gameId }).write();
  };

  #prepareCards = () => {
    let cards = [];
    this.horses.forEach((horse) => R.times(() => cards.push(horse), 12));

    return shuffle(cards);
  };

  #getGameId = () => Math.floor(Math.random() * 1000).toString();
}

module.exports = GameDB;
