import React, { useEffect } from "react";
import { isMobile } from "react-device-detect"
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import transactions from "../../assets/arrows.png";
import sigreq from "../../assets/cert.png";



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

export default function IssuerDashboard() {

    const navigate = useNavigate()



    const viewTx = (status:string) => {
        navigate(`/issuerReqList/${status}`)

    }


  



    return (


        <div className="wrapper" >


                <Card onClick={()=>viewTx("pending")} style={{ cursor: "pointer" }}>
                    <div style={{ marginTop: "14%" , marginLeft:"14%" }}>

                        <h4>PENDING REQUESTS</h4>

                        <img style={{marginLeft:"5%"}} height={180} src={sigreq} />


                    </div>
                </Card>
                <Card onClick={()=>viewTx("issued")} style={{ cursor: "pointer" }}>
                    <div style={{ marginTop: "14%" , marginLeft:"14%" }}>

                        <h4>ISSUED REQUESTS</h4>

                        <img style={{marginLeft:"5%"}}  height={180} src={transactions} />


                    </div>
                </Card>
            </div>


       
    )
}