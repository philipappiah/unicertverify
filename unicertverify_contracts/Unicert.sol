// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.7;


contract Unicert {

    struct issuerMeta {
        string name;
        bool valid;

    }

    address [] public trustees;
    mapping (address => issuerMeta) public issuerDetail;

    address [] public admins;


    constructor (address [] memory _admins) {
        admins = _admins;
    }


    function isAdmin () internal view returns (bool) {
        for (uint i = 0; i < admins.length; i++){
            if (admins[i] == msg.sender){
                return true;
            }
        }

        return false;
    }

   function isValidIssuer (address _issuer) external view returns (bool) {

       return issuerDetail[_issuer].valid;

   }

   function removeIssuer (address _issuer) public {
       require(isAdmin(), "Can be performed by only admins");
       issuerDetail[_issuer].valid = false;
   }


    function addIssuer(address _issuer,  string memory _name) public   {
           require(isAdmin(), "Can be performed by only admins");
           issuerDetail[_issuer] = issuerMeta(_name, true);

           
    }





}