import { configureStore } from '@reduxjs/toolkit'
import flowSliceReducer from './features/FlowSlice'
import { undoableReducer } from './features/UndoReducer'

export const store = configureStore({
  reducer: {
    reactFlow: undoableReducer,
  },
})
