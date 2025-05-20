import { useTransition, useState, useMemo, memo } from "react"
import { mock } from "@/utils/mock"
import "./index.scss"

const updateName = mock({ code: 0, res: {}, message: 'success' }, 500)

const List = memo(({ list }: { list: string[] }) => {
  return (
    <div>
      { list.map((item) => (
        <div key={item}>{item}</div>
      )) }
    </div>
  )
})

/** 
 * Try to click the "update" or "update in transition" button, and then keep typing, 
 * see if your typing is blocked by the list rendering or not
 * 
 * Clicking the "update in transition" or "update" button 
 * is like switching to a new tab, and then you keep typing
 * */
export const UseTransitionDemo: React.FC = () => {
  const [name, setName] = useState('Leo')
  const [list, setList] = useState<string[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false)

  /** when only update the name, the list will not be rendered */
  const cachedList = useMemo(() => list, [list])

  const action = async () => {
    setList([])
    const res = await updateName()
    if (res.code !== 0) {
      setError(new Error(res.message))
      return
    }
    console.log('updated')
    setList(Array.from({ length: 100000 }, () => Math.random().toString(36).substring(2, 15)))
    // not necessarily finish the render, if you keep typing because the rendering of the list exceeds 16ms which is the threshold of react to render a frame
    console.log('setList')
  }

  const handleSubmitInTransition = () => {
    startTransition(action)
  }

  const handleSubmit = () => {
    setIsLoading(true)
    action().finally(() => setIsLoading(false))
  }

  return (
    <div className="use-transition-demo">
      <h2>UseTransition</h2>
      <p>- Try to click the "update in transition" button, and then keep typing, the list will not be rendered until you stop typing</p>
      <p>- Try to click the "update" button, and then keep typing, the list will be rendered after loading the data and block your typings util the list is rendered</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmitInTransition} disabled={isPending}>
        { isPending ? 'loading...' : 'update in transition' }
      </button>
      <button onClick={handleSubmit} disabled={isPending}>
        { isLoading ? 'loading...' : 'update' }
      </button>
      {error && <p>{error.message}</p>}
      {
        (isPending || isLoading) ? <p>loading...</p> : (
          <List list={cachedList} />
        )
      }
    </div>
  )
}
