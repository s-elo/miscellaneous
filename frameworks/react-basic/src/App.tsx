import { Route, Routes } from 'react-router'
import { routes } from './routes'
import { SideBar } from '@/components/SideBar'
import './App.scss'

function App() {  
  return (
    <div className="app-container">
      <SideBar routes={routes} />
      <section className="app-content">
        <Routes>
          {
            routes.map((route) => {
              const Component = route.Component!
              return (
                <Route path={route.path} element={<Component />} key={route.path} />
              )
            })
          }
        </Routes>
      </section>
    </div>
  )
}

export default App
