// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.7;

interface CertcurrentIssuer {
    function verifyProof(address _applicant, bytes memory dataHash, bytes [] memory signers ) external view returns (bool);
}

interface Unicert {
     function isValidIssuer (address _issuer) external view returns (bool);
}

contract Certificate {

 address public currentIssuer;
 address public unicert;
 uint public noOfIssuers;
 address public owner;
 bytes public currProofHash;
 string public ipfsHash;
 bool public isPrivate;

 address[] public issuers;


 

 mapping(address => bool) signed;

 
 
 struct ViewRequests {
     bool approved;
     bool executed;
 }

 mapping (address => ViewRequests) public viewRequests;

 mapping (bytes => bytes) public proofChain;

 mapping (bytes => string) public ipfsHashes;

 mapping (bytes => bytes []) private proofHashSigners;

 mapping (bytes => uint) public levelProof;

 mapping (bytes => address) public proofIssuer;

 uint public viewRequestsCount;
 uint public chainIndex;


 
  constructor ( address _unicert, address _current_issuer, bool _private) {
      owner = msg.sender;
      unicert = _unicert;
      currentIssuer = _current_issuer;
      isPrivate = _private;
      issuers.push(_current_issuer);
      noOfIssuers++;
     
  }



  modifier currentIssuerOnly(){
        require(msg.sender == currentIssuer);
        _;
    }

  modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

  modifier unicertOnly () {
      require(msg.sender == unicert);
      _;
  }


 function setcurrentIssuer (address _issuer) public onlyOwner {
      currentIssuer = _issuer;
      issuers.push(_issuer);
      noOfIssuers++;

 }


 function changeVisibility () public onlyOwner {
     isPrivate = !isPrivate;
 }

  function isIssuer(address _issuer) internal view returns (bool) {
       for (uint i = 0; i < issuers.length; i++){
           if(issuers[i] == _issuer){
               return true;
           }
       }
       return false;

  }

  function getProofSignersLength (bytes memory _proofHash) public view returns (uint) {
      return proofHashSigners[_proofHash].length;
  }

  function getProofSigners(bytes memory _proofHash,uint index) public view returns (bytes memory) {


      if(isPrivate){
        require(viewRequests[msg.sender].approved, "Request has not been approved");
     }

     return proofHashSigners[_proofHash][index];

  }


 function updateProofChain( bytes memory _newProofHash,   bytes [] memory signatures, string memory _ipfsHash) external {
     require(Unicert(unicert).isValidIssuer(currentIssuer), "Not a Valid issuer");
     require(isIssuer(msg.sender), "can only be updated by an issuer");
     proofChain[_newProofHash] = currProofHash;
     proofHashSigners[_newProofHash] = signatures;
     levelProof[_newProofHash] = chainIndex;
     currProofHash = _newProofHash;
     ipfsHashes[_newProofHash] = _ipfsHash;
     proofIssuer[_newProofHash] = msg.sender;
     ipfsHash = _ipfsHash;
     chainIndex++;
     
 }
 



 function createViewrequest () public {
   viewRequests[msg.sender] = ViewRequests(false,false);
   viewRequestsCount++;
 }


 function approveViewRequest(address requester) public onlyOwner {
     viewRequests[requester].approved = true;
 }


 function removeViewRequest(address requester) public onlyOwner{
      viewRequests[requester].approved = false;
     
 }





 function verify(bytes memory dataHash) public view returns (bool) {
    // check if certificate access is set to private or public
    // if the certificate access is set to private, student must approve viewer before verification can be done
    // the access can be modified anytime by the student

     if(isPrivate){
        require(viewRequests[msg.sender].approved, "Request has not been approved");
     }

    
    // check that the credential being verified has been signed
     if (proofHashSigners[dataHash].length <= 0){
        return false;
     }
     // all good. verification can be done now
    return CertcurrentIssuer(proofIssuer[dataHash]).verifyProof(address(owner), dataHash, proofHashSigners[dataHash]);

 }




}