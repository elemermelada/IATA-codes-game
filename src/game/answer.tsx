import { Answer as AnswerType, editAnswer } from "./gameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

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
    <div>
      Airport:{" "}
      <input
        type="text"
        value={answer.iataCode}
        onChange={(e) =>
          updateAnswer({
            ...answer,
            iataCode: e.target.value.toUpperCase().slice(0, 3),
          })
        }
      />{" "}
      City:{" "}
      <input
        type="text"
        value={answer.cityName}
        onChange={(e) => updateAnswer({ ...answer, cityName: e.target.value })}
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
              dispatch(editAnswer({ index: index, answer: newAnswer }));
            }}
            editable={index === answers.length - 1}
          />
        );
      })}
    </>
  );
};
