var ethers = require("ethers");
var express = require("express");
var fs = require("fs");
const https = require("https");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

let cache = {};
let currentMessage =
  "I am **ADDRESS** and I would like to sign in to YourDapp, plz!";

//Uncomment this if you want to create a wallet to send ETH or something...
// const INFURA = JSON.parse(fs.readFileSync("./infura.txt").toString().trim())
// const PK = fs.readFileSync("./pk.txt").toString().trim()
// let wallet = new ethers.Wallet(PK,new ethers.providers.InfuraProvider("goerli",INFURA))
// console.log(wallet.address)
// const checkWalletBalance = async ()=>{
//   console.log("BALANCE:",ethers.utils.formatEther(await wallet.provider.getBalance(wallet.address)))
// }
// checkWalletBalance();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  console.log("/");
  res.status(200).send(currentMessage);
});

app.get("/:message", function (req, res) {
  console.log("/message", req.params);
  const message = req.params.message.toLowerCase();
  res.status(200).send(cache[message] || []);
});

app.post("/", async function (request, response) {
  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip, request.body.message);
  console.log(request.body);

  let recovered = ethers.utils.verifyMessage(
    request.body.message,
    request.body.signature
  );
  if (recovered == request.body.address) {
    console.log("RECOVERED", recovered);

    recovered = recovered.toLowerCase();

    if (!cache[request.body.message]) {
      cache[request.body.message] = [];
    }

    let signedIn = false;

    if (!cache[request.body.message].includes(recovered)) {
      cache[request.body.message].push(recovered);
      signedIn = true;
    }
    console.log(cache);
    response.send(signedIn);
  }
});
// app.post('/send', async function(request, response){
//   let sendResult = await wallet.sendTransaction({
//     to: request.body.address,
//     value: ethers.utils.parseEther("0.01")
//   })

// });
// app.post("/delete", async function (request, response) {
//   cache[request.body.message].splice(request.body.index, 1);
//   response.send("Successfully deleted!");
// });

/*
  maybe you want to send them some tokens or ETH?
let sendResult = await wallet.sendTransaction({
  to: request.body.address,
  value: ethers.utils.parseEther("0.01")
})
*/

if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
  https
    .createServer(
      {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      },
      app
    )
    .listen(45622, () => {
      console.log("HTTPS Listening: 45622");
    });
} else {
  var server = app.listen(45622, function () {
    console.log("HTTP Listening on port:", server.address().port);
  });
}
