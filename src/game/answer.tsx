import { Answer as AnswerType, editCurrentAnswer } from "./gameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { data } from "../airports/cleanData";

const municipalityList = Array.from(
  new Set(data.map((item) => item.municipality))
).sort();

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
      style={{
        backgroundColor: editable ? "#444" : answer.isCorrect ? "green" : "red",
        margin: "10px",
        padding: "10px",
      }}
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
      <input
        type="text"
        value={answer.municipality}
        disabled={!editable}
        onChange={(e) =>
          updateAnswer({ ...answer, municipality: e.target.value })
        }
      />
    </div>
  );
};

export const AnswerContainer = () => {
  const answers: AnswerType[] = useAppSelector((state) => state.game.answers);
  const dispatch = useAppDispatch();
  return (
    <>
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
    </>
  );
};
