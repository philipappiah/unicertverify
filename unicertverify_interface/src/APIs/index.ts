

import axios from "axios"
import { API_URL, PINATA_GATEWAY} from "../constants"


export const getIssuers = async () => {
    const response = axios.get(`${API_URL}/api/v1/issuers/`)
    return response

}

export const getIssuerIssuedProofs = async (issuerAddr:string | undefined, status:string) => {
    const response = axios.get(`${API_URL}/api/v1/proof_requests/issuer/?issuer=${issuerAddr}&status=${status}`)
    return response

}


export const getApplicantProofReq = async (applicant:string | undefined, issuerAddr:string | undefined) => {
    const response = axios.get(`${API_URL}/api/v1/proof_requests/applicant/?applicant=${applicant}&issuer=${issuerAddr}`)
    return response

}

export const getProofById = async (proofId:string) => {
    const response = axios.get(`${API_URL}/api/v1/proof_request/${proofId}/`)
    return response

}


export const updateApplicantProofReq = async (body:any, proofReqId:string) => {
    const response = axios.put(`${API_URL}/api/v1/proof_request/${proofReqId}/`,body, {
        headers: {
            'Content-Type': 'application/json'
          }
    })
    return response

}

export const getApplicantDetails = async (applicant:string | undefined) => {
    return axios.get(`${API_URL}/api/v1/applicant/${applicant}`)
    
}


export const uploadIPFS = async (body:Object) => {
    const config = {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjNTdmODljYS1lYTM3LTQxMjktOTAxMy00ZTA0MDI0M2MxMDciLCJlbWFpbCI6InBhcHBpYWhrdWJpMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTNhNGQyNDBiZTZlMWJhMzJjNmIiLCJzY29wZWRLZXlTZWNyZXQiOiIyMmNjMGM3ZDJmZjU4YjJkYzI1NzJkN2RiMjY2YjdhNWJmOTU4MmY0OGNkMjU0NDhkYzc4ZTRmMzM0YWUwZTZjIiwiaWF0IjoxNjU3Nzk5MDQ4fQ.R2u82ILdgOE9VBollkKZQGsmRjPgN3vvstCydnaOZFc",
        "Content-Type": "application/json",
      },
    }

    const uploaded =  await axios.post(
      `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
      JSON.stringify(body),
      config
    );
    return uploaded

   
  }


  export const getIpfsData = async (ipfsHash:string) => {
    return axios.get(`${PINATA_GATEWAY}/${ipfsHash}`)
  

  }