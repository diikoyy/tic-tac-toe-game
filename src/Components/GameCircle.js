import React from "react";
import "../Game.css";

const GameCircle = ({ id, children, onCircleClicked, className }) => {
  /* const clickMethod = (id) => {
    onCircleClicked(id);
  }; */

  return (
    <div
      className={`gameCircle ${className}`}
      // onClick={() => clickMethod(id)}
      onClick={() => onCircleClicked(id)}
    >
      {children}
    </div>
  );
};

export default GameCircle;
