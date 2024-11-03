import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './features/user'
import { friendReducer } from './features/friends'
import { chatAreaReducer } from './features/chat'

export const makeStore = () => {
  return configureStore({
    reducer: {
      user:userReducer,
      friends:friendReducer,
      chat:chatAreaReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']