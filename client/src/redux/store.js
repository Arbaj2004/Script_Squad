import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Adjust the import path as needed
import darkModeReducer from './darkModeSlice'; // Assuming you already have this

export const store = configureStore({
    reducer: {
        user: userReducer,
        darkMode: darkModeReducer, // Other slices
    },
});
