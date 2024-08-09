import { assign, setup } from "xstate";

import { calcResultForSymbol } from "./utils/calcResult";
import { GameMap, GameTileValue } from "./utils/misc";

export const oxoMachine = setup({
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
    input: {} as { gridSize: number },
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
  context: ({ input }) => {
    const map = Array(input.gridSize)
      .fill("")
      .map(() => Array<GameTileValue>(input.gridSize).fill(""));
    return {
      map: map,
      lastStartingPlayer: "X",
      currentPlayer: "O",
      stats: { x: 0, draw: 0, o: 0 },
    };
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
