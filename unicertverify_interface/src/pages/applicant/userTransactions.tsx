import React, {useEffect, useContext, useState} from "react"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { ProofReqTx } from "../../types"
import { WalletContext } from "../../contexts/WalletContext"
import styled from "styled-components"
import axios from "axios"
import { API_URL } from "../../constants"
import sigreq from "../../assets/cert.png";


const Notification = styled.div`
width: 100%;
background: #e1e1e1;
box-shadow: 0 3px 6px rgba(black,0.16), 0 3px 6px rgba(black,0.23);
border-top: 10px solid #e1e1e1;

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
    border: 1px solid #e1e1e1;
}

`


const Line = styled.div`


    width: 100%;
    margin: 0px 30px;
    border: 1px solid #0000;

`

const NotificationsBody = styled.div`
text-align: initial;
padding: 10px;
margin: 10px;
display: grid;
grid-gap: 10px;

`


const NotificationsBodyContent = styled.div`
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








export default function UserTransactions() {

    const { address } = useContext(WalletContext)

    const [transactions, setTransactions] = useState<Array<ProofReqTx>>([])




    const getUserTransactions = () => {
        axios.get(`${API_URL}/api/v1/proof_requests/applicant/?applicant=${address?.toLowerCase()}`)
        .then(function (response) {
  
            
            setTransactions(response?.data)
         
  
  
        })
        .catch(function (error) {
  
  
          console.log(error);
        })
  
        .then(function () {
  
        });


    }


    useEffect(()=>{
        getUserTransactions()
    },[address])


    return (
    

            <div className="row" >
                <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-5 mb-2">
                    <div className="card px-0 pt-4 pb-0 mt-3 mb-3">

                        <NotificationHead><p>Transactions</p></NotificationHead>

                       
                        <List sx={{ width: '100%',marginLeft:"120px", maxWidth: 520, bgcolor: 'background.paper' }}>
                                {
                                    transactions.map((tx:ProofReqTx, index:number) => (
                                        <React.Fragment key={index}>
                                        
                                        <ListItem alignItems="flex-start">
                                          <ListItemAvatar>
                                            <Avatar alt="proofReq" src={sigreq}/>
                                          </ListItemAvatar>
                                          <ListItemText
                                            primary={<React.Fragment><span >From : {tx.issuer} </span></React.Fragment>}
                                            secondary={
                                              <React.Fragment>
                                               
                                   
                                    <span >Tx Ref # : {tx.reference.toUpperCase()}</span>
                                    
                                    <br></br>
                                    <span>Signatures : {tx.signers.length }</span>
                                   
                                    <br></br>
                                    <span>Status : {tx.status}</span>
                                    <br></br>
                                

                              
                            
                                              </React.Fragment>
                                            }
                                          />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                      </React.Fragment>

                                    ))
                                }

                        </List>

                    </div>
                </div>
            </div>
       
    )
}