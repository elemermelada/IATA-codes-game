import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AnswerContainer } from "./answer";
import { changePlayerName } from "./gameSlice";

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
        autoFocus
      />
      {gameState.playing ? (
        <AnswerContainer />
      ) : (
        <div>Press Enter to start a new game!</div>
      )}
    </div>
  );
};
