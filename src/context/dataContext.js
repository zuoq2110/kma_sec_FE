import { jwtDecode } from 'jwt-decode'
import React, { useCallback, useEffect, useState } from 'react'

const DataContext = React.createContext()

function DataProvider({ children }) {
  const [dataWindowAnalysis, setDataWindowAnalysis] = useState(null)
  const [dataUser, setDataUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setDataUser(JSON.parse(localStorage.getItem('dataUser')))
    setIsAdmin(JSON.parse(localStorage.getItem('isAdmin')))
  }, [])

  useEffect(() => {
    if (dataUser !== null) {
      localStorage.setItem('dataUser', JSON.stringify(dataUser))
    } else {
      localStorage.removeItem('dataUser')
    }
  }, [dataUser])

  const login = useCallback((email, password) => {
    const isAdminRole = localStorage.getItem('isAdmin')
    console.log('isAdminRole', isAdminRole)
    if (isAdminRole === 'true') {
      setDataUser({ email, password })
      setIsAdmin(true)
      console.log(isAdmin)
    } else {
      setDataUser({ email, password })
      setIsAdmin(true)
      console.log(isAdmin)
    }
  }, [])

  const logout = useCallback(() => {
    setDataUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('id')
  }, [])

  return (
    <DataContext.Provider
      value={{
        dataWindowAnalysis,
        setDataWindowAnalysis,
        dataUser,
        isAdmin,
        setDataUser,
        login,
        logout,
      }}
    >
      {children}{' '}
    </DataContext.Provider>
  )
}

export default DataProvider
export { DataContext }
