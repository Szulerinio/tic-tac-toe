import { useMachine } from "@xstate/react";
import styled from "styled-components";
import { oxoMachine } from "../oxoMachine";
import { GameTileValue } from "../utils/misc";
import { GameTile } from "./GameTile";
import { Button } from "./Button";

interface Props {
  size: number;
  goBack: () => void;
}

export function Game({ size = 3, goBack }: Props) {
  const [snapshot, send] = useMachine(oxoMachine, {
    input: { gridSize: size },
  });

  const mapWidth = snapshot.context.map.length;
  const currentPlayer = snapshot.context.currentPlayer;
  const winner =
    snapshot.value === "WonO" ? "O" : snapshot.value === "WonX" ? "X" : "";
  const makeMoveOn = (id: number) => {
    send({ type: "Played", value: id });
  };

  return (
    <>
      <GoBackButton onClick={goBack} title="Back to map size select">
        X
      </GoBackButton>
      {snapshot.value === "Idlee" ? (
        <Button onClick={() => send({ type: "Start" })}>START</Button>
      ) : snapshot.value === "WonX" ||
        snapshot.value === "WonO" ||
        snapshot.value === "Draw" ? (
        <Button onClick={() => send({ type: "Continue" })}>Continue</Button>
      ) : (
        <NoButtonSpacer />
      )}

      {winner ? (
        <Winner>Victorious player: {winner}</Winner>
      ) : (
        <CurrentPlayer>Current player: {currentPlayer}</CurrentPlayer>
      )}
      <Standings>
        <StandingsHeader>Standings</StandingsHeader>
        <StandingValue>O Wins: {snapshot.context.stats.o}</StandingValue>
        <StandingValue>Draws: {snapshot.context.stats.draw}</StandingValue>
        <StandingValue>X Wins: {snapshot.context.stats.x}</StandingValue>
      </Standings>
      <GameMap $mapWidth={mapWidth} $currentPlayer={currentPlayer}>
        {Array.from(Array(mapWidth * mapWidth).keys()).map((id) => {
          const row = Math.floor(id / mapWidth);
          const col = id - row * mapWidth;
          const element = snapshot.context.map[row][col];
          return (
            <GameTile
              key={id}
              element={element}
              winner={winner}
              id={id}
              onClick={() => makeMoveOn(id)}
            ></GameTile>
          );
        })}
      </GameMap>
    </>
  );
}

const GameMap = styled.div<{
  $mapWidth: number;
  $currentPlayer: GameTileValue;
}>(({ $mapWidth, $currentPlayer }) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${$mapWidth}, 1fr)`,
  gridTemplateRows: `repeat(${$mapWidth}, 1fr)`,
  gridGap: "5px",
  background: "black",
  minWidth: "150px",
  width: "min(75vw, 75vh)",
  minHeight: "150px",
  cursor: `url(${
    $currentPlayer == "X" ? "/src/assets/cross.svg" : "/src/assets/circle.svg"
  }) 10 10, auto`,
}));

const Standings = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
});

const StandingsHeader = styled.span({
  gridColumnStart: "1",
  gridColumnEnd: "4",
});

const StandingValue = styled.span({});

const CurrentPlayer = styled.p({});

const Winner = styled.p({});

const NoButtonSpacer = styled.div({
  height: "42px",
});

const GoBackButton = styled(Button)({
  display: "block",
});
