# 📚 Background Info/ Setup

This scaffold-eth branch introduces a file upload component. 

![image](https://adaptiveclaim.s3.amazonaws.com/6299693.jpg)

🗝️ Currently, there are two ways to get data uploaded to IPFS...

1). Calling the 'addToIPFS' hook in a component in your app:

```bash
const addToIPFS = async fileToUpload => {
    for await (const result of ipfs.add(fileToUpload)) {
        return result
    }
}
```
or

2). Using the manifest approach which is showcased in the buyer-mints-nft branch:

Here the developer edits the 'artwork.js' file and publishes to IPFS via the 'upload.js' script.
This script uses the smae 'addToIPFS' hook that is shown in option one, the difference is this script can do a batch deploy of all your files/artwork. 

✴️ 3). This branch introduces a third method. Here we allow the user to upload an image from their device right into the app. Two methods are presented for tackling this scenario. The first is a traditional aws server setup which is detailed below. The second is a direct upload to IPFS option. Here image files can be uploaded to IPFS from a react app. This is useful for the various 'NFT creator' apps, allowing for more flexible image generation.



---------------Following-Steps-Related-To-AWS-Setup----------------------

3a. Sign in to AWS console or create account for free.

3b. Navigate to the S3 service and create a 'bucket' for the image data. It is important to set the permissions for this bucket to be public. Next update the 'Bucket Policy' to a very simple policy crated with the policy generator.

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::yourbucketname/*"
        }
    ]
}

```

Next, update the CORS policy with again a very simple policy which allows the 'PUT', 'HEAD', and 'GET' methods on this bucket.

```bash
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "HEAD",
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

Save and create the bucket. Back to our code in the component file 'BucketToIPFS.jsx' update the bucketname variable in the aws config section.

3c. Next, navigate to the Lambda aws services and set up the Lambda function that will process requests from the client application and return a secure upload URL for the client to use. 

Click 'Create Function', name the function 'getPresignedImageUrl' with node.js runtime enviroment. 

In the 'code' tab copy and paste the following:

```bash
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

const uploadBucket = "yourbucketname"

// Change this value to adjust the signed URLs expiration
const URL_EXPIRATION_SECONDS = 300

// Main Lambda entry point
exports.handler = async (event) => {
return await getUploadURL(event)
}

const getUploadURL = async function(event) {
const randomID = parseInt(Math.random() * 10000000)
const Key = `${randomID}.jpg`

// Get signed URL from S3
const s3Params = {
    Bucket: uploadBucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: 'image/jpeg',

    // This ACL makes the uploaded object publicly readable. You must also uncomment
    // the extra permission for the Lambda function in the SAM template.

    // ACL: 'public-read'
}

console.log('Params: ', s3Params)
const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

return JSON.stringify({
    uploadURL: uploadURL,
    Key
})
}
```

After updating the code be sure to test and deploy the code from the aws console. 

Next, we need a trigger for the Lambda function. The trigger is essentially a URL which is called from the client and initiates the lambda function. The lambda function returns a secure url and a key for the data, which will be uploaded to our bucket. 

On the Lambda services page in AWS click 'Add Trigger', next use the API Gateway option. Next select, 'Create an API' from the dropdown. Select 'HTTP API' as the API type. Security can be set to open or JWT token if your app support authentication token flow. Then click 'Add' to finish creating the trigger.

Navigate back to the Lambda services page on aws and find the 'details' for the trigger we just created. In the 'details' for the trigger there is a API endpoint which has been generated for us and we will use to get the upload URL and data key. Add this endpoint to the aws config variable in the BucketToIPFS.jsx code.

[AWS Docs for uploading to s3 from client](https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/)

Review section titled: 'Overview of serverless uploading to S3'. This is the main authentication flow for making PUT requests to an aws s3 bucket.

-------------------------------------------------------------------------------

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git image-upload-ipfs
cd image-upload-ipfs
git checkout image-upload-ipfs
```

> install and start your 👷‍ Hardhat chain:

```bash
cd image-upload-ipfs
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd image-upload-ipfs
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd image-upload-ipfs
yarn deploy
```
