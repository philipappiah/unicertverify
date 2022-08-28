import React, {useState} from "react";
import {SideNavProps} from '../../types'
import SideBar from './SideBar'
import './sidenav.css';



export default function Layout({isCollapsed, toggleCollapse}:SideNavProps){

  const [toggled, setToggled] = useState(false);

 

  const toggleSidebar = (value:boolean) => {
    setToggled(value);
  };
    

    return (
    <div className={`app  ${toggled ? 'toggled' : ''}`}>
      <SideBar
        isCollapsed={isCollapsed}
        rtl={false}
        isToggled={toggled}
        handleToggleCollapse = {toggleCollapse}
        handleToggleSidebar={toggleSidebar}
      />
     
    </div>
    )


}