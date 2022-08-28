import {Web3Provider} from '@ethersproject/providers'
import { ethers } from 'ethers'

export function web3Library(_web3provider:any){
    const _web3Library = new Web3Provider(_web3provider, 'any')
    _web3Library.pollingInterval = 1500
    return _web3Library
}



export const signMsg = async (
    data:string,
    signer:any

) => signer.signMessage(ethers.utils.arrayify(data))