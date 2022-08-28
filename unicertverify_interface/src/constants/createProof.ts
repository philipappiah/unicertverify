
const crypto = require('crypto'); // Import NodeJS's Crypto Module

export class Proof { // Our Chain Class
    timestamp:number
    data:object
    prevHash:string
    hash:string

    constructor(data:object, prevHash = "") {
        this.timestamp = Date.now(); // Get the current timestamp
        this.data = data; // Store whatever data is relevant 
        this.prevHash = prevHash // Store the previous Chain's hash
        this.hash = this.computeHash() // Compute this Chain's hash
    }
  
    computeHash() { // Compute this Chain's hash
        let strChain = this.prevHash + this.timestamp + JSON.stringify(this.data) // Stringify the Chain's data
        return crypto.createHash("sha256").update(strChain).digest("hex") // Hash said string with SHA256 encrpytion
    }

}


export class Chain { // Our Chainchain Object
    chain:[Proof]
    constructor() {
        this.chain = [this.startGenesisChain()] // Initialize a new array of Chains, starting with a genesis Chain
    }
    startGenesisChain() {
        return new Proof({}) // Create an empty Chain to start
    }
    obtainLatestChain() {
        return this.chain[this.chain.length - 1] // Get last Chain on the chain
    }
    addNewChain(newChain:Proof) { // Add a new Chain
        newChain.prevHash = this.obtainLatestChain().hash // Set its previous hash to the correct value
        newChain.hash = newChain.computeHash() // Recalculate its hash with this new prevHash value
        this.chain.push(newChain) // Add the Chain to our chain
    }

    addNewChainVariant(newChain:Proof, hash:string) { // Add a new Chain
        newChain.prevHash = hash // Set its previous hash to the correct value
        newChain.hash = newChain.computeHash() // Recalculate its hash with this new prevHash value
        this.chain.push(newChain) // Add the Chain to our chain
    }
    checkChainValidity() { // Check to see that all the hashes are correct and the chain is therefore valid
        for(let i = 1; i < this.chain.length; i++) { // Iterate through, starting after the genesis Chain
            const currChain = this.chain[i]
            const prevChain = this.chain[i -1]
            
            // Is the hash correctly computed, or was it tampered with?
            if(currChain.hash !== currChain.computeHash()) { 
                return false
            }
          
            // Does it have the correct prevHash value?; ie: What a previous Chain tampered with?
            if(currChain.prevHash !== prevChain.hash) {                 
              return false
            }
            
        }
        return true // If all the Chains are valid, return true
    }
}


// Create two test Chains with some sample data
let a = new Proof({from: "Joe", to: "Jane"})
let b = new Proof({from: "Jane", to: "Joe"})

 
let chain = new Chain() // Init our chain
chain.addNewChain(a) // Add Chain a
chain.addNewChainVariant(b, chain.obtainLatestChain().hash) // Add Chain b
console.log(chain.obtainLatestChain().hash)
console.log(chain) // Print out the Chainchain
console.log("Validity: " + chain.checkChainValidity()) // Check our chain for validity