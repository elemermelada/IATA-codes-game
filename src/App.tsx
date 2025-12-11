import React from "react";
import "./App.css";
import { Game } from "./game";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { addAnswer } from "./game/gameSlice";

function App() {
  const playing = useAppSelector((state) => state.game.playing);
  const dispatch = useAppDispatch();

  const submitAnswer = () => {
    dispatch(addAnswer({ iataCode: "", cityName: "", isCorrect: false }));
  };

  const handleEnterPressed = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      playing ? submitAnswer() : submitAnswer();
    }
  };

  return (
    <div className="App" onKeyDown={handleEnterPressed}>
      <header className="App-header">
        <Game />
      </header>
    </div>
  );
}

export default App;
