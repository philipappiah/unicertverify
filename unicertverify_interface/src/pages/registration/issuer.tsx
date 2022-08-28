import React, { useEffect, useState, useContext} from 'react'


import { UserContext } from "../../contexts/UserContext";
import { Layover,Spinner } from "../../components/Styles";

import {useNavigate} from 'react-router-dom'

import { WalletContext } from '../../contexts/WalletContext';
import { AppContext } from '../../contexts/AppContext';

import { deployContract } from '../../utils/deploy';
import IssuerContract from "../../constants/contractAbis/Issuer.json";

import axios from "axios";
import { API_URL } from "../../constants";

import styled ,{ keyframes } from "styled-components";

declare global {

  interface FormData {
    append(name: string, value: any, fileName?: string): void;
    set(name: string, value: any, fileName?: string): void;
  }
}


const Processing = styled.div
`
position: absolute;
color:#fff;
left:38%;
top:40%;
display: inline-block;
`





export default function Issuer() {


  const navigate = useNavigate()
  const {signer, address } = useContext(WalletContext)
  const { setTransaction } = useContext(AppContext)
  const { setUserType, setValidUser, setUserMsg} = useContext(UserContext)

  const [current, setCurrent] = useState(1)

  const [isLoading, setLoading] = useState(false)

  const [deployState, setDeployState] = useState("started")
  const [submitState, setSubmitState] = useState("started")


  // step 1
  const [name, setName] = useState('')
  const [type, setType] = useState('university_or_college')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [locaddress, setLocAddress] = useState('')
  const [country, setCountry] = useState('United Kingdom')
  const [zipCode, setZipCode] = useState('')
  const [telephone, setTelephone] = useState('')

  // step 2
  const [trustees, setTrustees] = useState(2)
  const [size, setSize] = useState("0-10");
  const [trusteeDetails, setTrusteeDetails] = useState([{ name: '', email: '', position: '', address: '' }])


  //step 3
  const [docs, setdocs] = useState([Object])
 
  const [logo, setLogo] = useState(null)

  //step 4
  const [termsAgreed, setTermsAgreement] = useState(false)
  const [gdprAgreed, setGDPRAgreement] = useState(false)



  const submitForm = () => {
    setLoading(true)
    setSubmitState("processing")
    setDeployState("processing")
   

    let _trustees = trusteeDetails.map(t => t.address)
  
    deployContract(IssuerContract.abi, IssuerContract.bytecode, [_trustees, _trustees.length], signer).then(contract=>{
      setDeployState("submitted")
      setTransaction({tx:contract.deployTransaction.hash, status:'success'})

      var formData = new FormData()
     

    formData.append("address",contract.address.toLowerCase())
    formData.append("name",name)
    formData.append("email",email)
    formData.append("website",website)
    formData.append("type",type)
    formData.append("location_address",locaddress)
    formData.append("country",country)
    formData.append("zipcode",zipCode)
    formData.append("telephone",telephone)
    formData.append("admin",address)
    
    formData.append("size",size)
   
   
    console.log(trusteeDetails, docs)

    formData.append("trusteeDetails",JSON.stringify(trusteeDetails))

    for (let i = 0; i < docs.length; i++){
      formData.append("verify_docs",docs[i])
    }
    
   

  
   
    formData.append("logo",logo)
    formData.append("terms_agreed",JSON.stringify(termsAgreed))
    formData.append("gdpr_agreed",JSON.stringify(gdprAgreed))
    
    

  

    axios.post(`${API_URL}/api/v1/issuers/`, formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
    }
    })
    .then(function (response) {
      setSubmitState("submitted")
      setUserType("issuer")
      setValidUser(true)
      setTimeout(()=> setLoading(false), 1000)
      setTimeout(()=>navigate('/dashboard'), 1500)
      
      

    }).catch((err:any) => {
      console.log(err)
      setDeployState("started")
      setLoading(false)

    })
     
    }).catch((err:any)=>{
      console.log(err)
      setDeployState("started")
      setLoading(false)
    })

  }



  const addTrustee = (i: number, value: string, key: string) => {
    let newTrustees = trusteeDetails
    if (newTrustees.length < i) {
      newTrustees.push({ name: '', email: '', position: '', address: '' })
    }
    if (key === 'name') newTrustees[i - 1].name = value;
    if (key === 'email') newTrustees[i - 1].email = value;
    if (key === 'position') newTrustees[i - 1].position = value;
    if (key === 'address') newTrustees[i - 1].address = value.toLowerCase();
    setTrusteeDetails(newTrustees)
  }

  const setIssuerSize = (value: string) => {
    setSize(value)
  }


  const uploadIssuerDocs = (e: any) => {

    for (let i = 0; i < e.target.files.length; i++){
      setdocs(prev => [...prev, e.target.files[i]])
     

    }
   
  }



  const uploadLogo = (e:any) => {
   
    setLogo(e.target.files[0])

  }


  const setTermsChange = (e: any) => {
    setTermsAgreement(e.target.checked)

  }

  const setGDPRTermsChange = (e: any) => {

    setGDPRAgreement(e.target.checked)

  }


  return (
    <div  >
       {isLoading &&   
       <Layover>
        <Spinner/>
        <Processing >
          <table style={{borderCollapse:"collapse"}}>
            <tbody>
            <tr style={{margin:"20px"}}>
              <td><h5> DEPLOYING CONTRACT</h5></td>
              <td>
                
                <i className={ deployState === 'processing' ? 'fa fa-hourglass' : deployState === "submitted" ? 'fa fa-check-circle':'fa fa-times-circle' } 
                
                style={{color:"#fff", fontSize:"40px", marginLeft:"10px"}}> </i></td>
            </tr>
            
            <tr style={{margin:"20px"}}>
              <td><h5> DETAILS SUBMITTED</h5></td>
              <td><i className={ submitState === 'processing' ? 'fa fa-hourglass' : deployState === "submitted" ? 'fa fa-check-circle':'fa fa-times-circle' } 
                
                style={{color:"#fff", fontSize:"40px", marginLeft:"10px"}}> </i></td>
            </tr>
            </tbody>
          </table>
        
       
        </Processing>

       
       
       </Layover>}


      <div className="row" >
        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-3 mb-2">
          <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
        
            <h2 id="heading">Sign Up Your Issuer Account</h2>

            <form id="stepform">
              {/* progressbar */}
              <ul id="progressbar">
                <li className={`${current === 1 ? 'active' : 'account'}`} id="account"><strong>Account</strong></li>
                <li className={`${current === 2 ? 'active' : 'personal'}`} id="personal"><strong>Requirements</strong></li>
                <li className={`${current === 3 ? 'active' : 'payment'}`} id="payment"><strong>Documents</strong></li>
                <li className={`${current === 4 ? 'active' : 'confirm'}`} id="confirm"><strong>Agreements</strong></li>
              </ul>

              {
                current === 1 &&
                <fieldset>
                  <div className="step">
                    <div className="row">
                      <div className="col-5">
                        <h2 className="fs-title">Issuer Information:</h2>
                      </div>
                      <div className="col-5">
                        <h2 className="steps">Step 1 - 4</h2>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">

                        <label className="fieldlabels"> Name: *</label>
                        <input required type="text" defaultValue={name} onChange={(e) => setName(e.target.value)} name="Issuer_name" placeholder="Issuer Name" />

                        <label className="fieldlabels"> Issuer Type: *</label>
                        <select onChange={(e) => setType(e.target.value)} defaultValue={type} style={{ marginTop: "3px", height: "40px" }} className="form-select" >

                        <option value="university_or_college">University / College</option>
                        <option value="high_school">High School</option>
                        <option value="basic_school">Basic School</option>
                        <option value="large_business">Large Business</option>
                        <option value="medium_business">Medium Business</option>
                        <option value="small_business">Small Business</option>
                        <option value="other">Other</option>
                          </select>
                       
                        <label className="fieldlabels">Email: *</label>
                        <input required defaultValue={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="Issuer Email" />

                        <label className="fieldlabels">Website: *</label>
                        <input required defaultValue={website} onChange={(e) => setWebsite(e.target.value)} type="text" name="website" placeholder="Issuer Website" />
                      </div>



                      <div className="col-6">

                        <label className="fieldlabels">Area Address: *</label>
                        <input required defaultValue={locaddress} onChange={(e) => setLocAddress(e.target.value)} type="loc_address" name="loc_address" placeholder="Area or Location Address" />

                        <label className="fieldlabels">Country: *</label>
                        <select onChange={(e) => setCountry(e.target.value)} defaultValue={country} style={{ marginTop: "3px", height: "40px" }} className="form-select" >

                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Germany">Germany</option>
                        <option value="United States of America">United States of America</option>
                        <option value="Canada">Canada</option>
                        <option value="France">France</option>
                        <option value="China">China</option>
                        </select>

                        <label className="fieldlabels">Zip Code: *</label>
                        <input defaultValue={zipCode} required onChange={(e) => setZipCode(e.target.value)} type="text" name="zip_code" placeholder="Issuer ZipCode" />

                        <label className="fieldlabels">Telephone: *</label>
                        <input required defaultValue={telephone} onChange={(e) => setTelephone(e.target.value)} type="text" name="telephone" placeholder="Issuer Telephone" />

                      </div>
                    </div>

                  </div> <input type="button" onClick={() => setCurrent(current + 1)} name="next" className="next next-button" defaultValue="Next" />
                </fieldset>

              }

              {
                current === 2 && <fieldset>
                  <div className="step">
                    <div className="row">
                      <div className="col-5">
                        <h2 className="fs-title">Requirements:</h2>
                      </div>
                      <div className="col-5">
                        <h2 className="steps">Step 2 - 4</h2>
                      </div>
                      <b>Certificate Issuance require a minimum of 2 and a maximum of 6 Trustess from the Issuer</b>
                      <b>Before a certificate is issued or modified, all trustees must approve by appending their signatures.</b>

                    </div>

                    <div className='row'>
                      <div className='col-6'>

                        <label className="fieldlabels">No. of trustees: *</label>
                        <select onChange={(e) => setTrustees(Number(e.target.value))} defaultValue={trustees} style={{ marginTop: "3px", height: "40px" }} className="form-select" >

                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </select>



                      </div>
                      <div className='col-6'>

                        <label className="fieldlabels">Company Size *</label>
                        <select onChange={(e) => setIssuerSize(e.target.value)} defaultValue={size} style={{ marginTop: "3px", height: "40px" }} className="form-select" >

                          <option value="0-10">0-10</option>
                          <option value="10-50">0-50</option>
                          <option value="50-100">0-100</option>
                          <option value="100-more">100 or more</option>
                        </select>

                      </div>
                    </div>
                    {
                      Array.from({ length: trustees }, (v, k) => (

                        <div key={k + 1}>
                          <h4>Trustee {k + 1} details</h4>
                          <div className='row' >

                            <div className='col-6'>
                              <label className="fieldlabels">Full Name: *</label>
                              <input required defaultValue={trusteeDetails[k]?.name} onChange={(e) => addTrustee(k + 1, e.target.value, 'name')} type="text" name="fname" placeholder="Full Name" />

                              <label className="fieldlabels">Job Title / Position: *</label>
                              <input required defaultValue={trusteeDetails[k]?.position} onChange={(e) => addTrustee(k + 1, e.target.value, 'position')} type="text" name="job_title" placeholder="Job Title or Position" />
                            </div>

                            <div className='col-6'>
                              <label className="fieldlabels">Email.: *</label>
                              <input required defaultValue={trusteeDetails[k]?.email} onChange={(e) => addTrustee(k + 1, e.target.value, 'email')} type="email" name="t_email" placeholder="Email" />
                              <label className="fieldlabels">Public Address: *  <a target="_blank" rel="noopener noreferrer" href='https://codehs.com/tutorial/jkeesh/how-to-set-up-an-ethereum-wallet-on-metamask'>Get one ?</a></label>
                              <input required defaultValue={trusteeDetails[k]?.address} onChange={(e) => addTrustee(k + 1, e.target.value, 'address')} type="text"  name="p_address" placeholder="Public address e.g 0xF1a39D256959aa5E97784200f91cE63501dbD940" />
                            </div>
                          </div>
                        </div>

                      ))
                    }

                  </div> <input type="button" onClick={() => setCurrent(current + 1)} name="next" className="next next-button" defaultValue="Next" />
                  <input type="button" onClick={() => setCurrent(current - 1)} name="previous" className="previous previous-button" defaultValue="Previous" />

                </fieldset>

              }

              {
                current === 3 && <fieldset>
                  <div className="step">
                    <div className="row">
                      <div className="col-5">
                        <h2 className="fs-title">Documents Verification:</h2>

                      </div>



                      <div className="col-5">
                        <h2 className="steps">Step 3 - 4</h2>
                      </div>
                      <div className='col-12'>
                        <b>Note: Your Issuer must be recognized a certification body by  </b>
                        <b> a recognized Accreditation Body or a recognized Quality Assurance Agency .</b>
                        <br />
                      
                     
                        <br />
                        <b>You are required to upload Issuer verification documents.</b>
                        <b>Once verified, you can continue to use the application.</b>
                        <b>You may combine multiple documents into a single pdf file</b>

                        <br />
                        <br />
                        <span>In the <b>first upload field.</b> you are required to submit any supporting documents for the Issuer .</span>
                        <br />
                        <br />
                        <span> in the <b>second upload field</b>, you can upload the organisation logo </span>
              

                       

                        
                        <br />
                        <br />


                      </div>

                    </div> <label className="fieldlabels">Upload Issuer Documents: *</label>
                    <input multiple onChange={(e) => uploadIssuerDocs(e)} type="file" name="pic" accept="image/*" />
                    
                    <label className="fieldlabels">Upload Issuer Logo (Optional):</label> <input type="file" onChange={(e) => uploadLogo(e)} name="pic" accept="image/*" />
                  </div> 
                  
                  <input type="button" name="next" onClick={() => setCurrent(current + 1)} className="next next-button" defaultValue="Next" />
                  <input type="button" onClick={() => setCurrent(current - 1)} name="previous" className="previous previous-button" defaultValue="Previous" />
                </fieldset>

              }

              {
                current === 4 &&
                <fieldset>
                  <div className="step">
                    <div className="row">
                      <div className="col-5">
                        <h2 className="fs-title">Finish:</h2>
                      </div>
                      <div className="col-5">
                        <h2 className="steps">Step 4 - 4</h2>
                      </div>
                    </div> <br /><br />
                    <b> Unicert takes issues of Data Protection very serious. In view of this, all stakeholders and contributors</b>
                    <b> are required to sign and agree to the EU GDPR Data Protection Act. Implementations vary from country to country </b>
                    <b>however, the frameworks remain consistent across. </b>
                    <b>All developments related to this work are made in compliance with the EU GDPR Data Protection Act</b>


                    <br />
                    <br />
                    <b>Learn more about the <a href='https://gdpr-info.eu/'>EU General Data Protection Regulation - GDPR</a></b>
                    <br />
                    <br />
                    <br />


                    <div className='row'>
                    <div className='col-8'>
                        <label className="fieldlabels">I have read and accepted the terms and conditions*</label>
                      </div>
                      <div className='col-4'>
                        <input style={{ cursor: "pointer" }} onChange={(e) => setTermsChange(e)} type="checkbox" id="terms_acceptance" name="terms_and_conditions" />
                      </div>
                    
                    </div>

                    <div className='row'>
                    <div className='col-8'>
                        <label className="fieldlabels">I have read and accepted the EU General Data Protection Regulation - GDPR*</label>
                      </div>
                      <div className='col-4'>
                        <input style={{ cursor: "pointer" }} onChange={(e) => setGDPRTermsChange(e)} type="checkbox" id="gdpr_terms_acceptance" name="gdpr_terms_acceptance" />
                      </div>
                     
                    </div>

                    {/* <h2 className="purple-text text-center"><strong>SUCCESS !</strong></h2> <br />
                    <div className="row justify-content-center">
                      <div className="col-3"> <img src="https://i.imgur.com/GwStPmg.png" className="fit-image" /> </div>
                    </div> <br /><br />
                    <div className="row justify-content-center">
                      <div className="col-5 text-center">
                        <h5 className="purple-text text-center">You Have Successfully Signed Up</h5>
                      </div>
                    </div> */}
                  </div>
                  
                  <input type="button" name="next" onClick={submitForm} className="next next-button" defaultValue="Submit" />
                  <input type="button" onClick={() => setCurrent(current - 1)} name="previous" className="previous previous-button" defaultValue="Previous" />
                </fieldset>


              }



            </form>
          </div>
        </div>
      </div>
    </div>
  )
}