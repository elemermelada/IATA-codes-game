import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import "./index.css";
import { getLeaderBoard } from "./api";
import { updateLeaderboard } from "./leaderboardSlice";

export const Leaderboard = () => {
  const scores = [...useAppSelector((state) => state.leaderboard.scores)];
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Could fetch updated leaderboard here if desired
    getLeaderBoard().then((data) => {
      // Update the leaderboard state with fetched data
      // Assuming you have an action to update the leaderboard
      dispatch(updateLeaderboard(data));
    });
  }, []);
  if (scores.length === 0) return <div>Results will show up here</div>;
  scores.sort((a, b) => b.score - a.score);
  return (
    <div>
      <h3 className="leaderboard-title">Leaderboard</h3>
      <div className="custom-scrollbar leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="leaderboard-th">#</th>
              <th className="leaderboard-th">Player</th>
              <th className="leaderboard-th">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={index} className="leaderboard-entry">
                <td className="leaderboard-td">{index + 1}</td>
                <td className="leaderboard-td">{entry.playerName}</td>
                <td className="leaderboard-td">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
