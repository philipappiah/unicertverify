import React, {useContext, useEffect, useState} from "react";

import { Route,Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom'
import { WalletContext } from "../contexts/WalletContext";

import { UserContext } from "../contexts/UserContext";

import IssueProof from "./issuer/issueProof";

import Applicant from "./registration/applicant";
import Issuer from "./registration/issuer";

import ApplicantDashboard from "./applicant";
import Welcome from "./welcome";
import CreateRequest from "./applicant/createRequest";
import DualUser from "./dualUser";
import UserTransactions from "./applicant/userTransactions";
import IssuerTransactions from "./issuer/issuerTransactions";
import IssuerReqList from "./issuer/requestList";
import IssuerDashboard from "./issuer";
import ViewCert from "./applicant/viewCert";
import VerifyProof from "./verifier/verifyProof";
import IssuersList from "./issuer/issuerList";
import TrusteesList from "./issuer/trusteesList";
import { Layover, Spinner} from "../components/Styles"



const PrivateRoute = ( props:any ) => {
  const { children, isAuth } = props
 
  const location = useLocation()


  return isAuth ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}


const ToDashboard = ( props:any ) => {
  const { children, isAuth } = props
 
  const location = useLocation()


  return isAuth ? (
    <Navigate
      replace={true}
      to="/dashboard"
      state={{ from: `${location.pathname}${location.search}` }}
    />
   
  ) : (
    <>{children}</>
  )
}




export default function Pages(){

 

  let existingUser = localStorage.getItem("userType")
  const { address, isReady, signer} = useContext(WalletContext)
  const {isValidUser,userType,getUser, getUserCert, isDualUser, userDetail, setUserDetail, setCertExist, isLoading} = useContext(UserContext)


  
  



  useEffect( () =>{
    if(address){
      getUser(address)

    }

  },[address, userType])



  if(!address){
    return(
    <Routes>
    <Route path="/" element={<Welcome/>} />
    <Route path="/verifyProof/:proofId" element={<VerifyProof/>}/>
    <Route path="/issuersList" element={<IssuersList/>} />
    </Routes>
    )
  }


    if(isLoading ){
      return <Layover><Spinner /></Layover>
    }


   
  


   

   if(isReady && address && isValidUser && isDualUser){
    return <DualUser/>
   }




   
   

   
  

    return (
     
        

     <Routes>

    

     <Route path="/" element={<ToDashboard isAuth={isValidUser}><Welcome/></ToDashboard>} />
     
     <Route path="/dashboard" element={<PrivateRoute isAuth={isValidUser}>{
     userType === "applicant"   ? <ApplicantDashboard/> : userType === "issuer" 
     ? <IssuerDashboard/> :<div></div>}
     </PrivateRoute>}/>
     
     
     
     
     <Route path="/register/issuer" element={<Issuer/>} />
     <Route path="/register/applicant" element={<Applicant/>} />
     <Route path="/issuersList" element={<IssuersList/>} />
     <Route path="/verifyProof/:proofId" element={<VerifyProof/>}/>

      
  
      <Route path="/createRequest" element={<PrivateRoute isAuth={isValidUser}><CreateRequest/></PrivateRoute>} />
      <Route path="/userTx" element={<PrivateRoute isAuth={isValidUser}><UserTransactions/></PrivateRoute>} />
      <Route path="/orgTx" element={<PrivateRoute isAuth={isValidUser}><IssuerTransactions/></PrivateRoute>} />
      <Route path="/viewCert" element={<PrivateRoute isAuth={isValidUser}><ViewCert/></PrivateRoute>} />
      <Route path="/trusteesList" element={<PrivateRoute isAuth={isValidUser}><TrusteesList/></PrivateRoute>} />

      <Route path="/issuerReqList/:status" element={<PrivateRoute isAuth={isValidUser}><IssuerReqList/></PrivateRoute>} />
      <Route path="/issuerReqList/issueProof/:applicant" element={<PrivateRoute isAuth={isValidUser}><IssueProof/></PrivateRoute>}/>
      
    
      </Routes>
      
      

    )
}