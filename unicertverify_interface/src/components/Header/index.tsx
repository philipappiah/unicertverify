import React, { useState, useContext, useRef } from 'react'
import {isMobile} from "react-device-detect"
import {useNavigate,NavLink } from "react-router-dom"

import { FaBars } from 'react-icons/fa';
import styled from 'styled-components'
import Notification from './notification';
import NotificationList from './notificationlist';
import { BookOpen, Code, Settings,Info, MessageCircle, PieChart } from 'react-feather'
import { AppContext } from '../../contexts/AppContext';
import {WalletContext} from '../../contexts/WalletContext';
import { UserContext } from '../../contexts/UserContext';
import SideNav from '../SideNav'
import Providers from '../Wallet';
import Transaction from '../Transaction';


const NavigationBar = styled.div
`display: grid;
align-notificationlist: center;
position: fixed;
height:80px;
width: 100%;
top: 0;
border-bottom: 1px solid rgba(0, 0, 0, 0.2);
z-index: 5;
`

// flex-direction: row;

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
position: relative;
border: none;
margin: 0px;
height: 35px;
color: #fff;
background-color: rgb(64, 68, 79);
padding: 0.1rem 0.5rem 0.3rem;
border-radius: 0.5rem;
}
`

const StyledMenu = styled.div`
margin-left: 0.5rem;
display: flex;
-webkit-box-pack: center;
justify-content: center;
-webkit-box-align: center;
align-items: center;
position: relative;
border: none;
text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 9.125rem;
  background-color: rgb(64, 68, 79);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

`


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



const MenuItem = styled.div`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: #ececec;
  :hover {
    color:#fff;
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`



export default function Header(){

    const navigate = useNavigate()

    const {themeColor, textColor} = useContext(AppContext)
    const { address, isReady} = useContext(WalletContext)
    const { isValidUser, setUserType, userDetail } = useContext(UserContext)


    const [collapsed, setCollapsed] = useState(false)
    const [openNotif, setOpenNotif] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)

    const [open, setOpen] = useState(false)
    
   

    const switchUser = () => {

      const usrtype = localStorage.getItem('userType')
      if(usrtype === "applicant" && userDetail.is_trustee){
      localStorage.setItem('userType',"issuer")
      setUserType("issuer")
      navigate('/dashboard')
      
      }

      if(usrtype === "issuer" && userDetail.is_trustee){
        localStorage.setItem('userType',"applicant")
        setUserType("applicant")
        navigate('/dashboard')

        }

    }


    const handleSideNavCollapse = () => {
        setCollapsed(!collapsed);
      };


      const toggle = () => {
        setOpen(!open)
      }

      const node = useRef<HTMLDivElement>()

    return (
        <NavigationBar style={{background:themeColor, color:textColor}}>
        <div style={{marginTop:"10px", marginLeft:"20px", fontSize:"20px", cursor:"pointer", color:textColor}} className="btn-toggle" onClick={() => handleSideNavCollapse()}>
        <FaBars />
        
        

      </div>

      
       

<StyledMenu ref={node as any}  style={{position:"absolute", right:"250px", top:"25px"}}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem onClick={switchUser}  id="link">
            <Info size={14} />
            Switch User
          </MenuItem>
          <MenuItem id="link">
            <BookOpen size={14} />
            Docs
          </MenuItem>
       
          <MenuItem id="link" >
            <PieChart size={14} />
            Analytics
          </MenuItem>
         
        </MenuFlyout>
      )}
    </StyledMenu>
  
        
      
      


      
     
      
      <div style={{position:"absolute", right:"50px", top:"20px"}}>
      
        <Providers />
        </div>
       

         
         {address && isReady && isValidUser && <SideNav isCollapsed={collapsed} toggleCollapse={handleSideNavCollapse}  />}
        </NavigationBar>
    )
}