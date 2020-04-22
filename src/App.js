import React from "react";
import { layout, titleStyle, linksStyle } from "./styles";
import Game from "./Game";

class App extends React.Component {
  render() {
    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        <Game />
        <div className={linksStyle}>
          Icons:
          <a href="https://icons8.com/icon/39707/joker">Joker icon by Icons8</a>
          <a href="https://icons8.com/icon/24740/ace-of-clubs">
            Ace of Clubs icon by Icons8
          </a>
          <a href="https://icons8.com/icon/39682/ace-of-spades">
            Ace of Spades icon by Icons8
          </a>
          <a href="https://icons8.com/icon/39679/ace-of-hearts">
            Ace of Hearts icon by Icons8
          </a>
          <a href="https://icons8.com/icon/39677/ace-of-diamonds">
            Ace of Diamonds icon by Icons8
          </a>
        </div>
      </div>
    );
  }
}

export default App;
