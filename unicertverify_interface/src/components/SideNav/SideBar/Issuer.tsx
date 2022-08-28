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
import {SpecificSideBarProps} from '../../../types'

import { NavLink } from 'react-router-dom'
import {  FaExchangeAlt, FaBell } from 'react-icons/fa';
import {AiFillBank, AiFillFileText} from 'react-icons/ai';
import { MdVerifiedUser } from "react-icons/md";





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

export default function IssuerSideBar ({ handleToggleCollapse}: SpecificSideBarProps) {
   

    return (
       <SidebarContent>
        <Menu  iconShape="circle">
          <MenuItem 
            icon={<FaBell />}
            suffix={<span className="badge yellow">0</span>}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={'/swap'}>
            Notifications
          </StyledNavLink>
          </MenuItem>
        </Menu>

        <Menu  iconShape="circle">
          <MenuItem 
            icon={<AiFillFileText />}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={`/issuerReqList/pending`}>
            Pending Requests
          </StyledNavLink>
          </MenuItem>
        </Menu>

        <Menu  iconShape="circle">
          <MenuItem 
            icon={<FaExchangeAlt />}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={`/issuerReqList/issued`}>
            Issued Requests
          </StyledNavLink>
          </MenuItem>
        </Menu>

        <Menu  iconShape="circle">
          <MenuItem 
            icon={<MdVerifiedUser />}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={`/trusteesList`}>
            Trustees
          </StyledNavLink>
          </MenuItem>
        </Menu>

        <Menu  iconShape="circle">
          <MenuItem 
            icon={<AiFillBank />}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={'/issuersList'}>
            Issuers
          </StyledNavLink>
        

          </MenuItem>
      
         
        </Menu>

      
      </SidebarContent>
    )

}