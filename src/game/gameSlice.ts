// Game reducer should keep track of all the answers given by the user
// This includes IATA Code, City Name and if its correct or not

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';

interface Answer { 
    iataCode: string;
    cityName: string;
    isCorrect: boolean;
}

export interface GameState {
    playerName: string;
    answers: Answer[];
}

const initialState: GameState = {
    playerName: "New Player",
    answers: []
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        addAnswer: (state, action: PayloadAction<Answer>) => {
            state.answers.push(action.payload);
        },
        resetGame: (state) => {
            state.answers = [];
        }
    }
}); 

export const { addAnswer, resetGame } = gameSlice.actions

export const selectAnswers = (state: RootState) => state.game.answers

export default gameSlice.reducer