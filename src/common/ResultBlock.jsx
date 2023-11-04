import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Handle } from 'reactflow'

const ResultBlockWrapper = styled.div`
  color: white;
  background-color: red;
  padding: 10px;
  font-weight: 700;
  font-size: 2rem;
  border-radius: 5px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
`

export default function ResultBlock(props) {
  const { id, data = { nodeValue: 0 } } = props
  const [targetIsConnected, setTargetConnected] = React.useState(false)
  useEffect(() => {
    if (!data.targetConnected && targetIsConnected) {
      setTargetConnected(false)
    }
  }, [data])
  return (
    <ResultBlockWrapper className="">
      {id ? (
        <Handle
          type="target"
          position="left"
          isConnectable={!targetIsConnected}
          onConnect={() => setTargetConnected(true)}
        />
      ) : null}
      {data.nodeValue}
    </ResultBlockWrapper>
  )
}
