import { css } from "emotion";

const hiddenColor = "#626567";
const shownColor = "#E5E7E9";

export const layout = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid black;
  margin: 32px;
  padding: 32px;
`;

export const raceTrack = css`
  display: grid;
  grid-template-rows: repeat(5, 1fr, [row-start]);
  grid-template-columns: repeat(7, 1fr, [col-start]);
`;

export const grid = (row, col) => css`
  grid-area: ${row} / ${col} / ${row + 1} / ${col + 1};
  width: 80px;
  height: 50px;
  border-right: ${col === 1 ? "2px dashed black" : null};
`;

export const sidecardStyle = (show, col) => css`
  grid-area: 1 / ${col + 2} / 2 / ${col + 3};
  background-color: ${show ? shownColor : hiddenColor};
  color: ${hiddenColor};
  height: 50px;
  width: 70px;
  border-radius: 5px;
`;
