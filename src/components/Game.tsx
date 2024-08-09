import { useMachine } from "@xstate/react";
import styled from "styled-components";
import { oxoMachine } from "../oxoMachine";
import { GameTileValue } from "../utils/misc";
import { GameTile } from "./GameTile";
export function Game() {
  const [snapshot, send] = useMachine(oxoMachine, { input: { gridSize: 3 } });
  const mapWidth = snapshot.context.map.length;
  const currentPlayer = snapshot.context.currentPlayer;
  const makeMoveOn = (id: number) => {
    send({ type: "Played", value: id });
  };

  return (
    <>
      {snapshot.value === "Idlee" ? (
        <Button onClick={() => send({ type: "Start" })}>START</Button>
      ) : null}
      {snapshot.value === "WonX" ||
      snapshot.value === "WonO" ||
      snapshot.value === "Draw" ? (
        <Button onClick={() => send({ type: "Continue" })}>Continue</Button>
      ) : null}
      <span>Current player: {currentPlayer}</span>
      <p>Stats:</p>
      <p>O:{snapshot.context.stats.o}</p>
      <p>Draws: {snapshot.context.stats.draw}</p>
      <p>X: {snapshot.context.stats.x}</p>
      <p>current state: {snapshot.value} </p>
      <GameMap mapWidth={mapWidth} currentPlayer={currentPlayer}>
        {Array.from(Array(mapWidth * mapWidth).keys()).map((id) => {
          const row = Math.floor(id / mapWidth);
          const col = id - row * mapWidth;
          const element = snapshot.context.map[row][col];
          return (
            <GameTile
              element={element}
              id={id}
              onClick={() => makeMoveOn(id)}
            ></GameTile>
          );
        })}
      </GameMap>
    </>
  );
}

const Button = styled.button({
  borderRadius: "8px",
  border: "1px solid transparent",
  padding: "0.6em 1.2em",
  fontSize: "1em",
  fontWeight: 500,
  fontFamily: "inherit",
  backgroundColor: "#1a1a1a",
  cursor: "pointer",
  transition: "border-color 0.25s",
  "&:hover": {
    borderColor: "#646cff",
  },
});

const GameMap = styled.div<{ mapWidth: number; currentPlayer: GameTileValue }>(
  ({ mapWidth, currentPlayer }) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${mapWidth}, 1fr)`,
    gridTemplateRows: `repeat(${mapWidth}, 1fr)`,
    gridGap: "5px",
    background: "black",
    minWidth: "600px",
    minHeight: "600px",
    cursor: `url(${
      currentPlayer == "X" ? "/src/assets/cross.svg" : "/src/assets/circle.svg"
    }) 10 10, auto`,
  })
);
