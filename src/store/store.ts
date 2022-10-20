import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import dailyTotalReducer from './dailyTotal/dailyTotalSlice';

const reducer = {
  dailyTotal: dailyTotalReducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
