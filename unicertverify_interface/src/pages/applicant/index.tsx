import React, { useContext, useState, useCallback, useEffect } from "react";
import { isMobile } from "react-device-detect"
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { CheckCircle, Copy, Eye } from 'react-feather'

import sigreq from "../../assets/cert.png";
import transactions from "../../assets/arrows.png";
import copy from 'copy-to-clipboard'

const CopyButton = styled.div`
  
  flex-shrink: 0;
  margin-right: 1rem;
  margin-left: 0.5rem;
  text-decoration: none;
  color: #E6007E;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    opacity: 0.8;
    cursor: pointer;
  }
`

const EyeButton = styled.div`
  
flex-shrink: 0;
margin-right: 1rem;
margin-left: 0.5rem;
text-decoration: none;
color: #E6007E;
:hover,
:active,
:focus {
  text-decoration: none;
  opacity: 0.8;
  cursor: pointer;
}
`






const Card = styled.div
    `
    display: inline-block;
    height: 300px;
    width: 300px;
    margin: 2rem;
    position: relative;
    box-shadow: 0 0 15px 2px rgba(0,0,0,0.4);
    border-radius: 10px;
    > div{
        border-radius: 10px;
        transition: all 200ms;
        transition-delay: 50ms;
    }
    :hover {
        div {
            transform: scale(1.02);
        }
    }
    :focus {
        div {
            transform: scale(1.02);
        }
    }
`


export default function ApplicantDashboard() {



    const navigate = useNavigate()

    const { certExist, userDetail } = useContext(UserContext)




    const [isCopied, setCopied] = useState(false)
    const [timeout, setTime] = useState(500)
    const [addAddr, setAddAddr] = useState(false)


    const copyText = useCallback((text: string) => {
        const didCopy = copy(text)
        setCopied(didCopy)
    }, [])

    
    useEffect(() => {
        if (isCopied) {
            const hide = setTimeout(() => {
                setCopied(false)
            }, timeout)

            return () => {
                clearTimeout(hide)
            }
        }
    }, [isCopied, setCopied, timeout])


    
    const createRequest = () => {


        navigate(`/createRequest`)

    }

    const viewTx = () => {
        navigate(`/userTx`)

    }

    const viewCert = () => {

        navigate(`/viewCert`)
        
    }



    return (

                   <div className="row" >
                       <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-6 text-center p-0 mt-3 mb-2">
                           <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
            {certExist &&
            
                <form id="stepform">
                    <fieldset>
                        <div className="step">


                            <div className="row" >
                                <div className="col-12" style={{ display: "inline-flex" }}>

                                    <label className="fieldlabels"> CERTIFICATE </label>
                                    {" "}
                                    <input style={{   marginLeft: "5px", marginTop: "-10px" }} type="text" name="certificate_addr" defaultValue={userDetail.certificate} readOnly />

                                    <CopyButton onClick={() => copyText(userDetail.certificate)} >
                                        {isCopied ? (

                                            <CheckCircle size={'16'} />

                                        ) : (

                                            <Copy size={'16'} />

                                        )}
                                    </CopyButton>

                                    <EyeButton onClick={viewCert}>

                                    <Eye size={'16'} />
                                    </EyeButton>


                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>

            }

            <div className="wrapper" >


                <Card onClick={createRequest} style={{ cursor: "pointer" }}>
                    <div style={{ marginTop: "14%"  }}>

                        <h4>CREATE A REQUEST</h4>

                        <img style={{marginLeft:"5%"}} height={180} src={sigreq} />


                    </div>
                </Card>
                <Card onClick={viewTx} style={{ cursor: "pointer" }}>
                    <div style={{ marginTop: "14%"  }}>

                        <h4>TRANSACTIONS</h4>

                        <img style={{marginLeft:"5%"}}  height={180} src={transactions} />


                    </div>
                </Card>
            </div>
            </div>
           
            </div>
        </div>
    )
}