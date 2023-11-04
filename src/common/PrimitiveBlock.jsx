import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Handle } from 'reactflow'
import { useDispatch } from 'react-redux'
import { updateNode } from '../features/FlowSlice'

const PrimitiveBlockWrapper = styled.div`
  color: white;
  background-color: black;
  padding: 10px;
  border-radius: 5px;
  max-width: fit-content;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  color: #666;
  input {
    width: 140px;
    font-size: 1.5rem;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    &:disabled {
      background-color: black;
    }
  }
`

export default function PrimitiveBlock(props) {
  const { id, data = { nodeValue: undefined } } = props
  const dispatch = useDispatch()
  const [sourceIsConnected, setSourceConnected] = React.useState(false)
  const [targetIsConnected, setTargetConnected] = React.useState(false)
  useEffect(() => {
    if (!data.targetConnected && targetIsConnected) {
      setTargetConnected(false)
    }
    if (data.sourceConnected === false && sourceIsConnected) {
      setSourceConnected(false)
    }
  }, [data])
  return (
    <PrimitiveBlockWrapper className="">
      {id ? (
        <Handle
          type="target"
          position="left"
          isConnectable={!targetIsConnected}
          onConnect={() => setTargetConnected(true)}
        />
      ) : null}
      {id ? (
        <input
          onChange={(e) =>
            dispatch(updateNode({ id, nodeValue: e.target.value }))
          }
          type="number"
          className="nodrag"
          placeholder="Enter Value"
          value={data.nodeValue}
        />
      ) : (
        <span>Enter Value</span>
      )}
      {id ? (
        <Handle
          type="source"
          position="right"
          onConnect={() => {
            setSourceConnected(true)
          }}
          isConnectable={!sourceIsConnected}
        />
      ) : null}
    </PrimitiveBlockWrapper>
  )
}
