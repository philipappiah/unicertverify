import React, {useContext} from 'react';
import { BookOpen, MessageCircle, BarChart, Home } from 'react-feather'
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import styled from 'styled-components'

import { NavLink } from 'react-router-dom'
import {  FaGithub, FaWallet, FaTractor, FaExchangeAlt, FaDatabase, FaGamepad, FaPassport, FaMoneyBillWave, FaPiggyBank } from 'react-icons/fa';
import { AppContext } from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import {SideBarProps} from '../../types'
import IssuerSideBar from './SideBar/Issuer';
import ApplicantSideBar from './SideBar/Applicant';
import './sidenav.css';


const activeclassname = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeclassname
})`
  ${({ theme }) => theme.flexRowNoWrap}
  
  text-decoration:none;
  &.${activeclassname} {
    
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
    
  }
`






export default function SideBar({ rtl, isToggled, handleToggleSidebar,handleToggleCollapse, isCollapsed}:SideBarProps){

  
  let existingUser = localStorage.getItem("userType")
  
  const {themeColor, textColor} = useContext(AppContext)
  const {userType, isValidUser, isDualUser} = useContext(UserContext)



  if(userType){
    existingUser = userType
  }
  
  return (
   
    existingUser && (!isDualUser) ?
    <ProSidebar
      rtl={rtl}
      collapsed={isCollapsed}
      toggled={isToggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
      style={{background:themeColor, color:textColor,marginTop:"10px", height:"100vh"}}
    >
      <SidebarHeader>
      
  
        <div
          style={{
          
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            height:"100%"
            
            
            
          }}
        ><Menu >
       <MenuItem icon={<Home />}> 
       <StyledNavLink id={`stake-nav-link`}  to={'/dashboard'}>
            Home
          </StyledNavLink>
        </MenuItem>
       </Menu>
        </div>
      </SidebarHeader>

      {
        existingUser === "issuer"  && <IssuerSideBar handleToggleCollapse={handleToggleCollapse} />
      }

      {
        existingUser === "applicant"  && <ApplicantSideBar handleToggleCollapse={handleToggleCollapse} />
      }


      <SidebarFooter style={{ textAlign: 'center', display:'inline-flex' }}>
        <div
          
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/meterio/voltswap/tree/voltswap"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
           
          >
            <FaGithub  color='white'  size={20} />
           
          </a>

         
        </div>
        <div
         
          style={{
            padding:  '20px 24px',
          }}
        >
      <a  target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
             href="https://docs.voltswap.finance/">
            <BookOpen  color='white' size={20} />
         
          </a>
        </div>
        <div
         
          style={{
            padding:  '20px 24px',
          }}
        >
           <a 
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"

            href="https://t.me/Meter_IO">
            <MessageCircle  color='white' size={20} />
          
          </a>
          
        </div>
       

        
         
         
      </SidebarFooter>
    </ProSidebar>:null
   
   
    
  );
};


