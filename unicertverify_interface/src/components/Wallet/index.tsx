import React, { useState, useContext } from "react";
import styled from 'styled-components'
import { AppContext } from '../../contexts/AppContext';
import {WalletContext}  from "../../contexts/WalletContext";

const ConnectButton = styled.div
`
border-radius:10px;
padding:0.4rem;
font-size:18px;
background:#E6007E;
cursor:pointer;
user-select:none;
align-items:center;

`



const ConnectedStatus = styled.div
`
width: 10px;
height: 10px;
margin-left: 0.5rem;
margin-top: 3px;
border-radius: 50%;
position: relative;
background-color: rgb(39, 174, 96);
display:inline-block

`

export default function Wallet(){

 
 const {chooseWallet, address, isReady, networkName} = useContext(WalletContext)


    return (
        <div>
         <ConnectButton onClick={chooseWallet}>{address && isReady ? <span style={{fontSize:"15px"}}>{networkName} <ConnectedStatus></ConnectedStatus></span> : 'CONNECT'}</ConnectButton>
        </div>
    )




}