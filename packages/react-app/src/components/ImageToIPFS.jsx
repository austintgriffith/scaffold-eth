import React, { useState, useEffect } from "react";
import { Button, Input, Col, Row, Spin, Card } from 'antd'

const { BufferList } = require('bl')
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

const DEBUG = true;

//AWS config
const bucketName = "adaptiveclaim";
const APIGatewayEndpoint = "https://py1mx7j0eh.execute-api.us-east-1.amazonaws.com/default/getPresignedImageUrl";


export default function BucketToIPFS() {

    const [ selectedFile, setSelectedFile ] = useState();
	const [ isSelected, setIsSelected ] = useState(false);
    const [ url, setURL ] = useState("");
    const [ uploadToS3Clicked, setUploadToS3Clicked ] = useState(false)

    // IPFS Bits:
    const [ sending, setSending ] = useState()
    const [ ipfsHash, setIpfsHash ] = useState()
    const [ ipfsContents, setIpfsContents ] = useState()
    const [ buffer, setBuffer ] = useState()

    const addToIPFS = async (fileToUpload) => {
        const result = await ipfs.add(fileToUpload)
        return result
    }

    const asyncGetFile = async ()=>{
        let result = await getFromIPFS(ipfsHash)
        setIpfsContents(result.toString())
    }

    const getFromIPFS = async hashToGet => {
        for await (const file of ipfs.get(hashToGet)) {
            console.log(file.path)
            if (!file.content) continue;
            const content = new BufferList()
            for await (const chunk of file.content) {
                content.append(chunk)
            }
            console.log(content)
            return content
        }
    }

    useEffect(()=>{
        if(ipfsHash) asyncGetFile()
    },[ipfsHash])

    let ipfsDisplay = ""
    if(ipfsHash){
        if(!ipfsContents){
            ipfsDisplay = (
                <Spin />
            )
        }else{
            ipfsDisplay = (
                <pre style={{margin:8,padding:8,border:"1px solid #dddddd",backgroundColor:"#ededed"}}>
                {ipfsContents}
                </pre>
            )
        }
    }

    // AWS bits:
    const [ signedURL, setSignedURL ] = useState();

    // When file is selected, get a uploadURL from aws. Use "getPresignedImageUrl" Lambda endpoint URL generated in aws.
    const changeHandler = async (event) => {

        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

		setSelectedFile(event.target.files[0]);
        const file = event.target.files[0];
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result))
            console.log("buffer: ", buffer)
        }
		setIsSelected(true);

        await fetch(APIGatewayEndpoint, requestOptions)
        .then(response => response.json())
        .then(result => setSignedURL(result))
        .catch(error => console.log('error', error));
	};

    const handleSubmission = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "image/jpeg");

        let requestOptions2 = {
            method: 'PUT',
            headers: myHeaders,
            body: selectedFile,
            redirect: 'follow'
        };

        await fetch(signedURL.uploadURL, requestOptions2)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

        setUploadToS3Clicked(true)
	};

    useEffect(()=>{
        if(signedURL) setURL("https://"+bucketName+".s3.amazonaws.com/"+signedURL.Key)
    },[uploadToS3Clicked])
	
    if (DEBUG) console.log("Selected File Properties: ", selectedFile)
    if (DEBUG) console.log("Signed url: ", signedURL)
    if (DEBUG) console.log("AWS PIC URL: ", url)

    return (
        <div style={{margin:'32px'}}>

            <h1 > Image Handling </h1>

            <Row justify="center">
                <Col span={10}>
                    <Input 
                    type="file"
                    accept="image/*"
                    onChange={changeHandler}
                    />
                    <Button
                    style={{margin:"18px"}}
                    type="primary"
                    disabled = {!selectedFile}
                    onClick={handleSubmission}
                    >
                    Upload to S3
                    </Button>
                    <Button
                    type="primary"
                    disabled={!selectedFile}
                    onClick={ async () => {
                        console.log("UPLOADING...")
                        console.log(buffer)
                        setSending(true)
                        setIpfsHash()
                        setIpfsContents()

                        const result = await addToIPFS(buffer)
                        if(result && result.path) {
                            setIpfsHash(result.path)
                        }
                        setSending(false)
                    }}>
                    Upload to IPFS
                    </Button>
                    {isSelected && signedURL ? (
                        <div>
                            <p>Filename: {selectedFile.name}</p>
                            <p>Filetype: {selectedFile.type}</p>
                            <p>Size in bytes: {selectedFile.size}</p>
                            <p>
                                lastModifiedDate:{' '}
                                {selectedFile.lastModifiedDate.toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <p>Select a file to show details</p>
                    )}
                </Col>
            </Row>
                        
            <Row justify="center" >
                <Col span={10}>
                    <Card >
                        <img src={url} style={{width:"300px"}}/>
                    </Card>
                    {signedURL ? (
                        <div >
                            <p>SignedUrl: {signedURL.uploadURL.slice(0,50)+"..."}</p>
                            <p>Key: {signedURL.Key}</p>
                        </div>
                    ) : (
                        <p>For preview, click 'Upload to S3'.</p>
                    )}
                </Col>
                <Col span={10}>
                    <Card >
                        {ipfsHash ? (
                            <img src={"https://ipfs.io/ipfs/"+ipfsHash} style={{width:"300px"}}/>
                        ) : (
                            <p >{""}</p>
                        )}
                    </Card>
                    <a href={"https://ipfs.io/ipfs/"+ipfsHash} target="blank">{ipfsHash}</a>
                </Col>
            </Row>
            <div style={{margin:'42px'}}>
                <p style={{margin:'42px'}}>{"(Built using scaffold-eth and AWS s3.)"}</p>
            </div>

        </div>
    );

}