import { configureStore } from '@reduxjs/toolkit'
import flowSliceReducer from './features/FlowSlice'

export const store = configureStore({
  reducer: {
    reactFlow: flowSliceReducer,
  },
})
