import React, { useContext, useEffect, useState } from "react"
import { Contract, utils } from "ethers"
import { useParams } from "react-router-dom"
import Certificate from "../../constants/contractAbis/Certificate.json";
import { isBrowser } from "react-device-detect"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { MdVerifiedUser } from "react-icons/md";

import { getIpfsData } from "../../APIs";

import Switch from '@mui/material/Switch';
import { ProofReqTx } from "../../types";
import sigreq from "../../assets/cert.png";

import { WalletContext } from "../../contexts/WalletContext";
import { ProofRequestContext } from "../../contexts/ProofRequestContext"
import { getProofById } from "../../APIs";
import { Layover, Spinner, NotificationHead } from "../../components/Styles"
import styled, { keyframes } from "styled-components";

export const spin = keyframes`
0% {
transform: rotate(0deg);
}
100% {
transform: rotate(360deg);
}
`

export const MiniSpinner = styled.div`
position: absolute;
left:40%;
top:30%;
display: inline-block;
width: 80px;
height: 80px;
&:after {
content: " ";
display: block;
width: 40px;
height: 40px;
margin: 8px;
border-radius: 50%;
border: 6px solid #005086;
border-color: #005086 transparent #005086 transparent;
animation: ${spin} 1.2s linear infinite;
}
`



export default function VerifyProof() {

    const { proofId } = useParams()

    const { address, defaultProvider } = useContext(WalletContext)



    const [checked, setChecked] = useState([1]);
    const [proofDetail, setProofDetail] = useState<ProofReqTx>()
    const [showChain, setShowChain] = useState(false)
    const [proofData, setProofData] = useState<Array<ProofReqTx>>([])
    const [isLoading, setLoading] = useState(true)
    const [isValidProof, setValidProof] = useState(false)

    const handleToggle = (value: any) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleChangeViewChain = (e: any) => {

        setShowChain(e.target.checked)


    }

    const isValidChain = async (_proofDetail: ProofReqTx) => {

        if (_proofDetail) {
            const certContract = new Contract(_proofDetail.certificate, Certificate.abi, defaultProvider)
            let currentProof = await certContract.currProofHash()
            let verified =  await certContract.verify(currentProof)

            console.log(verified)
            if(verified){
                let ipfsHash = await certContract.ipfsHashes(currentProof)
                const res = await getIpfsData(ipfsHash)
                
                return {
                    isValid: false,
                    data: []
                }

            } 
            let ipfsList = []
            let contractProofs = []
            let chainData = []
            let prevProof = "unknown"

            while (prevProof && prevProof !== "0x") {
                prevProof = await certContract.proofChain(currentProof)

                contractProofs.push(currentProof)
                let ipfsHash = await certContract.ipfsHashes(currentProof)
                ipfsList.push(ipfsHash)
                currentProof = prevProof


            }



            for (let i = 0; i < ipfsList.length; i++) {
                const res = await getIpfsData(ipfsList[i])
                if (res && res.data) {
                    const messageHash = utils.keccak256(utils.toUtf8Bytes(JSON.stringify(
                        res.data
                    )))

                    if (messageHash !== contractProofs[i]) {
                        setLoading(false)
                        return {
                            isValid: false,
                            data: []
                        }
                    }

                    chainData.push(res.data)

                }


            }

            setLoading(false)

            return {
                isValid: true,
                data: chainData
            }




        }

    }


    const verifyProof = async (_proofDetail: ProofReqTx) => {


        const chain = await isValidChain(_proofDetail)
        if (chain && chain.isValid) {

            return chain.data
        }



        return []





    }


    useEffect(() => {


        if (proofId) {
            getProofById(proofId.toLowerCase()).then(res => {

                if (res && res.data) {

                    setProofDetail(res.data)

                    isValidChain(res.data).then((response) => {
                        if (response?.isValid) {
                            setValidProof(true)
                            setProofData(response.data)
                            setLoading(false)
                        } else {
                            setValidProof(false)
                            setLoading(false)
                        }

                    })


                }
            }).catch(err => {
                console.log(err)
            })


        }


    }, [])

    return isLoading ? <Layover><Spinner /></Layover> : (



        <div>
            {
                isValidProof ?

                    <List sx={{ width: '100%', maxWidth: isBrowser ? 550 : 100, bgcolor: 'background.paper' }}>



                        <React.Fragment >
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={sigreq} />
                                </ListItemAvatar>


                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >

                                                <span>Issued By : {proofDetail?.issuer}</span> {" "}

                                                <i style={{ color: "#198754", fontSize: "20px" }} className="fa fa-check-circle"></i><br />

                                                <span>Degree Name : {proofDetail?.deg_name}</span><br />
                                                <span>Course Name : {proofDetail?.course}</span><br />
                                                <span>Awarded on : {proofDetail?.date_awarded}</span><br />
                                                <span>Status : {proofDetail?.status} </span><br />
                                                <span>Message : Credential is Valid</span><br/>
                                                <span>Verified : <MdVerifiedUser/></span><br />



                                            </Typography>

                                        </React.Fragment>}
                                    secondary={
                                        <React.Fragment>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={showChain} onChange={handleChangeViewChain} name="proof_chain" />
                                                }
                                                label="View Proof Chain"
                                            />





                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                            <Divider variant="inset" component="li" />
                        </React.Fragment>




                    </List> :

                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >

                        <span>Proof is Invalid</span> {" "}

                        <i style={{ color: "#D70040", fontSize: "20px" }} className="fa fa-times"></i><br />




                    </Typography>


            }





            {showChain && <div className="col-md-6" >


                <div className="card1">
                    <ul id="progressbar2" className="text-center">
                        {
                            proofData.map((pd, index) => (

                                <li key={index} className="active step0">

                                </li>

                            ))
                        }


                    </ul>


                    <div>


                        <List>
                            {
                                proofData.map((pd: any, index) => (
                                    <ListItem key={index} alignItems="flex-start" style={{ marginLeft: "10%", marginBottom: "36px" }}>
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={sigreq} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        <div>
                                                            <span>Institution name : {pd.issuer.name}</span> <br />
                                                            <span> Degree Name : {pd.credentialSubject.degree.name}</span> <br />
                                                            <span>Course : {pd.credentialSubject.degree.course} </span> <br />
                                                            <span>Grade Class : {pd.credentialSubject.degree.class}  </span> <br />
                                                            <span>Awarded on : {pd.credentialSubject.dateAwarded}</span> <br />
                                                            <span>Student Name: {pd.credentialSubject.studentName}</span>


                                                            <span> </span>
                                                        </div>



                                                    </Typography>

                                                </React.Fragment>}

                                        />
                                    </ListItem>

                                ))
                            }



                        </List>




                    </div>

                </div>
            </div>
            }
        </div>

    )


}