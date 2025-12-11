// Game reducer should keep track of all the answers given by the user
// This includes IATA Code, City Name and if its correct or not

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";

export interface Answer {
  iataCode: string;
  cityName: string;
  isCorrect: boolean;
}

export interface GameState {
  playerName: string;
  answers: Answer[];
  playing: boolean;
}

const initialState: GameState = {
  playerName: "New Player",
  answers: [],
  playing: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    changePlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      state.answers.push(action.payload);
      state.playing = true;
    },
    editAnswer: (
      state,
      action: PayloadAction<{ index: number; answer: Answer }>
    ) => {
      const { index, answer } = action.payload;
      if (index >= 0 && index < state.answers.length) {
        state.answers[index] = answer;
      }
    },
    resetGame: (state) => {
      state.answers = [];
      state.playing = false;
    },
  },
});

export const { changePlayerName, addAnswer, editAnswer, resetGame } =
  gameSlice.actions;

export const selectAnswers = (state: RootState) => state.game.answers;

export default gameSlice.reducer;
