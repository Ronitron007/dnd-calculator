import React, { useState } from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import PrimitiveBlock from './PrimitiveBlock'
import ResultBlock from './ResultBlock'
import OperatorBlock from './OperatorBlock'

const Header = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  max-height: fit-content;
  z-index: 9999999;
  background-color: antiquewhite;
  padding: 1rem;
  color: black;
  font-size: large;
  column-gap: 10px;
  .container {
    width: 300px;
  }
`

export default (props) => {
  const { createNewNode } = props
  //   const onDragStart = (event, nodeType) => {
  //     event.dataTransfer.setData('application/reactflow', nodeType)
  //     event.dataTransfer.effectAllowed = 'move'
  //   }
  const [primitivePosition, setPrimitivePosition] = useState({ x: 0, y: 0 })
  const [operatorPosition, setOperatorPosition] = useState({ x: 0, y: 0 })
  const [resultPosition, setResultPosition] = useState({ x: 0, y: 0 })
  const [activeDrags, setActiveDrags] = useState(0)
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 })
  const [controlledPosition, setControlledPosition] = useState({
    x: 0,
    y: 0,
  })

  const handleDrag = (e, ui) => {
    setDeltaPosition({
      x: deltaPosition.x + ui.deltaX,
      y: deltaPosition.y + ui.deltaY,
    })
  }
  const adjustXPos = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { x, y } = controlledPosition
    setControlledPosition({ x: x - 10, y: y })
  }

  const adjustYPos = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { x, y } = controlledPosition
    setControlledPosition({ x: x, y: y - 10 })
  }
  const onStart = () => {
    setActiveDrags(activeDrags + 1)
  }
  const onStop = () => {
    setActiveDrags(activeDrags - 1)
  }

  const onControlledDrag = (e, position, cordinateController) => {
    const { x, y } = position
    cordinateController({ x, y })
  }

  const stopHandler = (type) => {
    switch (type) {
      case 'Primitive':
        createNewNode(
          { x: primitivePosition.x, y: primitivePosition.y },
          'Primitive',
        )
        setPrimitivePosition({ x: 0, y: 0 })
        break
      case 'Operator':
        createNewNode(
          { x: operatorPosition.x, y: operatorPosition.y },
          'Operator',
        )
        setOperatorPosition({ x: 0, y: 0 })
        break
      case 'Result':
        createNewNode({ x: resultPosition.x, y: resultPosition.y }, 'Result')
        setResultPosition({ x: 0, y: 0 })
        break
      default:
        break
    }
  }
  const dragHandlers = { onStart, onStop }
  return (
    <>
      <Header>
        <div className="container">
          <span>Primitive Block :</span>
          <Draggable
            position={primitivePosition}
            {...dragHandlers}
            onStop={(e) => {
              e.preventDefault()
              stopHandler('Primitive')
            }}
            onDrag={(e, position) =>
              onControlledDrag(e, position, setPrimitivePosition)
            }
          >
            <div className="box">
              <PrimitiveBlock />
            </div>
          </Draggable>
          <div className="pseudo-box">
            <PrimitiveBlock />
          </div>
        </div>
        <div className="container">
          <span>Operator Block :</span>
          <Draggable
            position={operatorPosition}
            {...dragHandlers}
            onStop={(e) => {
              e.preventDefault()
              stopHandler('Operator')
            }}
            onDrag={(e, position) =>
              onControlledDrag(e, position, setOperatorPosition)
            }
          >
            <div className="box">
              <OperatorBlock />
            </div>
          </Draggable>
          <div className="pseudo-box">
            <OperatorBlock />
          </div>
        </div>
        <div className="container">
          <span>Result Block :</span>
          <Draggable
            position={resultPosition}
            {...dragHandlers}
            onStop={(e) => {
              e.preventDefault()
              stopHandler('Result')
            }}
            onDrag={(e, position) =>
              onControlledDrag(e, position, setResultPosition)
            }
          >
            <div className="box">
              <ResultBlock />
            </div>
          </Draggable>
          <div className="pseudo-box">
            <ResultBlock />
          </div>
        </div>
      </Header>
    </>
  )
}
