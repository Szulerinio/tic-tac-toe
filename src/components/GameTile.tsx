import circle from "../assets/circle.svg";
import cross from "../assets/cross.svg";
import circleWinner from "../assets/circleWinner.svg";
import crossWinner from "../assets/crossWinner.svg";
import styled from "styled-components";
import { GameTileValue } from "../utils/misc";

interface Props {
  element: GameTileValue;
  id: number;
  onClick: () => void;
  winner: GameTileValue;
}

export const GameTile = ({ element, id, onClick, winner }: Props) => {
  const isWinner = element == winner;
  return (
    <Container key={id} onClick={onClick}>
      {element !== "" ? (
        <Symbol
          src={
            !isWinner
              ? element == "X"
                ? cross
                : circle
              : element == "X"
              ? crossWinner
              : circleWinner
          }
          className="logo"
          alt={"X"}
        />
      ) : null}
    </Container>
  );
};

const Symbol = styled.img({
  height: "50%",
  userDrag: "none",
  userSelect: "none",
});

const Container = styled.div({
  aspectRatio: 1,
  background: "orange",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": { boxShadow: "0px 0px 5px 2px white" },
  transition: "box-shadow 0.3s",
});
