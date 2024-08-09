import { useMachine } from "@xstate/react";
import circle from "./assets/circle.svg";
import cross from "./assets/cross.svg";
import styled from "styled-components";
import { oxoMachine } from "./oxoMachine";

function App() {
  const [snapshot, send] = useMachine(oxoMachine);
  const mapLength = snapshot.context.map.length;
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
      <span>Current player: {snapshot.context.currentPlayer}</span>
      <p>Stats:</p>
      <p>O:{snapshot.context.stats.o}</p>
      <p>Draws: {snapshot.context.stats.draw}</p>
      <p>X: {snapshot.context.stats.x}</p>
      <p>current state: {snapshot.value} </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gridGap: "5px",
          background: "black",
          width: "600px",
          height: "600px",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => {
          const row = Math.floor(id / mapLength);
          const col = id - row * mapLength;
          const element = snapshot.context.map[row][col];
          return (
            <div
              key={id}
              style={{
                background: "orange",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => makeMoveOn(id)}
            >
              {element == "" ? null : (
                <Symbol
                  src={element == "X" ? cross : circle}
                  className="logo"
                  alt={element == "X" ? cross : circle}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

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

const Symbol = styled.img({
  height: "6em",
  userDrag: "none",
  userSelect: "none",
});
