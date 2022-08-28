// SPDX-License-Identifier: GPL-3.0-or-later


pragma solidity ^0.8.7;

interface Certificate {

function updateProofChain (bytes memory _proofHash,  bytes [] memory signatures, string memory _url) external;

}


contract Issuer {


  struct CertIssue {
      address certificate;
      bytes messageHash;
      bool isValid;
      string ipfsHash;
      uint timeStamp;
  }

  struct TrusteeData {
      address _address;
      bool isValid;

  }




   mapping(bytes32 => mapping(address => bool)) public signedMsgs;
   mapping(bytes32 => uint) public approvals;
  

   TrusteeData [] public trustees;
   address public admin;
   uint public threshold;

  
  mapping (address => CertIssue[] ) private certificateData;
  uint noOfIssues;

  




  constructor (address [] memory _trustees, uint _threshold) {
      require( _threshold > 1, "Required approvals must be greater than 1");
      require( _trustees.length > 1, "Trustees must be greater than 1");
      require(_threshold <= _trustees.length, "Approvals cannot be more than no of trustees");
     for (uint i = 0; i < _trustees.length; i++){
         trustees.push(TrusteeData(_trustees[i], true));
     }
      threshold = _threshold;
      admin = msg.sender;

  }

 
  modifier onlyAdmin(){
      require(msg.sender == admin, "Can only be done by admin!");
      _;

  }


  function removeTrustee (address _trustee) public onlyAdmin {
      uint prevThreshold = threshold;

      require(--prevThreshold >= 2, "Threshold cannot be less than 2. Add a trustee first");
      
       for (uint i = 0; i < trustees.length; i++){
           if(trustees[i]._address == _trustee){
              trustees[i].isValid = false;
              threshold--;
           }
       }

  }


  function revokeProof (address _applicant, bytes memory proofHash, bytes [] memory signatures) public onlyAdmin {

        require(verifySigners(proofHash, signatures, true), "All signers required to revoke a proof");
        for (uint i = 0; i < certificateData[_applicant].length; i++ ){
           if ( keccak256(certificateData[_applicant][i].messageHash) == keccak256(proofHash) && certificateData[_applicant][i].isValid  ){
            certificateData[_applicant][i].isValid = false;
            noOfIssues--;
           }
       }

  }




 

  function changeAdmin (address _admin) public onlyAdmin {
      require(isValidSigner(_admin), "New admin must be a valid signer");
      admin = _admin;
  }


 


  

  function addTrustee (address _trustee) public onlyAdmin {
      trustees.push(TrusteeData(_trustee, true));
      threshold++;

  }


    function isTrustee(address _trustee) internal view returns (bool) {
       for (uint i = 0; i < trustees.length; i++){
           if(trustees[i]._address == _trustee){
               return true;
           }
       }
       return false;

  }


   function isValidSigner(address _trustee) internal view returns (bool) {
       for (uint i = 0; i < trustees.length; i++){
           if(trustees[i]._address == _trustee && trustees[i].isValid){
               return true;
           }
       }
       return false;

  }



  
  

  function verifySigners( bytes memory messageHash, bytes [] memory signedMessages, bool isVerifying ) public view returns (bool) {
        uint count = 0;
        // we need to make sure that each address is unique
        address tempAddress = address(0);
        for (uint i = 0; i < signedMessages.length; i++){
            uint8 v;
            bytes32 r;
            bytes32 s;
            (v, r, s) = splitSignature(signedMessages[i]);
           bytes32 message = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
           address signer = ecrecover(message, v, r, s);
           require(signer > tempAddress, "Addresses order not valid"); // check if the recovered address is unique and is also a trustee
           if (isVerifying){
               require(isTrustee(signer), "Not a trustee of the Issuer");
           }else{
                require(isValidSigner(signer), "Not a valid signer");
           }
           tempAddress = signer;

           count+=1;
        }

        return count == threshold;


        
    }



    function splitSignature(bytes memory signature) public  pure  returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        ){
        

        assembly {
          
            // get first 32 bytes
            r := mload(add(signature, 32))
           
            // get second 32 bytes 
            s := mload(add(signature, 64))
            
            // get first byte of the next 32 bytes
            v := byte(0, mload(add(signature, 96)))
        }

       return (v, r, s);


    }
    

 

 

  function issueProof (address _applicant, address _certificate, bytes memory messageHash, string memory _ipfsHash, 
  bytes [] memory signatures
   )  public {

        require(isTrustee(msg.sender), "Can be performed by trustees only");
        require(verifySigners(messageHash, signatures, false),"Signatures must not be less than the set threshold");
     
       
        Certificate(_certificate).updateProofChain(messageHash,signatures, _ipfsHash);
        
        certificateData[_applicant].push(CertIssue(_certificate, messageHash,true,_ipfsHash, block.timestamp));
        noOfIssues++;


  }






  function verifyProof (address _applicant, bytes memory proofHash, bytes [] memory signatures ) external  view returns (bool) {


       
       for (uint i = 0; i < certificateData[_applicant].length; i++ ){
           if ( keccak256(certificateData[_applicant][i].messageHash) == keccak256(proofHash) && certificateData[_applicant][i].isValid  ){

              if (verifySigners(proofHash, signatures, true)){
               return true;
              }

           }
       }
       return false;
 
        
  }



}