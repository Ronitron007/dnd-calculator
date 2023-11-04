import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Handle } from 'reactflow'
import { useDispatch } from 'react-redux'
import { updateNode } from '../features/FlowSlice'

const OperatorBlockWrapper = styled.div`
  color: black;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  height: 60px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  width: 60px;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  select {
    background-color: white;
    font-size: 2rem;
    color: black;
    border: none;
    outline: none;
    &:disabled {
      background-color: white;
    }
  }
`

export default function OperatorBlock(props) {
  const { id, data = { nodeValue: '+' } } = props
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
    <OperatorBlockWrapper className="">
      {id ? (
        <Handle
          type="target"
          position="left"
          isConnectable={!targetIsConnected}
          onConnect={() => setTargetConnected(true)}
        />
      ) : null}
      <select
        disabled={!id}
        className="nodrag"
        value={data.nodeValue}
        onChange={(e) =>
          dispatch(updateNode({ id, nodeValue: e.target.value }))
        }
      >
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
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
    </OperatorBlockWrapper>
  )
}
