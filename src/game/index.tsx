import { useAppSelector } from "../redux/hooks";

export const Game = () => {
  const gameState = useAppSelector((state) => state.game);
  return (
    <div>
      <span>Hello </span>
      <input value={gameState.playerName} />
    </div>
  );
};
