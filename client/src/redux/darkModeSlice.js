// src/redux/darkModeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: false,
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        enableDarkMode: (state) => {
            state.darkMode = true;
        },
        disableDarkMode: (state) => {
            state.darkMode = false;
        },
    },
});

export const { toggleDarkMode, enableDarkMode, disableDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
