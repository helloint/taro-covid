import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import dailyTotalReducer from './dailyTotal/dailyTotalSlice';

const reducer = {
  dailyTotal: dailyTotalReducer,
};

// TODO: how it works with RTK? `composeWithDevTools` is already handled by configureStore,
//  the problem is just for the `options`
// const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//   ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//   })
//   : compose

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([process.env.NODE_ENV === 'development' ? logger : null]),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
