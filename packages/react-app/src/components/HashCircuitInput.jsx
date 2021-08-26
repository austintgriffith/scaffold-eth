import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { useCircuitCalldata } from "../hooks";



export default function HashCircuitInput(props) {

  const [hash, setHash] = useState(15893827533473716138720882070731822975159228540693753428689375377280130954696);
  const [inputNum, setInputNum] = useState(0);
  const [threshold, setThreshold] = useState(0);
  // const [isValid, setIsValid] = useState(null);


  const [isValid, calldata] = useCircuitCalldata(
    "hash",
    ["x", "hash", "threshold"],
    [inputNum, hash, threshold]
  );
  // setIsValid(res1.toString());

  console.log(isValid);

  return (
    <div>
      <Input/>
    </div>
    
  )
}
