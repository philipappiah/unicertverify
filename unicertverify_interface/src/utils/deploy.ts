import { ethers,ContractFactory   } from "ethers";
import {SignerOrProvider} from "../types"




export const deployContract = async ( abi:any, bytecode:any,args:any,signer:any) =>  {

    let factory = new ethers.ContractFactory(abi, bytecode, signer);
    let contract = await factory.deploy(...args);
    const deployed = await contract.deployed() 
    return deployed

}