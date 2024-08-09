import "./App.css";
import { assign, setup } from "xstate";
import { useMachine } from "@xstate/react";
import circle from "./assets/circle.svg";
import cross from "./assets/cross.svg";

type GameTileValue = "" | "X" | "O";
type GameMap = GameTileValue[][];

export const oxoMachine = setup({
  types: {
    events: {} as
      | { type: "Played"; value: number }
      | { type: "Continue" }
      | { type: "Start" },
    context: {} as {
      map: GameMap;
      currentPlayer: GameTileValue;
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
      map: ({ context }) => {
        return context.map.map(
          (row) => row.map(() => "") satisfies GameTileValue[]
        );
      },
    }),
  },
  guards: {
    isDrawn: function ({ context }) {
      return !context.map.some((row) => row.some((col) => col === ""));
    },
    isWon: function ({ context }) {
      const map = context.map;
      let winnerX = true;
      let winnerO = true;
      //diagonals
      for (let i = 0; i < map.length; i++) {
        if (map[i][i] !== "X") {
          winnerX = false;
        }
        if (map[i][i] !== "O") {
          winnerO = false;
        }
      }
      if (winnerX) return true;
      if (winnerO) return true;

      //2nd diagonals
      winnerX = true;
      winnerO = true;

      for (let i = 0; i < map.length; i++) {
        if (map[i][map.length - 1 - i] !== "X") {
          winnerX = false;
        }
        if (map[i][map.length - 1 - i] !== "O") {
          winnerO = false;
        }
      }
      if (winnerX) return true;
      if (winnerO) return true;

      //rows
      for (let i = 0; i < map.length; i++) {
        winnerO = true;
        winnerX = true;
        for (let j = 0; j < map.length; j++) {
          if (map[i][j] !== "X") {
            winnerX = false;
          }
          if (map[i][j] !== "O") {
            winnerO = false;
          }
        }
        if (winnerX) return true;
        if (winnerO) return true;
      }

      //columns
      for (let i = 0; i < map.length; i++) {
        winnerO = true;
        winnerX = true;
        for (let j = 0; j < map.length; j++) {
          if (map[j][i] !== "X") {
            winnerX = false;
          }
          if (map[j][i] !== "O") {
            winnerO = false;
          }
        }
        if (winnerX) return true;
        if (winnerO) return true;
      }
      return false;
    },
    isLegalMove: function ({ context, event }) {
      if (event.type !== "Played") return true;
      const row = Math.floor(event.value / context.map.length);
      const col = event.value - row * context.map.length;

      if (context.map[row][col] === "") return true;
      return false;
    },
    lastStartedO: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
  },
}).createMachine({
  context: {
    map: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
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
        { target: "Won", guard: { type: "isWon" } },
        { target: "Draw", guard: { type: "isDrawn" } },
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
    Won: {
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
        <button onClick={() => send({ type: "Start" })}>START</button>
      ) : null}
      {snapshot.value === "Won" || snapshot.value === "Draw" ? (
        <button onClick={() => send({ type: "Continue" })}>Continue</button>
      ) : null}
      <span>{JSON.stringify(snapshot)}</span>
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
                <img
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
