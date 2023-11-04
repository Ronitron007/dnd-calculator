import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteEdge,
  onNodesChange,
  onEdgesChange,
  addEdge,
  addNode,
} from './features/FlowSlice'
import PrimitiveBlock from './common/PrimitiveBlock'

import 'reactflow/dist/style.css'
import OperatorBlock from './common/OperatorBlock'
import ResultBlock from './common/ResultBlock'
import BlockToolbar from './common/BlockToolbar'

const nodeTypes = {
  Primitive: PrimitiveBlock,
  Operator: OperatorBlock,
  Result: ResultBlock,
}

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
`

const CanvasWrapper = (props) => {
  const { className, children } = props
  const nodes = useSelector((state) => state.reactFlow.nodes)
  const edges = useSelector((state) => state.reactFlow.edges)
  const [viewPortInfo, setViewPort] = useState({ x: 0, y: 0, zoom: 1 })
  const nodesObject = useSelector((state) => state.reactFlow.nodeObj)
  const reactFlowWrapper = useRef(null)
  const dispatch = useDispatch()
  const nodeCreater = useCallback(
    (cordinates, type) => {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
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
