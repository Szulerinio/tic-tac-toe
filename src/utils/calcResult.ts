import { GameMap, GameTileValue } from "../App";

export const calcResultForSymbol = (map: GameMap, symbol: GameTileValue) => {
  return (
    calcDiagonals(map, symbol) || calcRows(map, symbol) || calcCols(map, symbol)
  );
};

const calcDiagonals = (map: GameMap, symbol: GameTileValue) => {
  let winner = true;
  //diagonals
  for (let i = 0; i < map.length; i++) {
    if (map[i][i] !== symbol) {
      winner = false;
    }
  }
  if (winner) return true;

  //2nd diagonals
  winner = true;

  for (let i = 0; i < map.length; i++) {
    if (map[i][map.length - 1 - i] !== symbol) {
      winner = false;
    }
  }
  if (winner) return true;
  return false;
};

const calcRows = (map: GameMap, symbol: GameTileValue) => {
  let winner = true;
  for (let i = 0; i < map.length; i++) {
    winner = true;
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] !== symbol) {
        winner = false;
      }
    }
    if (winner) return true;
  }
  return false;
};

const calcCols = (map: GameMap, symbol: GameTileValue) => {
  let winner = true;
  for (let i = 0; i < map.length; i++) {
    winner = true;
    for (let j = 0; j < map.length; j++) {
      if (map[j][i] !== symbol) {
        winner = false;
      }
    }
    if (winner) return true;
  }
  return false;
};
