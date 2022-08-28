import {createContext, useState, useEffect, useContext} from 'react'
import { ProofReqTx } from '../types'
import { UserContext } from './UserContext'
import { WalletContext } from './WalletContext'
import { getApplicantProofReq } from '../APIs'


export const ProofRequestContext = createContext<{
    proofRequests?:Array<ProofReqTx>
    setProofRequests: (_request:any) => void
  
}>({
   
    setProofRequests: () => {}
})



export const ProofRequestContextProvider  = ({children}:any) => {

    const {address} = useContext(WalletContext)
    const {} = useContext(UserContext)

    const [proofRequests, setProofRequests] = useState<Array<ProofReqTx>>([])
    


    useEffect(()=>{
        if(address){
            getApplicantProofReq(address,"").then(res=>{
                
                setProofRequests(res.data)

            }).catch(err=>{
                console.log(err)
            })
        }
    }, [address])
    

    





    return <ProofRequestContext.Provider value={{ proofRequests, setProofRequests}}>{children}</ProofRequestContext.Provider>
    

}