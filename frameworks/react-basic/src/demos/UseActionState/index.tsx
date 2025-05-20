import { useState, useMemo, memo, useActionState } from "react"
import { mockRequest } from "@s-elo/shared"
import "./index.scss"

const updateName = mockRequest({ code: 0, res: {}, message: 'success' }, 500)

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
 * Try to press enter to submit, and then keep typing, 
 * see if your typing is blocked by the list rendering or not
 * */
export const UseActionStateDemo: React.FC = () => {
  const [name, setName] = useState('Leo')
  const [list, setList] = useState<string[]>([])
  // can only used for form action
  const [error, submitAction, isPending] = useActionState(
    async (previousState: Error | null, formData: FormData) => {
      console.log('previousState', previousState)
      console.log('formData', formData.get('name'))
      setList([])
      const res = await updateName()
      if (res.code !== 0) {
        return new Error(res.message)
      }
      console.log('updated')
      setList(Array.from({ length: 100000 }, () => Math.random().toString(36).substring(2, 15)))
      // not necessarily finish the render, if you keep typing because the rendering of the list exceeds 16ms which is the threshold of react to render a frame
      console.log('setList')

      return null
    }, null)

  /** when only update the name, the list will not be rendered */
  const cachedList = useMemo(() => list, [list])

  return (
    <div className="use-action-state-demo">
      <h2>UseActionState</h2>
      <p>- Try to press enter to submit, and then keep typing, the list will not be rendered until you stop typing</p>
      <form action={submitAction}>
        <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={isPending}>
          { isPending ? 'loading...' : 'update' }
        </button>
      </form>
      {error && <p>{error.message}</p>}
      {
        isPending ? <p>loading...</p> : (
          <List list={cachedList} />
        )
      }
    </div>
  )
}
