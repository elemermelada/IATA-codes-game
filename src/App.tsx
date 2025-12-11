import React, { useCallback } from "react";
import "./App.css";
import { Game } from "./game";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { startGame, addAnswer, editCurrentAnswer } from "./game/gameSlice";
import { data } from "./airports/cleanData";
import { Leaderboard } from "./leaderboard";

function App() {
  const playing = useAppSelector((state) => state.game.playing);
  const gameState = useAppSelector((state) => state.game);
  const currentAnswer = gameState.answers[gameState.answers.length - 1];
  const dispatch = useAppDispatch();

  const submitAnswer = () => {
    if (!currentAnswer) return;
    if (currentAnswer.iataCode.length !== 3) return;
    const correctAirport = data.find(
      (airport) => airport.iata_code === currentAnswer.iataCode
    );
    if (!correctAirport) return;
    const isCorrect =
      correctAirport.municipality.toLowerCase() ===
      currentAnswer.municipality.toLowerCase();
    dispatch(editCurrentAnswer({ ...currentAnswer, isCorrect }));
    dispatch(addAnswer({ iataCode: "", municipality: "", isCorrect: false }));
  };

  const handleEnterPressed = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        playing ? submitAnswer() : dispatch(startGame());
      }
    },
    [playing, dispatch, currentAnswer]
  );

  return (
    <div id="eventRoot" className="App" onKeyDown={handleEnterPressed}>
      <header
        className="App-header"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        <Game />
        <Leaderboard />
      </header>
    </div>
  );
}

export default App;
