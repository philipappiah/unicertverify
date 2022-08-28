import { ethers } from "ethers"

 const networkName = 'meter testnet'

export const NETWORK_META ={ networkId: 83, networkName } 

export const NETWORK_WITH_CHAINID = { name: networkName, chainId: 83 } 
export const DEFAULT_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpctest.meter.io', { name: networkName, chainId: 83 })

export const RPC_URL = 'https://rpctest.meter.io'

export const API_URL = "http://localhost:8000"

export const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs"
