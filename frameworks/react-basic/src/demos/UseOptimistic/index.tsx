import { useState, useOptimistic, useTransition, useRef } from "react"
import { mockRequest } from "@s-elo/shared"
import "./index.scss"

const sentMessage = mockRequest({ code: 0, res: {}, message: 'success' }, 1000)

/**
 * After the form action transition, the optimistic name will be sync with the name automatically.
 */
export const UseOptimisticDemo: React.FC = () => {
  const [name, setName] = useState('Leo')
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  // must used with form action (form action will use startTransition)
  const [optimisticName, setOptimisticName] = useOptimistic(name, (_, next) => {
    return `${next} (sending...)`
  })

  const submitAction = async () => {
    setOptimisticName(name)
    // can omit the transition, but must use form action
    startTransition(async () => {
      await sentMessage()
      setName(`${name} (sent)`)
    })
    await sentMessage()
  }

  return (
    <div className="use-optimistic-demo">
      <h2>UseOptimistic</h2>
      <form action={submitAction} ref={formRef}>
        <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button disabled={isPending} type="submit">
          {isPending ? 'Sending...' : 'Submit'}
        </button>
      </form>
      <p>{optimisticName}</p>
    </div>
  )
}
