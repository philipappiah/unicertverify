import React, {useEffect, useContext, useState} from "react"
import {  useNavigate, useParams } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { ProofReqTx } from "../../types"

import { WalletContext } from "../../contexts/WalletContext"
import { UserContext } from "../../contexts/UserContext"
import { IssuerContext } from "../../contexts/IssuerContext"
import { getIssuerIssuedProofs } from "../../APIs";
import sigreq from "../../assets/cert.png";

import {  Layover, Spinner, NotificationHead} from "../../components/Styles"


export default function TrusteesList() {

    const navigate = useNavigate()
    const {status} = useParams()
    const { address, signer, wallet } = useContext(WalletContext)
    const { issuer, userDetail, isDualUser } = useContext(UserContext)
    const { threshold, trustees, setToIssue } = useContext(IssuerContext)
    
    const [proofReqs, setproofReqs] = useState(Array<ProofReqTx>)
    const [isLoading, setLoading] = useState(true)




    const addProofAndSign = (index:number) => {

      navigate(`/issuerReqList/issueProof/${proofReqs[index].applicant}`)
    }



    const getIssuerReqList = () => {

      
        getIssuerIssuedProofs(issuer?.address, status?.toUpperCase() || "ISSUED")
        .then(function (response) {
           
         let res = response.data
         res.map((req:ProofReqTx)=>{
         
          if(!req.signers.includes(address?.toLowerCase())){
            req.requiresApproval = true
          }
         })
            
          setproofReqs(response?.data)

          setLoading(false)
         
  
  
        })
        .catch(function (error) {

            setLoading(false)
  
  
          console.log(error);
        })
  


    }


    useEffect(()=>{
        if(issuer && issuer.address){
          getIssuerReqList()
        }

     
    },[issuer, userDetail])

    

    return isLoading ? <Layover><Spinner /></Layover>:
    
    (
       
          
            <div className="row" >
                <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-5 mb-2">
                    <div className="card px-0 pt-4 pb-0 mt-3 mb-3">

                        <NotificationHead><p>Trustees List</p></NotificationHead>
                        <Fab color="primary" aria-label="add">
                         <AddIcon />
                        </Fab>


                        <List sx={{ width: '100%',marginLeft:"120px", maxWidth: 500, bgcolor: 'background.paper' }}>
                                {
                                    proofReqs.map((tx:ProofReqTx, index) => (
                                        <React.Fragment key={index}>
                                        
                                        <ListItem alignItems="flex-start">
                                          <ListItemAvatar>
                                            <Avatar alt="proofReq" src={sigreq}/>
                                          </ListItemAvatar>
                                          <ListItemText
                                            primary={<React.Fragment><span >To : {tx.applicant} </span></React.Fragment>}
                                            secondary={
                                              <React.Fragment>
                                               
                                   
                                    <span >Tx Ref # : {tx.reference.toUpperCase()}</span>
                                    
                                    <br></br>
                                    <span>Signatures : {tx.signers.length }</span>
                                   
                                    <br></br>
                                    <span>Status : {tx.status}</span>
                                    <br></br>
                                    <Fab color="primary" aria-label="add">
                                    <DeleteIcon />
                                    </Fab>
                                

                                     {
                                        tx.requiresApproval &&
                                        <div>
                                        <span>Action: Requires your approval </span>
                                        <br/><br/>
                                        <span style={{cursor:"pointer"}} onClick={()=>addProofAndSign(index)}>Add proof and Sign <i className="fa fa-pencil"></i></span>
                                        </div>
                                       
                                     }
                                        
                              
                            
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