include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"

template Main() {
  signal private input x;
  signal input hash;
  signal input threshold;
  
  signal output outHash;
  signal output outValid;

  /*
    Verify that the player indeed has the card
  */

  component mimc = MiMCSponge(1, 220, 1);
  mimc.ins[0] <== x;
  mimc.k <== 0;

  outHash <== mimc.outs[0];
  outHash === hash;

  /*
    TODO: Verify that the dealer has the given threshold
  */

  /*
    Verify that player card is larger than threshold
    outValid = 1 if x less than threshold;
    outValid = 1 if x >= threshold
  */

  component greater = LessThan(11);
  greater.in[0] <== x;
  greater.in[1] <== threshold;

  outValid <== greater.out; 
}

component main = Main();
