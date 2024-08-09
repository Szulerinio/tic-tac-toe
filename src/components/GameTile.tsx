import circle from "../assets/circle.svg";
import cross from "../assets/cross.svg";
import styled from "styled-components";
import { GameTileValue } from "../utils/misc";

interface Props {
  element: GameTileValue;
  id: number;
  onClick: () => void;
}
export const GameTile = ({ element, id, onClick }: Props) => {
  return (
    <Container key={id} onClick={onClick}>
      {element !== "" ? (
        <Symbol
          src={element == "X" ? cross : circle}
          className="logo"
          alt={element == "X" ? cross : circle}
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
