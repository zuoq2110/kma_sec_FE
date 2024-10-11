import React, { useContext } from 'react'
import AppMenuitem from './AppMenuItem'
import {
  dataMenusAdmin,
  dataMenusClient,
  dataMenusUser,
} from '../utils/dataMenu'
import { DataContext } from '../context/dataContext'

const AppSidebar = () => {
  const { dataUser } = useContext(DataContext)
  const { isAdmin } = useContext(DataContext)
  return (
    <ul className="layout-menu">
      {dataUser && isAdmin === true
        ? dataMenusAdmin.map((item, i) => {
            return !item.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            )
          })
        : dataUser && isAdmin === false
        ? dataMenusUser.map((item, i) => {
            return !item.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            )
          })
        : dataMenusClient.map((item, i) => {
            return !item.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            )
          })}
    </ul>
  )
}

export default AppSidebar
