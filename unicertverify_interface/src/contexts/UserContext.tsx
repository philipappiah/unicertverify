import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import axios from 'axios'
import { API_URL } from "../constants"
import { WalletContext } from './WalletContext'
import { UserDetail, IssuerType } from '../types'





export const UserContext = createContext<{
  isValidUser: boolean
  userType: string
  userMsg: string
  userDetail: UserDetail
  isDualUser: boolean,
  certExist:boolean,
  isLoading:boolean,
  issuer?:IssuerType,
  setCertExist: (exist:boolean) => void
  setUserDetail: (userdetails: any) => void
  setUserMsg: (msg: string) => void
  setValidUser: (valid: boolean) => void
  setUserType: (usertype: string) => void
  getUser: (address: string) => void
  getUserCert: (applicantAddr:string) => Promise<string | undefined>
  setDualUser: (valid:boolean) => void
  setLoading: (valid:boolean) => void

}>({
  isValidUser: false,
  userType: "",
  isLoading: true,
  userMsg: "",
  userDetail: { address: '', fullname: '', email: '', phone: '', is_trustee: false, certificate:''},
  isDualUser: false,
  certExist:false,
 
  setCertExist:() => {},
  setUserDetail: () => { },
  setUserMsg: () => { },
  setValidUser: () => { },
  setUserType: () => { },
  getUser: () => { },
  getUserCert: async () => undefined,
  setDualUser: () => { },
  setLoading: () => {}
})



export const UserContextProvider = ({ children }: any) => {




  const [isValidUser, setValidUser] = useState(false)
  const [userMsg, setUserMsg] = useState("");
  const [userType, setUserType] = useState("")
  const [userDetail, setUserDetail] = useState({ address: '', fullname: '', email: '', phone: '', is_trustee: false, certificate:'' })
  const [certExist, setCertExist] = useState(false)
  const [isDualUser, setDualUser] = useState(false)
  const [isDual, setDual] = useState(false)
  const [isLoading, setLoading] = useState(true)
  
  const [issuer, setIssuer] = useState<IssuerType>()

  
 const getIssuer = (userAdd:string) => {

  axios.get(`${API_URL}/api/v1/issuer/${userAdd.toLowerCase()}/`)
  .then(function (response) {


   
    
    if(response?.data){

    setIssuer(response?.data)

    }
  

  
  })

} 




  const getUser = (address: string) => {
    

    let existingUser = localStorage.getItem('userType')
  
    axios.get(`${API_URL}/api/v1/applicant/${address.toLowerCase()}`)
      .then(function (response) {
       
    
        
        if(response.data){
          
          if(existingUser){

            setUserType(existingUser)
            setValidUser(true)

          }else{
            if(response.data.is_trustee){
             
              setDualUser(true)
              setValidUser(true)
              
            }else{
              setUserType('applicant')
              setValidUser(true)
            }

          }
          

          
          
          setLoading(false)
          let userObj = response.data
          getIssuer(userObj.issuer)
          setUserDetail(userObj)
          getUserCert(userObj.address).then(cert =>{

          userObj.certificate = cert
          setUserDetail(userObj)
          setCertExist(true)
          

        }).catch(err=>{
          
          
         
          setLoading(false)
          console.log(err)

        })
        
        }

       
        
        
      })
      .catch(function (error) {

        setLoading(false)
        console.log(error);
      })
      .then(function () {

      });


  }


  const getUserCert = async (applicantAddr:string) => {
    const response = await axios.get(`${API_URL}/api/v1/certificates/applicant/?applicant=${applicantAddr.toLowerCase()}`)
    
    if(response && response.data){
      return response.data.address
    }
    
   

  }


  return (
  <UserContext.Provider 
    value={{ 
      isValidUser, 
      setValidUser, 
      userType, 
      setUserType, 
      userMsg, 
      setUserMsg,
      userDetail,
      setUserDetail,
      getUser,
      isDualUser,
      setDualUser,
      getUserCert,
      certExist,
      setCertExist,
      issuer,
      isLoading,
      setLoading
    }}>{children}</UserContext.Provider>)


}