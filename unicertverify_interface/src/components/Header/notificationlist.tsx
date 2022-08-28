import React from "react";
import styled from "styled-components";

const Notification = styled.div`
width: 300px;
background: #2C3E50;
box-shadow: 0 3px 6px rgba(black,0.16), 0 3px 6px rgba(black,0.23);
border-top: 10px solid #2C3E50;

`

const NotificationHead = styled.div`

p {
    padding: 5px 20px;
    margin: 10px;
    color: #0B5AA2;
    font-weight: bold;
    font-size: 20px;
}
hr {
    width: 20%;
    margin: 0px 30px;
    border: 1px solid #2C3E50;
}

`


const NotificationsBody = styled.div`
padding: 10px;
margin: 10px;
display: grid;
grid-gap: 10px;

`


const NotificationsBodyContent = styled.div`
padding: 10px;
padding-right: 0px;
display: grid;
grid-template-columns: 10fr 1fr;

font-size: 13px;
grid-gap: 10px;
border: 1px solid transparent;
cursor: pointer;

i:{
    align-self: center;
    font-size: 15px;
    color: #ECEFF1;
    font-weight: bold;
    animation: icon 1.5s infinite forwards;
}

&:hover{
    border-radius: 15px;
    border: 1px solid #2C3E50;
}

`


export default function NotificationList({openNotif}:{openNotif:boolean}){



    return (
        <Notification style={{display:openNotif ? 'block':'none'}}> 
    <NotificationsBody >
      <NotificationsBodyContent >
        <span>Web Usabilty Testing</span>
        <i className="fa fa-angle-right"></i>
      </NotificationsBodyContent>
      <NotificationsBodyContent >
        <span>Design of Everyday Things</span>
        <i className="fa fa-angle-right"></i>
      </NotificationsBodyContent>
      <NotificationsBodyContent >
        <span>Practical Empathy</span>
        <i className="fa fa-angle-right"></i>
      </NotificationsBodyContent>
      <NotificationsBodyContent >
        <span>About Face: The Essentials of Interaction Design</span>
        <i className="fa fa-angle-right"></i>
      </NotificationsBodyContent>
    </NotificationsBody>
  </Notification>

      
    )
}