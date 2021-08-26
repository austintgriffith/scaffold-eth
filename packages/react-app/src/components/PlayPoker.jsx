import React, { useState, useCallback, useMemo } from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useContractLoader, useContractExistsAtAddress, genSolidityCalldata, mimcHash } from "../hooks";
import DisplayVariable from "./Contract/DisplayVariable";
import FunctionForm from "./Contract/FunctionForm";
import { Transactor } from "../helpers";

export default function PlayPoker({customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer}) {
    const contracts = useContractLoader(provider);
    
    let contract
    contract = contracts ? contracts[name] : "";
    

    const address = contract ? contract.address : "";
    const contractIsDeployed = useContractExistsAtAddress(provider, address);
    const [refreshRequired, triggerRefresh] = useState(false);
    const tx = Transactor(provider, gasPrice);
    const displayedContractFunctions = useMemo(
        () =>
          contract
            ? Object.values(contract.interface.functions).filter(
                fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
              )
            : [],
        [contract, show],
      );
    //console.log("functions: ", displayedContractFunctions)

    function ReturnFunctionForm(fn){
        return <FunctionForm 
            key={"FF" + fn.name}
            contractFunction={(fn.stateMutability === "view" || fn.stateMutability === "pure")?contract[fn.name]:contract.connect(signer)[fn.name]}
            functionInfo={fn}
            provider={provider}
            gasPrice={gasPrice}
            triggerRefresh={triggerRefresh}/>
    }

    function ReturnDisplayVariable(fn){
        return <DisplayVariable 
            key={fn.name} contractFunction={contract[fn.name]} 
            functionInfo={fn} refreshRequired={fn} 
            triggerRefresh={triggerRefresh}/>
    }

    

    const playerCardCommit = contractIsDeployed ? displayedContractFunctions[0] : null
    const playerCardCommitForm = contractIsDeployed ? ReturnFunctionForm(playerCardCommit) : null

    const playerCardHash = contractIsDeployed ? displayedContractFunctions[6] : null

    const placeBet = contractIsDeployed ? displayedContractFunctions[4] : null
    const placeBetForm = contractIsDeployed ? ReturnFunctionForm(placeBet) : null

    const playerBet = contractIsDeployed ? displayedContractFunctions[5] : null
    const playerBetForm = contractIsDeployed ? ReturnDisplayVariable(playerBet) : null

    const dealCard = contractIsDeployed ? displayedContractFunctions[2] : null
    const dealCardForm = contractIsDeployed ? ReturnFunctionForm(dealCard) : null

    const thresholdVariable = contractIsDeployed ? displayedContractFunctions[3] : null
    const thresholdForm = contractIsDeployed ? ReturnDisplayVariable(thresholdVariable) : null

    const submitProofForm = contractIsDeployed ? ReturnFunctionForm(displayedContractFunctions[8]) : null
    const win = contractIsDeployed ? ReturnDisplayVariable(displayedContractFunctions[10]) : null
    

    const [seed, setSeed] = useState();
    const [seedCommit, setSeedCommit] = useState();
    // const [cardCommit, setCardCommit] = useState(0);
    const [isValid, setIsValid] = useState(null);
    const [callData, setCallData] = useState([]);
    const [hash, setHash] = useState();
    const [threshold, setThreshold] = useState();
    const [a, setA] = useState();
    const [b, setB] = useState();
    const [c, setC] = useState();
    const [input, setInput] = useState();
    

    async function getValue(contractFunction, setVariable, triggerRefresh, number){
        const refresh = async () => {
            try {
            const funcResponse = await contractFunction();
            if (number) {
                setVariable(funcResponse.toNumber());
            } else{
                setVariable(funcResponse.toString());
            }
            triggerRefresh(false);
            } catch (e) {
            console.log(e);
            }
        };
        refresh()
    }
        
  
  
    async function CircuitCalldata(seed, hash, threshold) {
  
      const { proof, publicSignals } =
        await window.snarkjs.groth16.fullProve({ "x": seed, "hash": hash, "threshold":threshold },
        "/circuits/hash_circuit.wasm",
        "/circuits/hash_circuit_final.zkey");
  
      const vKey = await fetch("/circuits/hash_verification_key.json").then(function(res) {
        const js = res.json();
        return js;
      });
  
      const res = await window.snarkjs.groth16.verify(vKey, publicSignals, proof);
      const genCallData = await genSolidityCalldata(publicSignals, proof);
      return [res, genCallData];
    }
    
  
    const handleIsValid = async () => {
      const [res, genCallData] = await CircuitCalldata(seedCommit, hash, threshold);
      setIsValid(res.toString());
      setA(genCallData[0]);
      setB(genCallData[1]);
      setC(genCallData[2]);
      setInput(genCallData[3]);
    };

    return(
        <div>
        <div style={{padding:100}}>
            <span>
                <Input
                    size="large"
                    placeholder={"Enter secret seed!!"}
                    value={seed}
                    onChange={async e => {
                        const newSeed = e.target.value;
                        setSeed(newSeed);
                        // TODO: Import MIMC hash function and set hash to the correct function
                        setSeedCommit(mimcHash(newSeed).value.toString());
                        // setHash("15893827533473716138720882070731822975159228540693753428689375377280130954696")
                    }}
                    suffix={
                        <Tooltip title="Commit your secret seed!!">
                        <Button
                            onClick={() => {
                                setSeedCommit(mimcHash(seed).value.toString());
                            }}
                            shape="circle"
                            icon={<SendOutlined />}
                        />
                        </Tooltip>
                    }
                />

                <h2>
                    Check your Mimc hash {seedCommit}
                </h2>
            </span>
            <span>
                {playerCardCommitForm}
                {placeBetForm}
                {playerBetForm}
                {dealCardForm}
                {thresholdForm}
                <Button 
                    // TODO Figure out async handling in react and combine this button with the next
                    onClick={async()=>{
                        getValue(contract[thresholdVariable.name], setThreshold, triggerRefresh, true);
                        getValue(contract[playerCardHash.name], setHash, triggerRefresh, false);                        
                    }}
                    size="large"
                >
                    Prepare zk proof
                </Button>
                <Button 
                    onClick={async() => {
                        //await getValue(contract[thresholdVariable.name], setThreshold, triggerRefresh, true);
                        //await getValue(contract[playerCardHash.name], setHash, triggerRefresh, false);
                        await handleIsValid();
                    }}
                    size="large"
                >
                    Generate zk proof
                </Button>
                <h2></h2>
                <p>{a}</p>
                <h2></h2>
                <p>{b}</p>
                <h2></h2>
                <p>{c}</p>
                {submitProofForm}
                {win}
                
                {/*
            
                <Button
                    onClick={async() => {
                        // TODO parse callData information
                        //console.log(callData)
                        //const returned = await tx(contract['submitProof'](callData[0], callData[1], callData[2], callData[3]));
                    }}>
                    Upload zk proof
                </Button>*/}
                <h2>
                    Your proof is {isValid}
                </h2>
            </span>
        </div>
      </div>
    )
}