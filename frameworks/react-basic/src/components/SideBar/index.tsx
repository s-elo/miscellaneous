import { Link } from 'react-router'
import './index.scss'
import { useMemo, useState } from 'react'

type SideBarProps = {
  routes: {
    name: string
    path: string
  }[]
}

export const SideBar: React.FC<SideBarProps> = ({ routes }) => {
  const [searchValue, setSearchValue] = useState('')
  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      return route.name.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [routes, searchValue])

  return (
    <div className="side-bar-container">
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)} 
      />
      {
        filteredRoutes.map((route) => {
          return (
            <div className="side-bar-item" key={route.path}>
              <Link to={route.path}>{route.name}</Link>
            </div>
          )
        })
      }
    </div>
  )
}