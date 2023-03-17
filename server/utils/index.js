const { repeat, flatten } = require("ramda");

const HORSES = ["clubs", "spades", "hearts", "diamonds"];
const COUNT = 12; // each horse appears 12 times in a deck of 52 cards

// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const shuffleCards = () => {
  const cards = flatten(HORSES.map((horse) => repeat(horse, COUNT)));

  return shuffle(cards);
};

module.exports = { shuffleCards };
