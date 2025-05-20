import { mockRequest } from "@s-elo/shared"
import React, { use, Suspense, useState } from "react"

const fetchData = mockRequest([1, 2, 3], 1000)

const DataCom: React.FC<{ promise: Promise<number[]> }> = ({ promise }) => {
  const data = use(promise)

  return (
    <ul>
      {
        data.map(item => (
          <li key={item}>{item}</li>
        ))
      }
    </ul>
  )
}

export const UseDemo: React.FC = () => {
  const [fetchPromise, setFetchPromise] = useState<Promise<number[]>>(fetchData())

  return (
    <div className="use-demo">
      <h2>Use</h2>
      <button onClick={() => {
        setFetchPromise(fetchData())
      }}>
        Fetch Data
      </button>
      <ul>
        <Suspense fallback={<div>Loading...</div>}>
          <DataCom promise={fetchPromise} />
        </Suspense>
      </ul>
    </div>
  )
}
