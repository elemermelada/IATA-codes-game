// Leaderboard reducer should keep track of the players and their scores
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import { GameState } from "../game/gameSlice";
import { getLeaderBoard } from "./api";

export interface PlayerScore {
  playerName: string;
  score: number;
}

interface LeaderboardState {
  scores: PlayerScore[];
}

const initialState: LeaderboardState = {
  scores: [],
};

export const convertGameStateToPlayerScore = (
  gameState: GameState
): PlayerScore => {
  const correctAnswers = gameState.answers.filter(
    (answer) => answer.isCorrect
  ).length;
  return {
    playerName: gameState.playerName,
    score: correctAnswers,
  };
};

export const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    // addGameResult: (state, action: PayloadAction<GameState>) => {
    //   state.scores.push(convertGameStateToPlayerScore(action.payload));
    //   const leaderboard = getLeaderBoard();
    //   state
    // },
    updateLeaderboard: (state, action: PayloadAction<PlayerScore[]>) => {
      state.scores = action.payload;
    },
    resetLeaderboard: (state) => {
      state.scores = [];
    },
  },
});

export const { resetLeaderboard, updateLeaderboard } = leaderboardSlice.actions;

export const selectScores = (state: RootState) => state.leaderboard.scores;

export default leaderboardSlice.reducer;
