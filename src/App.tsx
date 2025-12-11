import React, { useCallback } from "react";
import "./App.css";
import { Game } from "./game";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  startGame,
  addAnswer,
  editCurrentAnswer,
  Answer,
} from "./game/gameSlice";
import { data } from "./airports/cleanData";
import { Leaderboard } from "./leaderboard";

const answerIsValid = (answer: Answer) => {
  if (!answer) return false;
  if (answer.iataCode.length !== 3) return false;
  const correctAirport = data.find(
    (airport) => airport.iata_code === answer.iataCode
  );
  if (!correctAirport) return false;
  if (answer.municipality.trim() === "") return false;
  return true;
};

const answerIsCorrect = (answer: Answer) => {
  const correctAirport = data.find(
    (airport) => airport.iata_code === answer.iataCode
  ); // TODO - Should transform into a map of iata_code to airport for performance
  if (!correctAirport) return false;
  return (
    correctAirport.municipality.toLowerCase() ===
    answer.municipality.toLowerCase()
  );
};

function App() {
  const playing = useAppSelector((state) => state.game.playing);
  const gameState = useAppSelector((state) => state.game);
  const currentAnswer = gameState.answers[gameState.answers.length - 1];
  const dispatch = useAppDispatch();

  const submitAnswer = () => {
    if (!answerIsValid(currentAnswer)) return;
    const isCorrect = answerIsCorrect(currentAnswer);

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
