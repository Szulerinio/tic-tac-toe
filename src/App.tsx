import "./App.css";
import { assign, setup } from "xstate";
import { useMachine } from "@xstate/react";
export const oxoMachine = setup({
  types: {
    events: {} as
      | { type: "Played"; value: number }
      | { type: "Continue" }
      | { type: "Start" },
    context: {} as { map: Readonly<Readonly<("" | "X" | "O")[]>[]> },
  },
  actions: {
    makeMove: assign({
      map: ({ context, event }, action) => {
        // if(event.type==="Played")
        const player = action?.player;
        console.log(action);
        console.log(event);
        console.table(context.map);
        const newMap = [...context.map];
        return newMap;
        return [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ] as const;
      },
    }),
  },
  guards: {
    isFinished: function ({ context }) {
      const map = context.map;
      let winnerX = true;
      let winnerO = true;
      //diagonals
      return true;
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
  },
  id: "oxoMachine",
  initial: "Idlee",
  states: {
    Idlee: {
      on: {
        Start: [
          {
            target: "MoveX",
            guard: {
              type: "lastStartedO",
            },
          },
          {
            target: "MoveO",
          },
        ],
      },
    },
    MoveX: {
      always: { target: "Finished", guard: { type: "isFinished" } },
      on: {
        Played: [
          {
            actions: { type: "makeMove", params: { player: "y" } },
            target: "MoveO",
          },
        ],
      },
    },
    MoveO: {
      always: { target: "Finished", guard: { type: "isFinished" } },
      on: {
        Played: [
          {
            actions: { type: "makeMove", params: { player: "o" } },
            target: "MoveX",
          },
        ],
      },
    },
    Finished: {
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

  const makeMoveOn = (id: number) => {
    send({ type: "Played", value: id });
  };

  return (
    <>
      <button onClick={() => send({ type: "Start" })}>START</button>
      <button onClick={() => send({ type: "Continue" })}>Continue</button>
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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
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
            {}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
