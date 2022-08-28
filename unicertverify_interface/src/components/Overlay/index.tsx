import React, { useContext } from "react";
import styled from 'styled-components'
import Providers from '../Wallet';
import { WalletContext } from "../../contexts/WalletContext";


const Layover = styled.div
`width: 100%;
height: 100vh;
background-color: rgba(0, 35, 82, 0.7);
position: absolute;
top: 80px;
left: 0;
z-index:20
`

const ConnectButton = styled.div
`
margin:0 auto;
margin-top:200px;
display:block;

width:fit-content;

cursor:pointer;
color:#fff;
border-radius:10px;
padding:0.5rem;
font-size:18px;
background:#E6007E;
cursor:pointer;
user-select:none;
align-items:center;

`




export default function Overlay() {

    const { chooseWallet } = useContext(WalletContext)

    return (
        <Layover>
            <ConnectButton onClick={chooseWallet}>CONNECT WALLET</ConnectButton>
        </Layover>
    )

}





