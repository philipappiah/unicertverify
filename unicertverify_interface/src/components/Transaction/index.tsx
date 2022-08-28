import React, { useState, useContext } from "react";
import styled from 'styled-components'
import { AppContext } from '../../contexts/AppContext';
import {WalletContext}  from "../../contexts/WalletContext";

const txStatusButton = styled.div
`
border-radius:10px;
padding:0.4rem;
font-size:18px;
background:#E6007E;
cursor:pointer;
user-select:none;
align-items:center;

`




export default function Transaction(){

    const { txStatus } = useContext(AppContext)

 

    return (
        <div>
            {
                txStatus === "pending" && <div className="status-spinner"></div>
            }
            {
                txStatus === "submitted" && <i className="fa-solid fa-circle-check"></i>
            }
        
        </div>
    )




}