import React, {useEffect, useContext, useState} from "react"
import { ProofReqTx } from "../../types"
import { WalletContext } from "../../contexts/WalletContext"
import { UserContext } from "../../contexts/UserContext"
import styled from "styled-components"
import axios from "axios"
import { API_URL } from "../../constants"


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








export default function IssuerTransactions() {

    const { address } = useContext(WalletContext)
    const { issuer, userDetail, isDualUser } = useContext(UserContext)
    
    const [transactions, setTransactions] = useState<Array<ProofReqTx>>([])




    const getUserTransactions = () => {
        axios.get(`${API_URL}/api/v1/proof_requests/issuer/?issuer=${issuer?.address}`)
        .then(function (response) {
  
            console.log(response)
            setTransactions(response?.data)
         
  
  
        })
        .catch(function (error) {
  
  
          console.log(error);
        })
  
        .then(function () {
  
        });


    }


    useEffect(()=>{
        if(issuer && issuer.address){
        getUserTransactions()
        }
    },[issuer, userDetail])


    return (
        <div className="container-fluid" >

            <div className="row justify-content-center" >
                <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-5 mb-2">
                    <div className="card px-0 pt-4 pb-0 mt-3 mb-3">

                        <NotificationHead><p>Transactions</p></NotificationHead>


                        <Notification >
                            <NotificationsBody >
                                {
                                    transactions.map((tx:ProofReqTx, index) => (
                                        <div key={index}>
                                              <hr/>
                                <NotificationsBodyContent >
                                    <span >Tx Type : Proof Request</span>
                                    <br></br>
                                    <span >Tx Ref # : {tx.reference.toUpperCase()}</span>
                                    <br></br>
                                    <span>Issuer : {tx.issuer}</span>
                                    <br></br>
                                    <span>Signatures : {tx.signers.length }</span>
                                   
                                    <br></br>
                                    <span>Status : {tx.status}</span>
                                    
                                    <i className="fa fa-angle-right"></i>
                                </NotificationsBodyContent>
                                        </div>

                                    ))
                                }
                               
                              
                               
                               
                          
                            </NotificationsBody>
                        </Notification>


                    </div>
                </div>
            </div>
        </div>
    )
}