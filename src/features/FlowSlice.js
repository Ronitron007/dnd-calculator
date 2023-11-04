import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { current } from 'immer'
const initialState = {
  nodes: [],
  edges: [],
  nodeObj: {},
}

function calculatedValue(resultNode, nodeObj) {
  let sourceNode = resultNode
  while (sourceNode.data.sourceConnected) {
    sourceNode = nodeObj[sourceNode.data.source]
  }
  let value = 0
  if (sourceNode.type === 'Operator') {
    sourceNode = nodeObj[sourceNode.data.target]
  }
  value = sourceNode.data.nodeValue
  let nodePointer = nodeObj[sourceNode.data.target]
  let currentOperator
  while (nodePointer.data.targetConnected) {
    if (nodePointer.type === 'Primitive') {
      value = switchCalculator(
        value,
        nodePointer.data.nodeValue,
        currentOperator,
      )
    } else {
      currentOperator = nodePointer.data.nodeValue
    }
    nodePointer = nodeObj[nodePointer.data.target]
  }

  return value
}

function findTargetId(node, nodeObj) {
  let targetId = node.data.target
  while (nodeObj[targetId].data.targetConnected) {
    targetId = nodeObj[targetId].data.target
  }
  return targetId
}

function switchCalculator(val1, val2, operator) {
  switch (operator) {
    case '+':
      return val1 + val2
    case '-':
      return val1 - val2
    case '*':
      return val1 * val2
    case '/':
      return val1 / val2
    default:
      return null
  }
}

export const flowSlice = createSlice({
  name: 'reactFlow',
  initialState,
  reducers: {
    addNode: (state, action) => {
      const id = nanoid(6)
      const node = {
        id,
        type: action.payload.type,
        data: {
          nodeValue: action.payload.type === 'Operator' ? '+' : 0,
          targetConnected: false,
          sourceConnected: false,
        },
        position: { x: action.payload.x, y: action.payload.y },
      }
      state.nodes = [...state.nodes, node]
      state.nodeObj = { ...state.nodeObj, [id]: node }
    },
    onNodesChange: (state, action) => {
      return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) }
    },
    onEdgesChange: (state, action) => {
      return { ...state, nodes: applyEdgeChanges(action.payload, state.nodes) }
    },
    addEdge: (state, action) => {
      const id = nanoid(6)
      const isResultEdge =
        state.nodeObj[action.payload.target].type === 'Result'

      state.nodes.map((node) => {
        if (node.id === action.payload.source) {
          node.data.targetConnected = true
          node.data.target = action.payload.target
          state.nodeObj[node.id].data.targetConnected = true
          state.nodeObj[node.id].data.target = action.payload.target
        }
        if (node.id === action.payload.target) {
          node.data.sourceConnected = true
          node.data.source = action.payload.source
          state.nodeObj[node.id].data.sourceConnected = true
          state.nodeObj[node.id].data.source = action.payload.source
        }
      })
      if (
        state.nodeObj[action.payload.target].data.connectedToResult ||
        isResultEdge
      ) {
        let currentNode = current(state.nodeObj[action.payload.source])
        let tempNode = state.nodeObj[currentNode.id]
        tempNode.data.connectedToResult = true
        while (currentNode.data.sourceConnected) {
          currentNode = current(state.nodeObj[currentNode.data.source])
          let tempNode = state.nodeObj[currentNode.id]
          tempNode.data.connectedToResult = true
        }
        state.nodes.map((node) => {
          if (node.type === 'Result') {
            node.data.nodeValue = calculatedValue(
              current(node),
              current(state.nodeObj),
            )
          }
        })
      }
      const edge = { ...action.payload, id }
      state.edges = [...state.edges, edge]
    },
    updateNode: (state, action) => {
      state.nodes.map((node) => {
        if (node.id === action.payload.id) {
          if (node.type === 'Primitive') {
            node.data.nodeValue = parseInt(action.payload.nodeValue)
            state.nodeObj[node.id].data.nodeValue = parseInt(
              action.payload.nodeValue,
            )
          } else {
            node.data.nodeValue = action.payload.nodeValue
            state.nodeObj[node.id].data.nodeValue = action.payload.nodeValue
          }
        }
      })
      if (state.nodeObj[action.payload.id].data.connectedToResult) {
        let targetID = findTargetId(
          current(state.nodeObj[action.payload.id]),
          current(state.nodeObj),
        )
        let newValue = calculatedValue(
          current(state.nodeObj[targetID]),
          current(state.nodeObj),
        )
        state.nodes.map((node) => {
          if (node.id === targetID) {
            node.data.nodeValue = newValue
            state.nodeObj[node.id].data.nodeValue = newValue
          }
        })
      }
    },
    deleteEdge: (state, action) => {
      state.edges = state.edges.filter(
        (edge) => edge.id !== action.payload[0].id,
      )
      const isResultEdge =
        state.nodeObj[action.payload[0].target].type === 'Result'
      if (
        state.nodeObj[action.payload[0].target].data.connectedToResult ||
        isResultEdge
      ) {
        let currentNode = current(state.nodeObj[action.payload[0].source])
        let tempNode = state.nodeObj[currentNode.id]
        tempNode.data.connectedToResult = false
        while (currentNode.data.sourceConnected) {
          currentNode = current(state.nodeObj[currentNode.data.source])
          let tempNode = state.nodeObj[currentNode.id]
          tempNode.data.connectedToResult = false
        }
      }
      state.nodes.map((node) => {
        if (node.id === action.payload[0].source) {
          node.data.targetConnected = false
          node.data.target = null
          state.nodeObj[node.id].data.targetConnected = false
          state.nodeObj[node.id].data.target = null
        }
        if (node.id === action.payload[0].target) {
          node.data.sourceConnected = false
          node.data.source = null
          state.nodeObj[node.id].data.sourceConnected = false
          state.nodeObj[node.id].data.source = null
        }
      })
      state.nodes.map((node) => {
        if (node.type === 'Result') {
          if (node.data.sourceConnected) {
            node.data.nodeValue = calculatedValue(
              current(node),
              current(state.nodeObj),
            )
          } else {
            node.data.nodeValue = 0
          }
        }
      })
    },
  },
})

export const {
  addEdge,
  onNodesChange,
  onEdgesChange,
  updateNode,
  addNode,
  deleteEdge,
} = flowSlice.actions

export default flowSlice.reducer
