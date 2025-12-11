// Game reducer should keep track of all the answers given by the user
// This includes IATA Code, City Name and if its correct or not

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";

export interface Answer {
  iataCode: string;
  municipality: string;
  isCorrect: boolean;
}

export interface GameState {
  playerName: string;
  answers: Answer[];
  playing: boolean;
  timeOfLastCorrectAnswer: number;
}

const initialState: GameState = {
  playerName: "New Player",
  answers: [],
  playing: false,
  timeOfLastCorrectAnswer: new Date().getTime(),
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state) => {
      state.playing = true;
      state.answers = [{ iataCode: "", municipality: "", isCorrect: false }];
      state.timeOfLastCorrectAnswer = new Date().getTime();
    },
    endGame: (state) => {
      state.playing = false;
      state = initialState;
    },
    changePlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      state.answers.push(action.payload);
      state.playing = true;
    },
    editCurrentAnswer: (state, action: PayloadAction<Answer>) => {
      const answer = action.payload;
      state.answers[state.answers.length - 1] = answer;
      if (answer.isCorrect) {
        state.timeOfLastCorrectAnswer = new Date().getTime();
      }
    },
    resetGame: (state) => {
      state.answers = [];
      state.playing = false;
    },
  },
});

export const {
  startGame,
  endGame,
  changePlayerName,
  addAnswer,
  editCurrentAnswer,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
