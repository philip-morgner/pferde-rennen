import React from "react";
import { times, remove } from "ramda";
import {
  raceTrack,
  grid,
  sidecardStyle,
  buttonStyle,
  centeredStyle,
  gameLayout,
} from "./styles";
import shuffle from "./shuffle";
import { horses, raceTrackLength, symbols } from "./config";

const newGame = () => {
  let cards = [];
  horses.forEach((horse) => times(() => cards.push(horse), 12));

  return shuffle(cards);
};

const INITIAL_STATE = {
  horses: horses.reduce((obj, horse) => ({ ...obj, [horse]: 0 }), {}),
  shownSidecards: [],
  winner: false,
  intervalId: null,
  cards: newGame(),
  paused: true,
};

class Game extends React.Component {
  state = INITIAL_STATE;

  start = () => {
    const intervalId = setInterval(this.increaseRandomHorsePos, 500);

    this.setState({ intervalId });
  };

  end = () => {
    clearInterval(this.state.intervalId);
  };

  toggle = () => {
    const { paused } = this.state;
    if (paused) {
      this.start();
    } else {
      this.end();
    }
    this.setState((prevState) => ({ paused: !prevState.paused }));
  };

  restart = () => {
    clearInterval(this.state.intervalId);

    this.setState({ ...INITIAL_STATE });
  };

  pickRandomHorse = () => {
    const { cards } = this.state;
    const randomIndex = Math.floor(Math.random() * cards.length);
    const randomHorse = cards[randomIndex];
    const newCards = remove(randomIndex, 1, cards);

    this.setState({ cards: newCards });

    return randomHorse;
  };

  increaseRandomHorsePos = () => {
    const randomHorse = this.pickRandomHorse();

    this.update(randomHorse, 1);
  };

  update = (horse, n) => {
    this.setState(({ horses: prevStateHorses }) => {
      const pos = prevStateHorses[horse] + n;

      return {
        horses: {
          ...prevStateHorses,
          [horse]: pos,
        },
        winner: pos === raceTrackLength,
      };
    }, this.checkSidecard);
  };

  checkSidecard = () => {
    const { horses, shownSidecards } = this.state;
    const showSidecard = Object.values(horses).every(
      (horse) => horse > shownSidecards.length
    );

    if (showSidecard) {
      this.setState((prevState) => {
        const randomHorse = this.pickRandomHorse();
        const shownSidecards = prevState.shownSidecards.concat(randomHorse);

        return {
          shownSidecards,
          horses: {
            ...prevState.horses,
            [randomHorse]: prevState.horses[randomHorse] - 1,
          },
        };
      });
    }
  };

  renderSidecard = (i) => {
    const { shownSidecards } = this.state;
    const show = shownSidecards.length > i;
    let value = "hidden";

    if (show) {
      value = shownSidecards[i];
    }

    return (
      <div key={i} className={sidecardStyle(show, i)}>
        <img src={symbols[value]} alt={value} />
      </div>
    );
  };

  renderSidecards = () => {
    return times(this.renderSidecard, raceTrackLength - 1);
  };

  renderCell = (horse, row) => (col) => {
    const { horses } = this.state;

    return (
      <div key={`${row}-${col}`} className={grid(row + 2, col + 1)}>
        {horses[horse] === col ? (
          <img src={symbols[horse]} alt={horse} />
        ) : null}
      </div>
    );
  };

  renderLane = (horse, row) => {
    return times(this.renderCell(horse, row), raceTrackLength + 1);
  };

  renderRaceTrack = () => {
    return horses.map((horse, row) => this.renderLane(horse, row));
  };

  render() {
    const { winner, paused } = this.state;

    if (winner) {
      this.end();
    }

    return (
      <div className={gameLayout}>
        <div className={raceTrack}>
          {this.renderSidecards()}
          {this.renderRaceTrack()}
        </div>
        <div className={centeredStyle}>
          {winner ? (
            <button className={buttonStyle} onClick={this.restart}>
              Ausgangsposition
            </button>
          ) : (
            <button className={buttonStyle} onClick={this.toggle}>
              {paused ? "Start" : "Pause"}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Game;
