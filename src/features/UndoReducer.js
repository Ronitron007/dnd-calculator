import flowSliceReducer from './FlowSlice'

function undoable(reducer) {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  }

  // Return a reducer that handles undo and redo
  return function (state = initialState, action) {
    const { past, present, future } = state

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [...future, present],
        }
      case 'REDO':
        const next = future[future.length - 1]
        const newFuture = future.slice(0, future.length - 1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        }
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state
        }
        if (action.type === 'reactFlow/onNodesChange') {
          if (
            action.payload[0].type === 'dimensions' ||
            action.payload[0].type === 'position' ||
            action.payload[0].type === 'remove'
          ) {
            return {
              past: past,
              present: newPresent,
              future: [],
            }
          }
        }

        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        }
    }
  }
}

export const UNDOstate = () => {
  return {
    type: 'UNDO',
  }
}
export const REDOstate = () => {
  return {
    type: 'REDO',
  }
}

export const undoableReducer = undoable(flowSliceReducer)
