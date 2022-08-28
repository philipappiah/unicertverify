import React, {useEffect} from 'react';
import {isBrowser} from "react-device-detect"
import { Route,Routes, BrowserRouter as Router, HashRouter } from 'react-router-dom'
import { AppContextProvider } from './contexts/AppContext'
import { Web3ReactProvider } from './contexts/WalletContext';
import { UserContextProvider } from './contexts/UserContext';
import { ProofRequestContextProvider } from './contexts/ProofRequestContext';
import { IssuerContextProvider } from './contexts/IssuerContext';
import background from "./assets/background.jpg"


import Pages from './pages';

import Header from './components/Header'

import './App.css';

function App() {


  return (

    <Router>
     
      <Web3ReactProvider>
      <AppContextProvider>
      <UserContextProvider>
      <IssuerContextProvider>
      <ProofRequestContextProvider>
        
      <Header />
      <div className="container-fluid" style={{marginTop: "80px", marginLeft: isBrowser  ? "400px" : "0px"}} >
      <Pages/>
      </div>
     
      </ProofRequestContextProvider>
      </IssuerContextProvider>
      </UserContextProvider>
      </AppContextProvider>
      </Web3ReactProvider>
   
      
    </Router>
  
      
    
  );
}

export default App;
