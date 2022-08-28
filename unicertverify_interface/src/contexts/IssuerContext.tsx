
import {createContext, useState, useContext, useEffect} from 'react'
import { WalletContext } from './WalletContext';
import { UserContext } from './UserContext';
import Issuer from "../constants/contractAbis/Issuer.json"
import { Contract } from "ethers"

export const IssuerContext = createContext<{

    threshold: number
    trustees: string[] | undefined
    toIssue: any,
    setThreshold: (_threshold:number) => void
    setTrustees : (_trustees:any) => void
    setToIssue: (applicant:any) => void
}>({
    
    threshold:2,
    trustees:[],
    toIssue:{},
    setThreshold: () => {},
    setTrustees : () => {},
    setToIssue: () => {}
})

export const IssuerContextProvider  = ({children}:any) => {

    const { address, isReady, signer} = useContext(WalletContext)
    const { issuer } = useContext(UserContext)

    const [threshold, setThreshold] = useState(2)
    const [trustees, setTrustees] = useState<string[]>()
    const [toIssue, setToIssue] = useState()
    
    useEffect(() => {

        async function getIssuerDetails (issuerAddress:string){
           
            const issuer = new Contract(issuerAddress, Issuer.abi, signer )
            const _threshold = await issuer.threshold()
            
           
            const threshold_num = _threshold.toNumber()
            let all_trustees = []
            for (let i = 0; i < threshold_num; i++ ){
                const _trustee = await issuer.trustees(i)
               
                
                all_trustees.push(_trustee._address.toLowerCase() )
                
                
            }
            
            setTrustees(all_trustees)
          
            setThreshold(threshold_num)
            
        }
        if(issuer && issuer.address){
            getIssuerDetails(issuer.address)
        }


    },[address, issuer])
    

    return <IssuerContext.Provider value={{ threshold, trustees, toIssue, setToIssue, setThreshold, setTrustees }}>{children}</IssuerContext.Provider>
    

}