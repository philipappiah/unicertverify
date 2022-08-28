import { useState } from "react";
import {useNavigate} from 'react-router-dom'



export default function Welcome() {

    const navigate = useNavigate()


    const [userType, setUserType] = useState('applicant');
   

    const updateUserType = (value:string) => {
        setUserType(value)
       
    }

    const onProceed = () => {
        if(userType){
        navigate(`/register/${userType}`)

        }
    }


    return  (
                   
                    <div className="row"  >
                        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-3 mb-2">
                            <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
                            <form id="stepform">
                                <label className="fieldlabels">Select User Type: *</label>
                                <select  onChange={(e) => updateUserType(e.target.value)} style={{ marginTop: "3px", height: "40px" }} className="form-select" aria-label="Default select example">

                                    
                                    <option value="applicant">Applicant</option>
                                    <option value="issuer">Issuer</option>
                                    

                                </select>
                            </form>

                            </div>
                            <input type="button" onClick={onProceed} name="next" className="next next-button" defaultValue="Proceed" />
                    
                        </div>
                        
                    </div>
                    
           


           
        

    )
}