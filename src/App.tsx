import { assign, setup } from "xstate";
import { useMachine } from "@xstate/react";
import circle from "./assets/circle.svg";
import cross from "./assets/cross.svg";
import styled from "styled-components";
import { calcResultForSymbol } from "./utils/calcResult";

export type GameTileValue = "" | "X" | "O";
export type GameMap = GameTileValue[][];

const oxoMachine = setup({
  types: {
    events: {} as
      | { type: "Played"; value: number }
      | { type: "Continue" }
      | { type: "Start" },
    context: {} as {
      map: GameMap;
      lastStartingPlayer: GameTileValue;
      currentPlayer: GameTileValue;
      stats: { x: number; draw: number; o: number };
    },
  },
  actions: {
    makeMove: assign({
      map: ({ context, event }) => {
        const currentPlayer = context.currentPlayer;
        const newMap = [...context.map];
        if (event.type !== "Played") return newMap;
        const row = Math.floor(event.value / newMap.length);
        const col = event.value - row * newMap.length;
        newMap[row][col] = currentPlayer;
        return newMap;
      },
      currentPlayer: ({ context }) => {
        return context.currentPlayer == "X" ? "O" : "X";
      },
    }),
    cleanMap: assign({
      map: ({ context }) =>
        context.map.map((row) => row.map(() => "") satisfies GameTileValue[]),
      currentPlayer: ({ context }) =>
        context.lastStartingPlayer == "X" ? "O" : "X",
      lastStartingPlayer: ({ context }) =>
        context.lastStartingPlayer == "X" ? "O" : "X",
    }),
    addDraw: assign({
      stats: ({ context }) => ({
        ...context.stats,
        draw: context.stats.draw + 1,
      }),
    }),
    addWinX: assign({
      stats: ({ context }) => ({
        ...context.stats,
        x: context.stats.x + 1,
      }),
    }),
    addWinO: assign({
      stats: ({ context }) => ({
        ...context.stats,
        o: context.stats.o + 1,
      }),
    }),
  },
  guards: {
    isDrawn: function ({ context }) {
      return !context.map.some((row) => row.some((col) => col === ""));
    },
    isWonByX: function ({ context }) {
      const map = context.map;
      return calcResultForSymbol(map, "X");
    },
    isWonByO: function ({ context }) {
      const map = context.map;
      return calcResultForSymbol(map, "O");
    },
    isLegalMove: function ({ context, event }) {
      if (event.type !== "Played") return true;
      const row = Math.floor(event.value / context.map.length);
      const col = event.value - row * context.map.length;

      if (context.map[row][col] === "") return true;
      return false;
    },
  },
}).createMachine({
  context: {
    map: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    lastStartingPlayer: "X",
    currentPlayer: "O",
    stats: { x: 0, draw: 0, o: 0 },
  },
  id: "oxoMachine",
  initial: "Idlee",
  states: {
    Idlee: {
      entry: { type: "cleanMap" },
      on: {
        Start: [
          {
            target: "Move",
          },
        ],
      },
    },
    Move: {
      always: [
        {
          target: "WonX",
          guard: { type: "isWonByX" },
          actions: { type: "addWinX" },
        },
        {
          target: "WonO",
          guard: { type: "isWonByO" },
          actions: { type: "addWinO" },
        },
        {
          target: "Draw",
          guard: { type: "isDrawn" },
          actions: { type: "addDraw" },
        },
      ],
      on: {
        Played: [
          {
            guard: { type: "isLegalMove" },
            actions: { type: "makeMove" },
            target: "Move",
          },
        ],
      },
    },
    WonX: {
      on: {
        Continue: {
          target: "Idlee",
        },
      },
    },
    WonO: {
      on: {
        Continue: {
          target: "Idlee",
        },
      },
    },
    Draw: {
      on: {
        Continue: {
          target: "Idlee",
        },
      },
    },
  },
});

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
