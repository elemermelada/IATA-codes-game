import { Answer as AnswerType, editCurrentAnswer, endGame } from "./gameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { data } from "../airports/cleanData";
import Select from "react-select";
import "./answer.css";
import { useEffect, useState } from "react";
import { addGameResult } from "../leaderboard/leaderboardSlice";

const municipalityList = Array.from(
  new Set(data.map((item) => item.municipality))
)
  .filter((m) => m && m.trim())
  .sort();

const municipalityOptions = municipalityList.map((m) => ({
  value: m,
  label: m,
}));

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              // Let react-select update value first
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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const gameState = useAppSelector((state) => state.game);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastAnswerTime) {
        const now = new Date();
        const elapsedTime = Math.floor((now.getTime() - lastAnswerTime) / 1000);
        const timeLeft = 60 - elapsedTime;
        if (timeLeft <= 0) {
          dispatch(addGameResult(gameState));
          dispatch(endGame());
        }
        setTimeLeft(timeLeft);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lastAnswerTime]);
  return <span>{timeLeft} seconds left</span>;
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
