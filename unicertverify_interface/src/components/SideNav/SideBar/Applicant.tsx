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
import { FaBuilding, FaExchangeAlt } from 'react-icons/fa';
import {AiFillBank, AiFillFileText} from 'react-icons/ai';
import { GoMortarBoard } from "react-icons/go";




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

export default function ApplicantSideBar ({ handleToggleCollapse}:SpecificSideBarProps) {
   
    return (
        <SidebarContent>

          <Menu  iconShape="circle">
          <MenuItem 
            icon={<AiFillFileText />}
            
          >
           
          <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={'/createRequest'}>
            Create a Request
          </StyledNavLink>

          </MenuItem>
      
         
        </Menu>

        <Menu  iconShape="circle">
          <MenuItem 
            icon={<GoMortarBoard />}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={'/viewCert'}>
            View Cert
          </StyledNavLink>
        

          </MenuItem>
      
         
        </Menu>


          
        <Menu  iconShape="circle">
          <MenuItem 
            icon={<FaExchangeAlt />}
            
          >
           <StyledNavLink  className="sideBarItem" id={`stake-nav-link`}  to={'/userTx'}>
            Transactions
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