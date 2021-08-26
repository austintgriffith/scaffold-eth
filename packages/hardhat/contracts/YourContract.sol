pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT
 
// import "hardhat/console.sol";
import "./hashVerifier.sol"; 
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Verifier {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Testing ZK Proofs!!";
  uint256 public seedCommit;
  uint256 public playerCardContractRandomness;
  uint256 public playerCardHash;
  uint256 public playerBet;
  uint256 public dealerCard;
  uint256 public currentStep = 0;
  bool public win = false;
  // uint256 public verifiedHash;
  // uint256 public verifiedGreater;

  constructor() public {
    // what should we do on deploy?
  }
  function commitToRandonmess(uint256 newSeedCommit) public {
    require(currentStep == 0, "You've already commited to a seed.");
    seedCommit = newSeedCommit;
    playerCardCtractRandomness = uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));
    currentStep ++;
  }

  function commitToCard(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[3] inputs) public {
    require(currentStep == 1, "You've already commited to a card.");
    // require(verifyProof(a, b, c, input), "Invalid Proof"); TODO: write circuit for this one
    require(input[1] == seecCommit);
    require(input[2] == playerCardCtractRandomness);
    playerCardHash = input[0];
    currentStep ++;
  }
  
  function placeBet(uint bet) public {
      require(currentStep == 1, "You haven't chosen a card.");
      playerBet = bet;
      currentStep ++;
  }

  function dealCard() public {
      require(currentStep == 2, "You haven't selected a bet.");
        uint dealerCardRandomness = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );
        dealerCard = dealerCardRandomness % 13 + 1;
        currentStep ++;
  }

  function submitProof(
      uint[2] memory a,
      uint[2][2] memory b,
      uint[2] memory c,
      uint[4] memory input
  ) public {
    require(currentStep == 3, "Dealer hasn't drawn a card.");
    require(verifyProof(a, b, c, input), "Invalid Proof");
    require(input[0] == playerCardHash, "Invalid Card");
    require(input[3] == dealerCard, "Invalid Card");
    if (input[1] == 1) win = true;
    currentStep++;
  }

  // function testVerifyProof(
  //         uint[2] memory a,
  //         uint[2][2] memory b,
  //         uint[2] memory c,
  //         uint[4] memory input
  //     ) public {
  //     require(verifyProof(a, b, c, input), "Invalid Proof");
  //     verifiedHash = input[0];
  //     verifiedGreater = input[1];
  // }
}
