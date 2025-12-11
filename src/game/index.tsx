import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AnswerContainer } from "./answer";
import { addAnswer, changePlayerName } from "./gameSlice";

export const Game = () => {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const updatePlayerName = (name: string) => {
    // Dispatch an action to update the player name in the Redux store
    dispatch(changePlayerName(name));
  };
  return (
    <div>
      <span>Hello </span>
      <input
        value={gameState.playerName}
        onChange={(e) => updatePlayerName(e.target.value)}
      />
      {gameState.playing ? (
        <AnswerContainer />
      ) : (
        <button
          onClick={() => {
            // Start the game by adding an empty answer
            dispatch(
              addAnswer({ iataCode: "", cityName: "", isCorrect: false })
            );
          }}
        >
          Start Game
        </button>
      )}
    </div>
  );
};
