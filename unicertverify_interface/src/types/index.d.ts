export interface SideNavProps {
    isCollapsed: boolean
    toggleCollapse: () => void
  }
  
  import { ethers,ContractFactory,providers, Signer   } from "ethers";

  

  export type SignerOrProvider = Signer | providers.Provider


export interface SideBarProps {
  isCollapsed: boolean
  rtl: boolean
  isToggled: boolean
  handleToggleCollapse : () => void
  handleToggleSidebar :  (value:boolean) => void
}

export interface SpecificSideBarProps {

  handleToggleCollapse : () => void
 
}



export type ProofRequestType = {
   
    applicantName:string
    applicantNumber: string
    yearOfCompletion:string
    dateOfRequest:string
    status:string
    from:string
    email:string
    onChainCertAddress:string
    certificateName:string
    action:string
  
  }

  
export interface Table {
      columns:Array<string>
      list:Array<RequestType>
      keys:Array<string>
  
  }


  export interface UserDetail {
    address:string
    fullname:string
    email:string
    is_trustee:boolean
    phone:string
    certificate:string
  }



  export interface ProofReqTx {
    reference:string
    applicant:string
    issuer:string
    course:string
    date_awarded:string
    student_num:string
    deg_type:String,
    deg_name:String,
    completion_month:string
    completion_year:string
    message:string
    certificate:string
    signers:Array,
    signatures:Array,
    data_hash:string
    status:string
    requiresApproval:boolean
    created_at:string
  }

  export interface IssuerType {
    address:string
    name:string
    admin:string
    country:string
    email:string
    zipcode:string
    telephone:string
    trustees:Array
    size:string
    logo:string
    is_approved: boolean

  }