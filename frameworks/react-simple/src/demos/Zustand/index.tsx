import { useUserStore } from "@/store"
import style from './index.module.scss'

export const ZustandDemo: React.FC = () => {
  const { name, age, setName, setAge } = useUserStore()

  return (
    <div className={style['zustand-demo']}>
      <h1>Zustand</h1>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </div> 
  )
}