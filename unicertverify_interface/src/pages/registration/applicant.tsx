import React, {useState, useContext} from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { API_URL } from "../../constants";
import { WalletContext } from "../../contexts/WalletContext";
import { UserContext } from "../../contexts/UserContext";
import { Layover,Spinner } from "../../components/Styles";








export default function Applicant(){

    

    const navigate = useNavigate()

    const  {address} = useContext(WalletContext)
    const { setUserType, setValidUser, setUserMsg} = useContext(UserContext)





  // step 1
  const [name, setname] = useState('')

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paddress, setPAddress] = useState(address)
  const [isLoading, setLoading] = useState(false)

  const submitForm = () => {

    

    if (address) {
      setLoading(true)
    axios.post(`${API_URL}/api/v1/applicants/`, {
      address:paddress?.toLowerCase(),
      fullname:name,
     
      email,
      phone,
    


    },{
      headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(function (response) {
      setLoading(false)
      setUserType("applicant")
      setUserMsg("Account created successfully")
      setValidUser(true)
      navigate('/dashboard')
    })
    .catch(function (error) {
      setLoading(false)
      console.log(error);
    });


  }

  }
  

    return(
        <div >
          {isLoading &&   <Layover><Spinner/></Layover>}
         
        <div className="row">
          <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-5 mb-2">
            <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
          
              <h2 id="heading">Set Up Your Account</h2>
  
              <form id="stepform">
              
                  <fieldset>
                    <div className="step">
                    
  
                      <div className="row">
                        <div className="col-12">
  
                          <label className="fieldlabels"> Full Name: *</label>
                          <input required type="text" onChange={(e) => setname(e.target.value)} name="full_name" placeholder="Full Name" />

  
                          <label className="fieldlabels"> Address: EOA *</label>
                          <input required onChange={(e) => setPAddress(e.target.value)} defaultValue={address} type="p_address" name="p_address" placeholder="Address" />
  
                         
                          <label className="fieldlabels">Email: *</label>
                          <input required onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="Email" />
  
                          <label className="fieldlabels">Phone Number: *</label>
                          <input required onChange={(e) => setPhone(e.target.value)} type="text" name="phone" placeholder="Phone Number" />
                        </div>
  
                      </div>
  
                    </div> <input type="button" onClick={submitForm} name="submit" className="next next-button" defaultValue="Proceed" />
                  </fieldset>
  
                
  
                
  
  
              </form>
            </div>
          </div>
        </div>
      </div>
    )
}