import React, {useState, createContext, useCallback, useEffect} from 'react'
import Onboard from 'bnc-onboard'
import {API, Wallet } from 'bnc-onboard/dist/src/interfaces'
import {providers, Signer} from 'ethers'
import { DEFAULT_PROVIDER, RPC_URL, NETWORK_META, NETWORK_WITH_CHAINID} from '../constants'

class Web3Provider extends providers.Web3Provider {}


export const PROJECT_ID = '6ba259895e5849a48b2da99fdda9d3ed' // Infura project ID
const INFURA_URL = `https://mainnet.infura.io/v3/${PROJECT_ID}` // Infura URL


export const NETWORKS = 
[
    { walletName: 'metamask', preferred: true, rpcUrl: RPC_URL },
    {walletName: 'walletConnect',preferred: true, infuraKey: PROJECT_ID},
    { walletName: 'walletLink',preferred: true, rpcUrl: INFURA_URL },
    { walletName: 'wallet.io',preferred: true, rpcUrl: INFURA_URL },
    { walletName: 'coinbase',preferred: true,  rpcUrl: INFURA_URL },
    { walletName: 'trust',preferred: true, rpcUrl: INFURA_URL },
   
]

 export const WalletContext = createContext<{
    address?:string
    onboard?:API
    wallet: Wallet | null
    provider: Web3Provider | null
    defaultProvider: providers.Provider
    signer?: any
    isReady:boolean
    chooseWallet: () => Promise<boolean>
    networkName?:string

}>({
    chooseWallet: async () => false,
    isReady:false,
    wallet:null,
    provider:null,
    defaultProvider:DEFAULT_PROVIDER,
   
})



interface Subscriptions {
    wallet: (wallet:Wallet) => void
    address: React.Dispatch<React.SetStateAction<string | undefined>>
}

const initializeWallet = (subscriptions: Subscriptions): API => {

    return Onboard({
    ...NETWORK_META,
     subscriptions,
     hideBranding:true,
     walletSelect:{
         wallets:NETWORKS
     }

    })
}




export const Web3ReactProvider = ({children}:{children:React.ReactNode}) => {

  const [address, setaddress] = useState<string>()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [onboard, setOnboard] = useState<API>()
  const [provider, setProvider] = useState<Web3Provider | null>(null)
  const [defaultProvider] = useState<providers.Provider>(DEFAULT_PROVIDER)
  const [signer, setSigner] = useState<Signer>()
  const [isReady, setReady] = useState(false)
  const [networkName, setNetworkName] = useState<string>()

  const configureWallet = useCallback((_wallet: Wallet) => {
    setWallet(_wallet)
    if (_wallet && _wallet.name) localStorage.setItem('chosenWallet', _wallet.name)
    const _provider = new Web3Provider(_wallet.provider,NETWORK_WITH_CHAINID )
    const _signer = _provider.getSigner()
   
    setNetworkName(NETWORK_WITH_CHAINID.name.toUpperCase())
    localStorage.setItem('networkName', NETWORK_WITH_CHAINID.name.toUpperCase())
    setSigner(_signer)
    setProvider(_provider)
  }, [])



  useEffect(() => {

 
    const walletAPI = initializeWallet({
      address: setaddress,
      wallet: (_wallet: Wallet) => {
        if (_wallet?.provider) {
            configureWallet(_wallet)
        } else {
          setProvider(null)
          setWallet(null)
        }
      },
    })
    setOnboard(walletAPI)
  }, [configureWallet])


  useEffect(() => {
    (async () => {
      const previousWallet = localStorage.getItem('chosenWallet')
      const _networkName = localStorage.getItem("networkName")
      if (previousWallet && onboard) {
        const wallet = await onboard.walletSelect(previousWallet)
        setReady(wallet)
      }
      if(_networkName){
        setNetworkName(_networkName)
      }
    })();
  }, [onboard])


  const chooseWallet = async (): Promise<boolean> => {
    if (!onboard) {
        return false
    }
    const wallet = await onboard.walletSelect()
    if (!wallet){
     return false
    }
    const _isready = await onboard.walletCheck()
    setReady(_isready)
    if (_isready){
     configureWallet(onboard.getState().wallet)
    }
    return _isready
  }

  return (
      <WalletContext.Provider value={{
        address,
        wallet,
        onboard,
        provider,
        signer,
        chooseWallet,
        isReady,
        defaultProvider,
        networkName
      }}
      >
          {children}
      </WalletContext.Provider>
  )

}


