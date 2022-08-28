import React, { useState, useContext, useEffect } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { Contract} from "ethers"
import { useNavigate} from "react-router-dom"
import { UserContext } from "../../contexts/UserContext";
import { deployContract } from '../../utils/deploy';
import Certificate from "../../constants/contractAbis/Certificate.json";
import { WalletContext } from "../../contexts/WalletContext";
import { AppContext } from "../../contexts/AppContext";
import axios from "axios";
import { API_URL } from "../../constants";
import { Layover, Spinner} from "../../components/Styles"
import { getIssuers } from "../../APIs";


const UNICERT_ADDRESS = "0x7bF37516305254d4bbec05CA14fDBeFDB559d199"




export default function CreateRequest() {

  const navigate = useNavigate()
  const { userDetail, certExist } = useContext(UserContext)
  const { signer, address } = useContext(WalletContext)
  const { setTransaction } = useContext(AppContext)


  const [current, setCurrent] = useState(1)



  const [isLoading, setLoading] = useState(false)
  const [issuer, setIssuer] = useState('')
  const [month, setMonth] = useState('January')
  const [year, setYear] = useState(new Date().getFullYear())

  const [degName, setDegName] = useState("")
  const [message, setMessage] = useState('')
  const [studentNo, setStudentNo] = useState('')
  const [degType, degDegType] = useState("Bachelor's degree")
  const [course, setCourse] = useState('')
  const [major, setMajor] = useState('')
  const [minor, setMinor] = useState('')
  const [isPrivate, setPrivate] = useState(false)

  const [issuers, setIssuers] = useState([])

  const [currYear, setCurrYear] = useState(new Date().getFullYear())



  const handleChangeDeg = (degName: string) => {
    degDegType(degName)
    setMessage(`I want you to issue a digital proof of my ${degName} on chain`)

  }

  const deployCert = async () => {
   
    const contract = await deployContract(Certificate.abi, Certificate.bytecode, [UNICERT_ADDRESS,issuer, isPrivate], signer)

    if (contract) {
      setTransaction({tx:contract.deployTransaction.hash, status:'success'})
      return contract
      // contract.deployTransaction.hash
       
    }

  }

  const createProofReq = (certificate: string) => {
    setLoading(true)
    
    axios.post(`${API_URL}/api/v1/proof_requests/`, {

      student_num: studentNo,
      completion_month: month,
      completion_year: year,
      deg_name: degName,
      deg_type:degType,
      major,
      minor,
      course,
      message,
      certificate: certificate,
      applicant: userDetail.address,
      issuer,

    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        console.log(response)
        setLoading(false)

        setTimeout(() => navigate("/dashboard"), 1500)


      }).catch(err => {
        console.log(err)
        setLoading(false)
      })


  }

  const submitForm = async () => {
    setLoading(true)
    let certificate = userDetail.certificate
    if ((!certExist) && (!certificate)) {
      deployCert().then(contract => {
        if (contract?.address) {


          axios.post(`${API_URL}/api/v1/certificates/`, {
            address: contract.address.toLowerCase(),
            applicant: userDetail.address
  
  
          }).then(response => {
            certificate = response.data.address.toLowerCase()
            createProofReq(certificate)
           
          }).catch(err => {
            console.log(err)
          })
        }

      }).catch(err=>{
        setLoading(false)
        console.log(err)

      })
      



    } else {

      const certContract = new Contract(certificate, Certificate.abi, signer )
      certContract.setcurrentIssuer(
             issuer
             ).then((res:any)=>{

              createProofReq(certificate)
             }).catch((err:any)=>{
              setLoading(false)
             })
      
    }



  }



  useEffect(() => {

    getIssuers().then(response=>{
      setIssuers(response?.data?.results)
        if (response?.data?.results.length) {
          setIssuer(response?.data?.results[0].address)
        }


    }).catch(err=>{
         console.log(err)
    })
  }, [])

  return (
    <div  >
      {isLoading && <Layover><Spinner /></Layover>}
      <div className="row" >
        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-5 mb-2">
          <div className="card px-0 pt-4 pb-0 mt-3 mb-3">

            <h2 id="heading">Request a digital proof of your certificate</h2>

            <form id="stepform">

              <fieldset>
                <div className="step">


                  <div className="row">
                    <div className="col-12">

                      <label className="fieldlabels">Select issuer: *</label>
                      <select onChange={(e) => setIssuer(e.target.value)} style={{ marginTop: "3px", height: "40px" }} className="form-select" aria-label="Default select example">
                        {
                          issuers.map((org: any, key: number) => (
                            <option key={key} value={org.address.toLowerCase()}>{org.name}</option>
                          ))
                        }

                      </select>


                    
                          <label className="fieldlabels">Completion Month: *</label>
                          <select onChange={(e) => setMonth(e.target.value)} style={{ marginTop: "3px", height: "40px" }} className="form-select" aria-label="Default select example">


                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>




                          </select>

                       
                     
                          <label className="fieldlabels">Completion Year: *</label>
                          <select onChange={(e) => setYear(Number(e.target.value))} style={{ marginTop: "3px", height: "40px" }} className="form-select" aria-label="Default select example">
                            {
                              Array.from({ length: 50 }, (v, i) => (
                                <option key={i} value={currYear - i}>{currYear - i}</option>

                              ))
                            }





                          </select>

                     

                      <label className="fieldlabels"> Student / Applicant Number: </label>
                      <input required type="text" onChange={(e) => setStudentNo(e.target.value)} name="student_number" placeholder="B00847267" />





                      <label className="fieldlabels">Certificate Type: *</label>
                      <select onChange={(e) => handleChangeDeg(e.target.value)} style={{ marginTop: "3px", height: "40px" }} className="form-select" aria-label="Default select example">


                        <option value="BachelorDegree">Bachelor&apos;s Degree</option>
                        <option value="AssociateDegree">Associate Degree</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Certificate">Certificate</option>
                        <option value="PostBaccalaureateCertificate">Post-Baccalaureate Certificate</option>
                        <option value="GraduateDegree">Graduate Degree</option>
                        <option value="MasterDegree">Master&apos;s Degree</option>
                        <option value="PostMasterCertificate">Post-Master&apos;s Certificate</option>
                        <option value="DoctorateDegree">Doctorate Degree</option>
                        <option value="FirstProfessional">First Professional</option>




                      </select>

                      <label className="fieldlabels"> Degree Name: </label>
                      <input required type="text" onChange={(e) => setDegName(e.target.value)} name="deg_name" placeholder="Bachelor of Science" />

                      <label className="fieldlabels"> Course: </label>
                      <input required type="text" onChange={(e) => setCourse(e.target.value)} name="deg_course" placeholder="Computer Science" />

                      <label className="fieldlabels"> Degree Major: </label>
                      <input required type="text" onChange={(e) => setMajor(e.target.value)} name="deg_major" placeholder="Software Engineering" />


                      <label className="fieldlabels"> Degree Minor: </label>
                      <input required type="text" onChange={(e) => setMinor(e.target.value)} name="deg_minor" placeholder="Accounting" />

                      <label className="fieldlabels"> Message: </label>
                      <input required type="textarea" onChange={(e) => setMessage(e.target.value)} name="message" placeholder={`I want you to issue a digital proof of my ${degName} on chain`} />


                      <FormControlLabel
                        control={
                          
                          <Checkbox checked={isPrivate} onChange={(e)=>setPrivate(!isPrivate)} />
                        }
                        label="Private"
                        />



                    </div>

                  </div>

                </div> <input type="button" onClick={submitForm} name="submit" className="next next-button" defaultValue="Submit" />
              </fieldset>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}