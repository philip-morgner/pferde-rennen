import { times } from "ramda";

export const HORSES = ["kreuz", "pik", "herz", "karo"];

let shuffledCardDeck;

export const newGame = () => {
  let cardDeck = [];
  HORSES.forEach((horse) => times(() => cardDeck.push(horse), 12));
  console.log("boom");
  shuffledCardDeck = shuffle(cardDeck);
};

// initial setup of a shuffled card deck
newGame();

export const pickRandomHorse = () => {
  const randomCard = Math.floor(Math.random() * shuffledCardDeck.length);
  //   removes and returns 1 card from the array, destructive
  const randomHorse = shuffledCardDeck.splice(randomCard, 1);

  return randomHorse[0];
};

// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.

function shuffle(array) {
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
}

export const winnerNote = (winner) => {
  return (
    winner.charAt(0).toUpperCase() + winner.slice(1) + " gewinnt das Rennen!"
  );
};
