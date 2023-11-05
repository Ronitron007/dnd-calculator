import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteEdge,
  onNodesChange,
  onEdgesChange,
  addEdge,
  addNode,
  reset,
} from './features/FlowSlice'
import PrimitiveBlock from './common/PrimitiveBlock'
import 'reactflow/dist/style.css'
import OperatorBlock from './common/OperatorBlock'
import ResultBlock from './common/ResultBlock'
import BlockToolbar from './common/BlockToolbar'
import { REDOstate, UNDOstate } from './features/UndoReducer'

const nodeTypes = {
  Primitive: PrimitiveBlock,
  Operator: OperatorBlock,
  Result: ResultBlock,
}

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: fixed;
  bottom: 0;
`

const Button = styled.button`
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  &:focus-visible {
    outline: none;
    border: none;
  }
  margin: 10px;
  &:disabled {
    cursor: not-allowed;
    filter: grayscale(100%);
  }
`

const CanvasWrapper = (props) => {
  const { className } = props
  const pastStoreVal = useSelector((state) => state.reactFlow.past)
  const futureStoreVal = useSelector((state) => state.reactFlow.future)
  const nodes = useSelector((state) => state.reactFlow.present.nodes)
  const edges = useSelector((state) => state.reactFlow.present.edges)
  const nodesObject = useSelector((state) => state.reactFlow.present.nodeObj)
  const [viewPortInfo, setViewPort] = useState({ x: 0, y: 0, zoom: 1 })
  const reactFlowWrapper = useRef(null)
  const dispatch = useDispatch()
  const nodeCreater = useCallback(
    (cordinates, type) => {
      dispatch(
        addNode({
          x:
            cordinates.x -
            viewPortInfo.x +
            (type === 'Operator' ? 320 : type === 'Result' ? 640 : 0) -
            10,
          y: cordinates.y - viewPortInfo.y + 30,
          type,
        }),
      )
    },
    [dispatch, viewPortInfo, reactFlowWrapper],
  )
  const handleUndo = useCallback(
    (event) => {
      if (event.metaKey && event.key === 'z') {
        event.preventDefault()
        pastStoreVal.length > 0 ? dispatch(UNDOstate()) : null
      } else if (event.metaKey && event.key === 'y') {
        event.preventDefault()
        futureStoreVal.length > 0 ? dispatch(REDOstate()) : null
      }
    },
    [pastStoreVal, futureStoreVal, dispatch],
  )
  useEffect(() => {
    document.addEventListener('keydown', handleUndo)

    return () => {
      document.removeEventListener('keydown', handleUndo)
    }
  }, [])

  return (
    <>
      <div className={className} ref={reactFlowWrapper}>
        <BlockToolbar createNewNode={nodeCreater} />
        <ReactFlowProvider>
          <ReactFlow
            onMove={(event, viewport) => {
              setViewPort(viewport)
            }}
            minZoom={1}
            maxZoom={1}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onDrop={nodeCreater}
            onEdgesDelete={(changes) => dispatch(deleteEdge(changes))}
            onNodesChange={(changes) => dispatch(onNodesChange(changes))}
            onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
            onConnect={(newNodeData) => dispatch(addEdge(newNodeData))}
            isValidConnection={(edge) => {
              switch (nodesObject[edge.source].type) {
                case 'Primitive': {
                  if (nodesObject[edge.target].type === 'Primitive') {
                    return false
                  } else return true
                  break
                }
                case 'Operator': {
                  if (nodesObject[edge.target].type === 'Primitive') {
                    return true
                  } else return false
                  break
                }
                default:
                  return false
              }
            }}
          >
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
        <Footer>
          <Button
            disabled={pastStoreVal.length === 0}
            onClick={() => {
              dispatch(UNDOstate())
            }}
          >
            Undo Action
          </Button>
          <Button
            disabled={futureStoreVal.length === 0}
            onClick={() => {
              dispatch(REDOstate())
            }}
          >
            Redo Action
          </Button>
          <Button
            disabled={nodes.length === 0}
            onClick={() => {
              dispatch(reset())
            }}
          >
            Reset
          </Button>
        </Footer>
      </div>
    </>
  )
}

const StyledCanvasWrapper = styled(CanvasWrapper)`
  width: 100vw;
  height: 100vh;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
`
export default StyledCanvasWrapper
