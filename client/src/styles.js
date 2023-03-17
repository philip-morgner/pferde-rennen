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
  justify-self: center;
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

  border: "1px solid #F39C12",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  marginTop: "16px",
  width: "128px",
  height: "32px",
  color: "white",
  cursor: "pointer",
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
  justifyContent: "space-between",
});

export const gameLayout = css({
  paddingTop: 16,
});

export const titleStyle = css({
  margin: "28px auto",
});

export const buttonInputGroup = css({
  display: "flex",
  justifyContent: "center",
  height: "32px",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  margin: "15% auto",
  width: "fit-content",
  "& input": {
    paddingLeft: 10,
    fontSize: "55%",
  },
  "& button": {
    // remove box shadow
    boxShadow: "0px 0px rgba(0, 0, 0, 0.2) !important",
    // remove margin top
    marginTop: "0px !important",
  },
  "& button:first-of-type": {
    borderRight: "1px solid #FDFEFE",
  },
});

export const errorStyle = (hasError) =>
  css(
    hasError && {
      border: "1px solid #E74C3C",
      "&::placeholder": {
        color: "#E74C3C",
        opacity: 1,
      },
    }
  );
