pragma solidity ^0.5.0;

contract Adoption {
    address[16] public adopters;

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);
        require(adopters[petId] == address(0), "already adopted pet");
        adopters[petId] = msg.sender;

        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }
    
    //Releasing a pet 
    function deleteAdopter(uint petId) public returns(uint) {
        require(msg.sender == adopters[petId], "Only adopters can call this function");

        if (adopters[petId] == msg.sender) {
            adopters[petId] = address(0);
            // delete adopters[petId]
        }

        return petId;
    }
}