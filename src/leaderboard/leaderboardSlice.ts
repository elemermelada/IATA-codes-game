// Leaderboard reducer should keep track of the players and their scores
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import { GameState } from '../game/gameSlice';

interface PlayerScore { 
    playerName: string;
    score: number;
}

interface LeaderboardState {
    scores: PlayerScore[];
}

const initialState: LeaderboardState = {
    scores: []
};

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        addGameResult: (state, action: PayloadAction<GameState>) => {
            const correctAnswers = action.payload.answers.filter(answer => answer.isCorrect).length;
            state.scores.push({
                playerName: action.payload.playerName,
                score: correctAnswers
            });
        },
        resetLeaderboard: (state) => {
            state.scores = [];
        }
    }
});

export const { addGameResult, resetLeaderboard } = leaderboardSlice.actions;

export const selectScores = (state: RootState) => state.leaderboard.scores;

export default leaderboardSlice.reducer;