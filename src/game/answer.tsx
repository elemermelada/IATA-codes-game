import { Answer as AnswerType, editCurrentAnswer, endGame } from "./gameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { data } from "../airports/cleanData";
import Select from "react-select";
import "./answer.css";
import { useEffect, useState } from "react";
import {
  updateLeaderboard,
  convertGameStateToPlayerScore,
} from "../leaderboard/leaderboardSlice";
import { getLeaderBoard, saveGameResult } from "../leaderboard/api";

const municipalityList = Array.from(
  new Set(data.map((item) => item.municipality))
)
  .filter((m) => m && m.trim())
  .sort();

const municipalityOptions = municipalityList.map((m) => ({
  value: m,
  label: m,
}));

// TODO - move this
const colourStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: "#fff",
    color: "#222",
    borderRadius: "6px",
    borderColor: "#888",
    fontSize: "1.2rem",
    boxShadow: "none",
    minHeight: "40px",
  }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: "#f8f8f8",
    color: "#222",
    borderRadius: "6px",
    borderColor: "#888",
    fontSize: "1.2rem",
    zIndex: 10,
  }),
  option: (
    styles: any,
    { isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }
  ) => ({
    ...styles,
    backgroundColor: isSelected ? "#007bff" : isFocused ? "#e0e0e0" : "#f8f8f8",
    color: isSelected ? "#fff" : "#222",
    fontSize: "1.2rem",
    padding: "12px 16px",
    cursor: "pointer",
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: "#222",
    fontSize: "1.2rem",
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: "#888",
    fontSize: "1.2rem",
  }),
};

const Answer = ({
  answer,
  updateAnswer,
  editable,
}: {
  answer: AnswerType;
  updateAnswer: (answer: AnswerType) => void;
  editable: boolean;
}) => {
  return (
    <div
      className={`answer-row${
        editable ? " editable" : answer.isCorrect ? " correct" : " incorrect"
      }`}
    >
      Airport:{" "}
      <input
        type="text"
        value={answer.iataCode}
        disabled={!editable}
        onChange={(e) =>
          updateAnswer({
            ...answer,
            iataCode: e.target.value.toUpperCase().slice(0, 3),
          })
        }
        autoFocus
      />{" "}
      City:{" "}
      <div style={{ display: "inline-block", minWidth: 200 }}>
        <Select
          options={municipalityOptions}
          value={
            answer.municipality
              ? { value: answer.municipality, label: answer.municipality }
              : null
          }
          onChange={(selected) =>
            updateAnswer({
              ...answer,
              municipality: selected ? selected.value : "",
            })
          }
          isDisabled={!editable}
          isSearchable
          placeholder="Select city..."
          styles={colourStyles}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // We let the select save the selected value first
              e.stopPropagation();
              // Now we trigger the global enter handler
              setTimeout(() => {
                const root = document.getElementById("eventRoot");
                if (root) {
                  const evt = new KeyboardEvent("keydown", {
                    key: "Enter",
                    bubbles: true,
                  });
                  root.dispatchEvent(evt);
                }
              }, 0);
            }
          }}
        />
      </div>
    </div>
  );
};

const AnswerClock = ({ lastAnswerTime }: { lastAnswerTime: number }) => {
  const dispatch = useAppDispatch();
  const saveAndEnd = async () => {
    const playerScore = convertGameStateToPlayerScore(gameState);
    await saveGameResult(playerScore);
    const newLeaderboard = await getLeaderBoard();
    dispatch(updateLeaderboard(newLeaderboard));
    dispatch(endGame());
  };
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const gameState = useAppSelector((state) => state.game);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastAnswerTime) {
        const now = new Date();
        const elapsedTime = Math.floor((now.getTime() - lastAnswerTime) / 1000);
        const timeLeft = 60 - elapsedTime;
        if (timeLeft <= 0) {
          saveAndEnd();
        }
        setTimeLeft(timeLeft);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lastAnswerTime]);
  return (
    <span>
      {timeLeft} seconds left <button onClick={saveAndEnd}>End Now</button>
    </span>
  );
};

export const AnswerContainer = () => {
  const answers: AnswerType[] = useAppSelector((state) => state.game.answers);
  const timeOfLastCorrectAnswer: number = useAppSelector(
    (state) => state.game.timeOfLastCorrectAnswer
  );
  const dispatch = useAppDispatch();
  return (
    <div>
      <AnswerClock lastAnswerTime={timeOfLastCorrectAnswer} />
      <div className="custom-scrollbar answer-container">
        {answers.map((ans, index) => {
          return (
            <Answer
              key={index}
              answer={ans}
              updateAnswer={(newAnswer) => {
                dispatch(editCurrentAnswer(newAnswer));
              }}
              editable={index === answers.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};
