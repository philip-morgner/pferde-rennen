import { css } from "emotion";
import { raceTrackLength } from "./config";

export const layout = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 16px;
  padding: 0 32px;
  max-width: ${raceTrackLength * 85}px;
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
  border-right: ${col === 1 || col === raceTrackLength
    ? "2px solid black"
    : null};
  border-top: ${row === 2 ? "2px solid black" : null};
  border-bottom: ${row === 5 ? "2px solid black" : "1px dashed grey"};
`;

export const sidecardStyle = (show, col) => css`
  grid-area: 1 / ${col + 2} / 2 / ${col + 3};
`;

export const buttonStyle = css({
  display: "flex",
  backgroundColor: "#F39C12",
  margin: "16px",
  padding: "8px 16px",
  border: "1px solid #F39C12",
  justifyContent: "center",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  width: "128px",
  height: "32px",
  ":disabled": {
    color: "white",
    backgroundColor: "#F8C471",
    border: "1px solid #F8C471",
  },
});

export const linksStyle = css({
  display: "flex",
  flexDirection: "column",
  fontSize: 8,
  marginTop: 128,
  "& a": { color: "grey" },
});

export const centeredStyle = css({
  display: "flex",
  justifyContent: "center",
});

export const gameLayout = css({
  paddingTop: 16,
});

export const titleStyle = css({
  margin: "28px auto",
});
