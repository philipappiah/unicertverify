import React, {useState, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { Contract, utils } from "ethers"
import { useParams } from "react-router-dom"


import Issuer from "../../constants/contractAbis/Issuer.json"

import { AppContext } from '../../contexts/AppContext';
import { WalletContext } from "../../contexts/WalletContext";
import { UserContext } from "../../contexts/UserContext";
import { IssuerContext } from "../../contexts/IssuerContext";
import { getApplicantProofReq, getApplicantDetails, updateApplicantProofReq, uploadIPFS} from "../../APIs";

import { signMsg } from "../../utils";
import { Layover, Spinner, DashedLine} from "../../components/Styles"

// const sampleAffirmStatment = "Having pursued a prescribed course of study, and having passed the requisite examination the 1st June, 2018 has been duly admitted to the University to the Degree of Bachelor of Science (Computer Science ) First Class Honours"


export default function IssueProof () {

    const navigate = useNavigate()

    
    const { address,signer } = useContext(WalletContext)
    const {trustees, threshold} = useContext(IssuerContext)

    


    const { setTxStatus } = useContext(AppContext)
    const { issuer } = useContext(UserContext)
    

    const [isLoading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [degreeType, setDegreeType] = useState("")
    const [applicantNum, setApplicantNum] = useState("")
    const [degName, setDegName] = useState("")
    const [applicantAddr, setapplicantAddr] = useState("")
    const [completionMonth, setCompletionMonth] = useState("")
    const [completionYear, setcompletionYear] = useState("")
    const [dateAwarded, setDateAwarded] = useState("")
    const [certificateAddr, setcertificateAddr] = useState("")

    const [course, setCourse] = useState("")
    const [major, setMajor] = useState("")
    const [minor, setMinor] = useState("")
    const [degType, setDegType] = useState("")
    const [degClass, setDegClass] = useState("")
    const [college, setCollege] = useState("")
    const [signers, setSigners] = useState<Array<string | undefined>>([])
    const [proofId, setProofId] = useState("") 
    const [requiredSigners, setRequiredSigners] = useState(2)
    const [noOfSigners, setNoOfSigners] = useState(0)
    const [hasAffirmation, setHasAffirmation] = useState(false)
    const [signatures, setSignatures] = useState<Array<string>>([])

    const [isReadOnly, setReadOnly] = useState(false)
   
    const [affirmStatement, setAffirmStatement] = useState("")
    

    const { applicant } = useParams()
   


    useEffect(() => {

      if (applicant && issuer && issuer.address){
        
        setLoading(true)

        getApplicantDetails(applicant).then(res1 => {
          
          if(res1 && res1.data){
            
            setName(res1.data.fullname)
            setEmail(res1.data.email)

            getApplicantProofReq(applicant,issuer.address).then(res2=>{
              if(res2 && res2.data.length){
              let proof = res2.data[0]
              
              setapplicantAddr(applicant)
              setProofId(proof.reference)
              setDegName(proof.deg_name)
              setDegType(proof.deg_type)
              setApplicantNum(proof.student_num)
              setDegClass(proof.deg_class)
              setcompletionYear(proof.completion_year)
              setCompletionMonth(proof.completion_month)
              setCollege(proof.college)
              setMajor(proof.major)
              setMinor(proof.minor)
              setDateAwarded(proof.date_awarded)
              setCourse(proof.course)
              setcertificateAddr(proof.certificate)
              setSigners(proof.signers)
              setRequiredSigners(proof.required_signers)
              setNoOfSigners(proof.no_of_signers)
              setSignatures(proof.signatures)
              
              
              setAffirmStatement(proof.affirmation_statement)
              
              setHasAffirmation(proof.has_affirmation)


              if(proof.signers.length){
                setReadOnly(true)
              }

          
              
              
              }
              setLoading(false)
            }).catch(err=>{
              setLoading(false)
              console.log(err)
            })
            
          }

        }).catch(err=>{
          setLoading(false)
          console.log(err)

        })
        
       
      }

    },[issuer])
    
   




    const signAndUpdateOnly = (message:any) => {

      


      if(issuer){
      signMsg(message, signer).then((signature:string) => {

        
       
        // let's sort the addresses of the signers
       if(signatures.length < threshold){
        if(signatures.length === 0){
          signatures.push(signature)
        }else{
          let lastSigner = signers[signers.length - 1]
          let lastSignature = signatures[signatures.length - 1]
          if (lastSigner && address && lastSigner > address){
            signatures[signatures.length - 1] = signature
            signatures.push(lastSignature)
            }else{
              signatures.push(signature)
            }
      
        }
       
        signers.push(address?.toLocaleLowerCase())
       }

       if(!hasAffirmation){
        

        let updatedProof = {
          has_affirmation:true,
          deg_name:degName,
          signatures,
          data_hash:message,
          date_awarded:dateAwarded,
          signers,
          affirmation_statement:affirmStatement,
          college,
          deg_type:degType,
          major,
          minor,
          course,
          student_num: applicantNum,
          deg_class: degClass,
          completion_month:completionMonth,
          completion_year:completionYear,
          no_of_signers: noOfSigners + 1,

        }

     
        updateApplicantProofReq(updatedProof, proofId).then(res=>{
        
          navigate('/dashboard')
        }).catch(err=>{
          console.log(err)
        })
       }

       



      }).catch(err=>{
        console.log(err)
      })

    }

    }

    


    const signAndSubmit =  async (message:any, data:any) => {



  
      if(issuer){
        signMsg(message, signer).then(async (signature:string) => {

        
        
         if(signatures.length < threshold){
          
         
            // let's sort the addresses of the signers
     
            let lastSigner = signers[signers.length - 1]
            let lastSignature = signatures[signatures.length - 1]
            
            if (lastSigner && address && lastSigner > address){
              signatures[signatures.length - 1] = signature
              signatures.push(lastSignature)
              }else{
                signatures.push(signature)
              }
          
          signers.push(address?.toLocaleLowerCase())
         }
         
         if(hasAffirmation){

         

          let ipfs = await uploadIPFS(data)
          let IpfsHash = ipfs.data.IpfsHash
         
       
          if(signatures.length === threshold) {
            // update certificate contract with proof
            //issueProof

            const arrayfiedmsg = utils.arrayify(message)

            
             const issuerContract = new Contract(issuer.address, Issuer.abi, signer )
             const issueProofTx = await issuerContract.issueProof(
              applicantAddr, 
              certificateAddr,
              arrayfiedmsg,
              IpfsHash,
              signatures
              
              
             )

             await issueProofTx.wait();

            

             if(issueProofTx){
              let updatedProof = {

                signatures,
                signers,
                no_of_signers:noOfSigners + 1,
                status:"ISSUED",
                ipfs_hash:IpfsHash,
                tx_hash:issueProofTx.hash,
                modified_at: new Date().toISOString()
                
              }

              updateApplicantProofReq(updatedProof, proofId).then(res1=>{
          
                navigate('/dashboard')
              }).catch(err=>{
                console.log(err)
              })

             }


             
             
        
           
          }

         }

      }).catch(err=>{
        console.log(err)
      })
    }

    }


    
    const onSubmit = async () => {

       if(!setAffirmStatement) {
        return
       }

        
        setLoading(true)

        
        const verifiableData = {
          context: [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
          ],
          type: ["VerifiableCredential", "UniversityDegreeCredential"],
          issuer: {
           address:issuer?.address,
           name: issuer?.name,
           country:issuer?.country,
          },
          
          credentialSubject: {
            studentName:name,
            studentNumber:applicantNum,
            degree: {
              type: degType,
              name: degName,
              course,
              major,
              minor,
              college: college,
              class: degClass
            },
            dateAwarded,
           
            
          },
          affirmationStatment: affirmStatement,
        }

      


        let _trustees = trustees?.map(address => address.toLowerCase())
        if(address && _trustees?.includes(address) && (!signers.includes(address.toLowerCase()))) {


          const messageHash = utils.keccak256(utils.toUtf8Bytes(JSON.stringify(
            verifiableData
           )))
           
        
          if( signers.length < threshold - 1) {

            signAndUpdateOnly(messageHash)

          }

          if(signers.length == threshold - 1) {

            signAndSubmit(messageHash, verifiableData)

          }
        
        setTxStatus("pending")

        setLoading(false)
        setTxStatus("submitted")
      }else{
        setLoading(false)
      }

    }


    

    return isLoading ? <Layover><Spinner /></Layover>:
     (
       
        <div className="row" >
          
          <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-5 mb-2" >
            <div className="card px-0 pt-4 pb-0 mt-3 mb-3" >
           
              <h2 id="heading">Issue Certificate Proof</h2>
  
              <form id="stepform"  >
                
                  <fieldset>
                    <div className="step">
                      <h3>Applicant Details</h3>
  
                      <div className="row">
                       
                       
                       
                        <label className="fieldlabels"> Applicant Name: </label>
                          <input  type="text" onChange={(e) => setName(e.target.value)}  name="full_name" defaultValue={name} />

                          <label className="fieldlabels"> Applicant Email: </label>
                          <input readOnly type="text"  name="full_name" defaultValue={email} />
  
                         
                          <label className="fieldlabels">Applicant Address: </label>
                          <input readOnly onChange={e => setapplicantAddr(e.target.value)} type="text" name="p_address" defaultValue={applicantAddr} />


                        
                        <label className="fieldlabels">Applicant Number: </label>
                          <input readOnly  type="text" name="applicant_number" defaultValue={applicantNum} />


                          <label className="fieldlabels">Month of Completion: </label>
                          <input readOnly  type="text" name="month_of_completion" defaultValue={completionMonth} />

                          <label className="fieldlabels">Year of Completion: </label>
                          <input readOnly  type="text" name="year_of_completion" defaultValue={completionYear} />


                  

                        
                          
                         
                          
                        </div>
  

                       <br/>
                       <DashedLine/>
                      
                       <br></br>

                        <h3>To Be Completed by Trustee</h3>
                        <br></br>
                        <div className="row">
                       
                       
                        <label className="fieldlabels"> Student Course: </label>
                         <input readOnly={isReadOnly} onChange={(e)=>setCourse(e.target.value)} type="text"  name="course" defaultValue={course} />

                         <label className="fieldlabels"> Degree Type: </label>
                         <input readOnly={isReadOnly} onChange={(e)=>setDegType(e.target.value)} type="text"  name="degType" defaultValue={degType} />

                         <label className="fieldlabels"> Degree Name: </label>
                         <input readOnly={isReadOnly} onChange={(e)=>setDegName(e.target.value)} type="text"  name="degType" defaultValue={degName} />


                         <label className="fieldlabels">Major: </label>
                         <input readOnly={isReadOnly} onChange={(e)=>setMajor(e.target.value)}  type="text" name="major" defaultValue={major} />

                         <label className="fieldlabels">Minor: </label>
                         <input readOnly={isReadOnly} onChange={(e)=>setMinor(e.target.value)}   type="text" name="minor" defaultValue={minor} />

                         
                         
                      
                         <label className="fieldlabels">College: </label>
                         <input readOnly={isReadOnly}  onChange={e => setCollege(e.target.value)} type="text" name="college" defaultValue={college} />


                         <label className="fieldlabels">Class Awarded: </label>
                         <input readOnly={isReadOnly} onChange={(e)=>setDegClass(e.target.value)}  type="text" name="degClass" defaultValue={degClass} />

                         
                       <label className="fieldlabels"> Date Awarded: </label>
                       <input readOnly={isReadOnly} onChange={(e)=>setDateAwarded(e.target.value)} defaultValue={dateAwarded} type="date" id="date_awarded" name="date_awarded" />

                
        
                         <label className="fieldlabels">Affirmation Statement: </label>
                         <textarea readOnly={isReadOnly} defaultValue={affirmStatement} onChange={(e)=>setAffirmStatement(e.target.value)} name="affirmStatment_statment"   >
                          

                         </textarea>
                         
                       </div>

                    
                    </div> 
                    
                    <input type="button" disabled={isLoading} onClick={onSubmit} name="submit" className="next next-button" value="Issue Proof" />
                    {
                      
                      isLoading && <div className="spinner"></div>
                    }
                    
                    

                    

                  </fieldset>
  
                
  
                
  
  
              </form>
            </div>
          </div>
        </div>
   

    )
}