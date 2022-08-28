export const Issuers = [
    {
        name:"Ulster University",
        publicAddress: "0x748EC2b0B9d8f887E3dC078E4707360edFf01CeD",
        trustees:[
            {
              name:"Philip Appiah Kubi",
              publicAddress:"0xC1a39D256959aa5E97784200f91cE63501dbD990"  
            },
            {
                name:"Richard Dwomoh",
                publicAddress: "0x67E37c1896Fe00284D7dcC7fDfc61810C10C004F"
            }
        ]
    }
]





export const Requests = [
    {
        to:"0x748EC2b0B9d8f887E3dC078E4707360edFf01CeD",
        applicantName:"Philip Appiah Kubi",
        applicantNumber:"B00847286",
        yearOfCompletion:"2022",
        email:"pappiahkubi1@gmail.com",
        dateOfRequest: new Date().toISOString(),
        status:"pending",
        from:"0xC1a39D256959aa5E97784200f91cE63501dbD990",
        onChainCertAddress:"0x1AdAD1A88D943907986F7888bdD55aC077aC32B8",
        certificateName:"Bachelor of Science in Computer Science",
        action:"Issue"
    }
]


export const VerifiableCredential =  {
    "context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
    "issuer": {
     "publicAddress":"0x747fc16F6c1bCb06c12a32C9A5bDebaA8aD35541",
     "name":"Ulster University",
     "country":"United Kingdom",
     "state":"Northern Ireland",
     "city":"Belfast"
    },
    
    "credentialSubject": {
      "fullName":"Anthony Williams",
      "studentNumber":"B00847223",
      "degree": {
        "type": "BachelorDegree",
        "name": "Bachelor of Science",
        "course":"Computer Science",
        "major":"",
        "minor":"",
        
        "college": "College of Engineering",
        "class": "First Class"
      },
      "dateAwarded":"1st June, 2018",
     
      
    },
    "affirmationStatement": "Awarded on successful completion of the 4-year course",
    "signers":["0xc1a39d256959aa5e97784200f91ce63501dbd996", "0x67E37c1896Fe00284D7dcC7fDfc61810C10C003F"]

}

export const Applicant = [
    {
        name:"Philip Appiah Kubi",
        publicAddress: "0xC1a39D256959aa5E97784200f91cE63501dbD990",
        certificate:"0x1AdAD1A88D943907986F7888bdD55aC077aC32B8"
    }
]


export const Unicert = {
    publicAddress:"0x63D0211E61FA9C13119f5bF943187bb728E060C3",
    admins:["0xC1a39D256959aa5E97784200f91cE63501dbD990"]
}