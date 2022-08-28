import React, { useContext, useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'

import ApplicantDashboard from "./applicant";
import IssuerDashboard from "./issuer";
import { UserContext } from "../contexts/UserContext";
import { WalletContext } from "../contexts/WalletContext";






export default function DualUser() {

    const navigate = useNavigate()

    const { address, isReady } = useContext(WalletContext)
    const {setValidUser, setUserType, setDualUser} = useContext(UserContext)
    const [userType, setUser] = useState('applicant');
    const [proceed, setProceed] = useState(false)

    const updateUserType = (value:string) => {
        setUser(value)
       
        setProceed(false)
    

    }

    const onProceed = () => {
        setValidUser(true)
        localStorage.setItem('userType',userType)
        setProceed(true)
        setUserType(userType)
        setDualUser(false)
        navigate('/dashboard')

    }


   



    return (

        <div>
            
            {!proceed &&

                <div  >
                   
                    <div className="row" >
                        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-3 mb-2">
                            <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
                            <form id="stepform">
                                <label className="fieldlabels">Login as : </label>
                                <select onChange={(e) => updateUserType(e.target.value)} style={{ marginTop: "3px", height: "40px" }} className="form-select" aria-label="Default select example">

                                    
                                    <option value="applicant">Applicant</option>
                                    <option value="issuer">Issuer</option>
                                   

                                </select>
                            </form>

                            </div>
                            <input type="button" onClick={onProceed} name="next" className="next next-button" defaultValue="Proceed" />
                    
                        </div>
                        
                    </div>
                    
                </div>


            }
            <div>
           

            
            </div>
        </div>

    )
}