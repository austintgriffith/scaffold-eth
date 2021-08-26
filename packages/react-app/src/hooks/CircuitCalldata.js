import { useEffect, useState } from "react";
const ffjavascript = require('ffjavascript');
const {stringifyBigInts: stringifyBigInts$3, unstringifyBigInts: unstringifyBigInts$1} = ffjavascript.utils;
// const fs = require("fs");
// const snarkjs = require("snarkjs");


// copy pasta p256 from snarkjs cli.cjs line 6726
function p256(n) {
    let nstr = n.toString(16);
    while (nstr.length < 64) nstr = "0"+nstr;
    nstr = `"0x${nstr}"`;
    return nstr;
}

// copy pasta zkeyExportSolidityCalldata from snarkjs cli.cjs line 6984 with some modifications.
async function genSolidityCalldata(publicName, proofName) {

    const pub = unstringifyBigInts$1(publicName);
    const proof = unstringifyBigInts$1(proofName);

    let inputs = "";
    for (let i=0; i<pub.length; i++) {
        if (inputs != "") inputs = inputs + ",";
        inputs = inputs + p256(pub[i]);
    }

    let S;
    if ((typeof proof.protocol === "undefined") || (proof.protocol == "original")) {
        S=`[${p256(proof.pi_a[0])}, ${p256(proof.pi_a[1])}],` +
          `[${p256(proof.pi_ap[0])}, ${p256(proof.pi_ap[1])}],` +
          `[[${p256(proof.pi_b[0][1])}, ${p256(proof.pi_b[0][0])}],[${p256(proof.pi_b[1][1])}, ${p256(proof.pi_b[1][0])}]],` +
          `[${p256(proof.pi_bp[0])}, ${p256(proof.pi_bp[1])}],` +
          `[${p256(proof.pi_c[0])}, ${p256(proof.pi_c[1])}],` +
          `[${p256(proof.pi_cp[0])}, ${p256(proof.pi_cp[1])}],` +
          `[${p256(proof.pi_h[0])}, ${p256(proof.pi_h[1])}],` +
          `[${p256(proof.pi_kp[0])}, ${p256(proof.pi_kp[1])}],` +
          `[${inputs}]`;
    } else if ((proof.protocol == "groth16")||(proof.protocol == "kimleeoh")) {
        S=`[${p256(proof.pi_a[0])}, ${p256(proof.pi_a[1])}],` +
          `[[${p256(proof.pi_b[0][1])}, ${p256(proof.pi_b[0][0])}],[${p256(proof.pi_b[1][1])}, ${p256(proof.pi_b[1][0])}]],` +
          `[${p256(proof.pi_c[0])}, ${p256(proof.pi_c[1])}],` +
          `[${inputs}]`;
    } else {
        throw new Error("InvalidProof");
    }

    return S;
}

export default async function useCircuitCalldata(circuitName, signalNames, signalValues) {

  if (typeof circuitName != "string") {
    throw new Error("useCircuitCalldata: circuitName not a string")
  }

  function genInputObj(sigNs, sigVs) {
    if (sigNs.length == sigVs.length) {
      let inputObj = {};
      for (let i = 0; i < sigNs.length; i++) {
        inputObj[sigNs[i]] = sigVs[i];
      }
      return inputObj;
    } else {
      throw new Error("useCircuitCalldata: Signal Names & Values have different lengths");
    }
  }

  const [signalInputs, setSignalInputs] = useState(() => genInputObj(signalNames, signalValues));
  useEffect(() => {
    setSignalInputs(genInputObj(signalNames, signalValues));
  }, [circuitName, signalNames, signalValues]);

  async function genProve(inputSigs) {
    const { proof, pubSigs } = await window.snarkjs.groth16.fullProve(
      inputSigs,
      `/react-app/src/circuits/${circuitName}_circuit.wasm`,
      `/react-app/src/circuits/${circuitName}_circuit_final.zkey`
    );

    return [pubSigs, proof];
  }

  const [proofs, setProofs] = useState(() => genProve(signalInputs));
  useEffect(() => {
    setProofs(genProve(signalInputs));
  }, [signalInputs]);

  async function verify(pub, pru) {
    const vKey = await fetch(`/react-app/src/circuits/${circuitName}_verification_key.json`).then(function(res) {
      return res.json();
    });
    //const vKey = JSON.parse(fs.readFileSync(`../circuits/${circuitName}_verification_key.json`).toString('utf-8'));
    const res = await window.snarkjs.groth16.verify(vKey, pub, pru);
    console.log(res)
    return res;
  }

  const [isValid, setIsValid] = useState(() => verify(proofs[0], proofs[1]));
  useEffect(() => {
    setIsValid(verify(proofs[0], proofs[1]));
  }, [proofs]);

  const [calldata, setCalldata] = useState(genSolidityCalldata(proofs[0], proofs[1]));
  useEffect(() => {
    setCalldata(genSolidityCalldata(proofs[0], proofs[1]));
  }, [proofs]);

  return [isValid, calldata];

}