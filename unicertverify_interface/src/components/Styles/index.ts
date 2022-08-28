
import styled, {keyframes} from "styled-components"



export const Layover = styled.div
`
background-color: rgba(0, 35, 82, 0.7);
display: block;
height: 100%;
left: 0;
overflow: auto;
position: fixed;
top: 0;
width: 100%;
z-index:20;
`



export const spin = keyframes`
0% {
transform: rotate(0deg);
}
100% {
transform: rotate(360deg);
}
`

export const Spinner = styled.div`
position: absolute;
left:50%;
top:30%;
display: inline-block;
width: 80px;
height: 80px;
&:after {
content: " ";
display: block;
width: 40px;
height: 40px;
margin: 8px;
border-radius: 50%;
border: 6px solid #fff;
border-color: #fff transparent #fff transparent;
animation: ${spin} 1.2s linear infinite;
}
`


export const Notification = styled.div`
width: 100%;
background: #e1e1e1;
box-shadow: 0 3px 6px rgba(black,0.16), 0 3px 6px rgba(black,0.23);
border-top: 10px solid #e1e1e1;

`

export const NotificationHead = styled.div`

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
  border: 1px solid #e1e1e1;
}

`


export const Line = styled.div`


  width: 100%;
  margin: 0px 30px;
  border: 1px solid #0000;

`

export const NotificationsBody = styled.div`
text-align: initial;
padding: 10px;
margin: 10px;
display: grid;
grid-gap: 10px;

`


export const NotificationsBodyContent = styled.div`
padding: 5px;
padding-right: 0px;
display: grid;
grid-template-columns: 10fr 1fr;

font-size: 13px;
grid-gap: 10px;
border: 1px solid transparent;
cursor: pointer;

i:{
  align-self: center;
  font-size: 20px;
  color: #ECEFF1;
  font-weight: bold;
  animation: icon 1.5s infinite forwards;
}

&:hover{
  border-radius: 15px;
  border: 1px solid #2C3E50;
}

`

export const DashedLine = styled.div `
margin:5px 0;
height:2px;
background:
repeating-linear-gradient(to right,black 0,black 5px,transparent 5px,transparent 7px)

`

