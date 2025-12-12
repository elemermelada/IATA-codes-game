import { PlayerScore } from "./leaderboardSlice";

export const getLeaderBoard = async (): Promise<Array<PlayerScore>> => {
  const response = await fetch("/leaderboard.json", { cache: "no-store" }); // NO CACHE
  const data = await response.json();
  return data;
};

export const saveGameResult = async (
  gameResult: PlayerScore
): Promise<void> => {
  await fetch("/save_game.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameResult),
  });
};
