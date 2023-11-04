import './App.css'
import StyledCanvasWrapper from './CalculatorCanvas'
import { store } from './store'
import { Provider } from 'react-redux'

function App() {
  return (
    <>
      <Provider store={store}>
        <StyledCanvasWrapper />
      </Provider>
    </>
  )
}

export default App
