import React,{useContext} from "react"
import {isBrowser} from "react-device-detect"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import {QRCodeSVG} from 'qrcode.react';



import sigreq from "../../assets/cert.png";

import { UserContext } from "../../contexts/UserContext"
import { ProofRequestContext } from "../../contexts/ProofRequestContext"




export default function ViewCert(){

    const {proofRequests} = useContext(ProofRequestContext)



    const [checked, setChecked] = React.useState([1]);

    const handleToggle = (value:any) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };


    return (
        <List sx={{ width: '100%', maxWidth: isBrowser ? 500 : 100, bgcolor: 'background.paper' }}>
            {
                proofRequests?.sort((a,b)=>Date.parse(b.date_awarded) - Date.parse(a.date_awarded)).map((proof, index)=>(
                    <React.Fragment key={index}>
                      <a target="_blank" rel="noopener noreferrer"
                       href={`http://localhost:3000/verifyProof/${proof.reference}`}>Click here to view Proof</a>
              <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="proof_req" src={sigreq} />
          </ListItemAvatar>
          <ListItemText
            primary={
            <React.Fragment>
               <Typography
                sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  <span>Reference # {proof.reference}: </span><br/>
                  <span>Issued By : {proof.issuer}</span><br/>
                  <span>Degree Name : {proof.deg_name}</span><br/>
                  <span>Course Name : {proof.course}</span><br/>
                  <span>Awarded on : {proof.date_awarded}</span><br/>
                  
                  <span ><QRCodeSVG value={`http://localhost:3000/verifyProof/${proof.reference}`} /></span>
                  
                </Typography>
                
            </React.Fragment>}
            secondary={
              <React.Fragment>
               
               
                <Checkbox
                edge="end"
                
              />
                

                
              </React.Fragment>
            }
          />

        
        </ListItem>
        <Divider variant="inset" component="li" />
        
                    </React.Fragment>

                ))
            }
       
      
      </List>
    )


}