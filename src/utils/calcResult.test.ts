import { describe, expect, test } from "vitest";
import { calcResultForSymbol } from "./calcResult";
import { GameMap } from "./misc";

describe("#calcResult", () => {
  test("returns true for a diagonal win", () => {
    const map = [
      ["X", "O", "O"],
      ["O", "X", "O"],
      ["O", "O", "X"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(true);
  });

  test("returns true for a row win", () => {
    const map = [
      ["X", "X", "X"],
      ["O", "O", "X"],
      ["O", "X", "O"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(true);
  });

  test("returns true for a column win", () => {
    const map = [
      ["X", "O", "X"],
      ["X", "O", "O"],
      ["X", "X", "O"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(true);
  });

  test("returns false when there is no win", () => {
    const map = [
      ["X", "O", "X"],
      ["O", "X", "O"],
      ["O", "X", "O"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(false);
  });

  test("returns true for a diagonal win on a 4x4 map", () => {
    const map = [
      ["X", "O", "O", "O"],
      ["O", "X", "O", "O"],
      ["O", "O", "X", "O"],
      ["O", "O", "O", "X"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(true);
  });

  test("returns true for a row win on a 4x4 map", () => {
    const map = [
      ["X", "X", "X", "X"],
      ["O", "O", "X", "O"],
      ["O", "X", "O", "X"],
      ["X", "O", "O", "O"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(true);
  });

  test("returns true for a column win on a 4x4 map", () => {
    const map = [
      ["X", "O", "O", "O"],
      ["X", "O", "X", "O"],
      ["X", "O", "O", "X"],
      ["X", "X", "O", "O"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(true);
  });

  test("returns false when there is no win on a 4x4 map", () => {
    const map = [
      ["X", "O", "O", "X"],
      ["O", "X", "X", "O"],
      ["O", "O", "O", "X"],
      ["X", "O", "X", "O"],
    ] satisfies GameMap;
    expect(calcResultForSymbol(map, "X")).toBe(false);
  });
});
