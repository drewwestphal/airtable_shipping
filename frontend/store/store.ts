// from https://redux-toolkit.js.org/usage/usage-with-typescript
import { configureStore } from '@reduxjs/toolkit'
// @ts-ignore
import logger from 'redux-logger'
import reducer from './reducer'

type RootState = ReturnType<typeof reducer>
export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // prepend and concat calls can be chained
      .concat(logger),
})

type AppDispatch = typeof store.dispatch
