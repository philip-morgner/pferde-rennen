const R = require("ramda");
const Database = require("./index");
const shuffle = require("../shuffle");

export default class GameDB extends Database {
  constructor(props) {
    super(props);

    this.db.set("games", []).write();
    this.horses = ["clubs", "spades", "hearts", "diamonds"];
  }

  find(gameId) {
    return this.db.get("games").find({ gameId }).value();
  }

  create() {
    const cards = this.prepareCards();
    const gameId = this.getGameId();

    const game = { gameId, cards };

    this.db.get("games").push(game).write();

    return gameId;
  }

  update(gameId) {
    const cards = this.prepareCards();

    this.db.get("games").find({ gameId }).assign({ cards }).write();

    return cards;
  }

  remove(gameId) {
    this.db.get("games").remove({ gameId }).write();
  }

  prepareCards() {
    let cards = [];
    this.horses.forEach((horse) => R.times(() => cards.push(horse), 12));

    return shuffle(cards);
  }

  getGameId() {
    return Math.floor(Math.random() * 1000).toString();
  }
}
