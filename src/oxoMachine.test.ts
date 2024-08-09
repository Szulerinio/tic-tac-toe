import { describe, expect, test } from "vitest";
import { createActor } from "xstate";
import { oxoMachine } from "./oxoMachine"; // adjust this path to your actual file

describe("#oxoMachine", () => {
  test("machine starts with size of 3", () => {
    const actor = createActor(oxoMachine, { input: { gridSize: 3 } });
    actor.start();
    actor.send({ type: "Start" });
    expect(actor.getSnapshot().value).toBe("Move");
    expect(actor.getSnapshot().context.map.length).toBe(3);
  });

  test("machine starts with size of 4", () => {
    const actor = createActor(oxoMachine, { input: { gridSize: 4 } });
    actor.start();
    actor.send({ type: "Start" });
    expect(actor.getSnapshot().value).toBe("Move");
    expect(actor.getSnapshot().context.map.length).toBe(4);
  });

  test("machine works for a typical game", () => {
    const actor = createActor(oxoMachine, { input: { gridSize: 3 } });
    actor.start();
    actor.send({ type: "Start" });
    actor.send({ type: "Played", value: 0 });
    actor.send({ type: "Played", value: 2 });
    actor.send({ type: "Played", value: 3 });
    actor.send({ type: "Played", value: 5 });
    actor.send({ type: "Played", value: 6 });
    expect(actor.getSnapshot().value).toBe("WonO");

    actor.send({ type: "Continue" });
    expect(actor.getSnapshot().value).toBe("Idlee");

    actor.send({ type: "Start" });
    actor.send({ type: "Played", value: 0 });
    actor.send({ type: "Played", value: 3 });
    actor.send({ type: "Played", value: 1 });
    actor.send({ type: "Played", value: 5 });
    actor.send({ type: "Played", value: 2 });
    expect(actor.getSnapshot().value).toBe("WonX");
  });
});
