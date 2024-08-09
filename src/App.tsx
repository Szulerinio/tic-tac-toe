import { useState } from "react";
import { Game } from "./components/Game";
import { Button } from "./components/Button";
import styled from "styled-components";

function App() {
  const [size, setSize] = useState<number | null>(null);

  if (!size) {
    return (
      <GameSizeOpions>
        {Array.from(Array(12).keys()).map((size) => (
          <Button key={size} onClick={() => setSize(size + 2)}>{`${size + 2}x${
            size + 2
          }`}</Button>
        ))}
      </GameSizeOpions>
    );
  }

  return <Game size={size} goBack={() => setSize(null)}></Game>;
}

export default App;

const GameSizeOpions = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
});
