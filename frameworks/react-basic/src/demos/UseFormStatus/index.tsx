import { useState } from "react"
import { mock } from "@/utils/mock"
import "./index.scss"
import { useFormStatus } from "react-dom"

const updateName = mock({ code: 0, res: {}, message: 'success' }, 1000)

const SubmitButton = () => {
  const { pending, data, method, action } = useFormStatus()

  console.log('method', method)
  console.log('action', action)
  console.log('data', data)

  return (
    <button type="submit" disabled={pending}>
      { pending ? `Submitting... ${data?.get('name')}` : 'Submit' }
    </button>
  )
}

export const UseFormStatusDemo: React.FC = () => {
  const [name, setName] = useState('Leo')

  const submitAction = async () => {
    await updateName()
  }

  return (
    <div className="use-form-status-demo">
      <h2>UseFormStatus</h2>
      <form action={submitAction}>
        <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {/* useFormStatus will not return status information for a <form> rendered in the same component  */}
        <SubmitButton />
      </form>
    </div>
  )
}
