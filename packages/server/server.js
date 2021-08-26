const express = require("express");
const path = require("path");

const app = express();
const port = 5000;

const createProxyMiddleware = require('http-proxy-middleware');




app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname+ '/../'));

module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
      })
    );
  };

//app.get('/', function(req, res) {
//    console.log('dirname', __dirname)
//    res.sendFile(path.join(__dirname + '/../react-app/public/index.html'));
//});

app.listen(port, () => {
    console.log('Server is running on port: 5000');
})
