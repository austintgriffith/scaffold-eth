import { Input } from "antd";
import React, { useEffect, useState } from "react";

const { utils, constants } = require("ethers");

/*
  ~ What it does? ~

  Displays input field with options to convert between STRING and BYTES32

  ~ How can I use? ~

  <BytesStringInput
    autofocus
    value={"scaffold-eth"}
    placeholder="Enter value..."
    onChange={value => {
      setValue(value);
    }}
  />

  ~ Features ~

  - Provide value={value} to specify initial string
  - Provide placeholder="Enter value..." value for the input
  - Control input change by onChange={value => { setValue(value);}}

*/

export default function BytesStringInput(props) {
  const [mode, setMode] = useState("STRING");
  const [display, setDisplay] = useState();
  const [value, setValue] = useState(constants.HashZero);

  // current value is the value in bytes32
  const currentValue = typeof props.value !== "undefined" ? props.value : value;

  const option = title => {
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (mode === "STRING") {
            setMode("BYTES32");
            if (!utils.isHexString(currentValue)) {
              /* in case user enters invalid bytes32 number,
                   it considers it as string and converts to bytes32 */
              const changedValue = utils.formatBytes32String(currentValue);
              setDisplay(changedValue);
            } else {
              setDisplay(currentValue);
            }
          } else {
            setMode("STRING");
            if (currentValue && utils.isHexString(currentValue)) {
              setDisplay(utils.parseBytes32String(currentValue));
            } else {
              setDisplay(currentValue);
            }
          }
        }}
      >
        {title}
      </div>
    );
  };

  let addonAfter;
  if (mode === "STRING") {
    addonAfter = option("STRING 🔀");
  } else {
    addonAfter = option("BYTES32 🔀");
  }

  useEffect(() => {
    if (!currentValue) {
      setDisplay("");
    }
  }, [currentValue]);

  return (
    <Input
      autoComplete="off"
      placeholder={props.placeholder ? props.placeholder : "Enter value in " + mode}
      autoFocus={props.autoFocus}
      value={display}
      addonAfter={addonAfter}
      onChange={async e => {
        const newValue = e.target.value;
        if (mode === "STRING") {
          // const ethValue = parseFloat(newValue) / props.price;
          // setValue(ethValue);
          if (typeof props.onChange === "function") {
            props.onChange(utils.formatBytes32String(newValue));
          }
          setValue(utils.formatBytes32String(newValue));
          setDisplay(newValue);
        } else {
          if (typeof props.onChange === "function") {
            props.onChange(newValue);
          }
          setValue(newValue);
          setDisplay(newValue);
        }
      }}
    />
  );
}
