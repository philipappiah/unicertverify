import {createContext, useState, useContext} from 'react'
import { WalletContext } from './WalletContext';



export const AppContext = createContext<{
    themeColor:string
    textColor:string
    txStatus:string
    transactions: Array<Object>
    setTransaction: (txs:any) => void
    setAppThemeColor: (color:string) => void
    setAppTextColor: (color:string) => void
    setTxStatus: (tx:string) => void
}>({
    themeColor:"",
    textColor:"",
    txStatus:"",
    transactions:[{tx:"", status:""}],
    setTransaction: () => {},
    setAppThemeColor: () => {},
    setAppTextColor: () => {},
    setTxStatus: () => {}

})



export const AppContextProvider  = ({children}:any) => {

    const { address, isReady, signer} = useContext(WalletContext)

    const [themeColor, setThemeColor] = useState("#005086")
    const [textColor, setColor] = useState("#F7F7F7")
    const [txStatus, setTxStatus] = useState("")
    const [transactions, addTx] = useState([{tx:"", status:""}])

    const setAppThemeColor = (color:string) => {
        setThemeColor(color)
    }

    const setAppTextColor = (color:string) => {
        setColor(color)
    }

    const setTransaction = (txObj:{tx:"", status:""}) => {
        addTx(txs => [...txs,txObj ])
    }

    return <AppContext.Provider value={{themeColor, textColor, txStatus,transactions, setTransaction, setTxStatus, setAppThemeColor, setAppTextColor}}>{children}</AppContext.Provider>
    

}