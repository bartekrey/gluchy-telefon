const fs = require("fs");
const http = require("http");
const express = require('express');
const path = require('path');
const app = express();
const httpServer = http.createServer(app);
require('dotenv').config()


const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region : 'eu-central-1'
})

var s3Bucket = new aws.S3({
  params: {
    Bucket: process.env.S3_BUCKET_NAME,
  }
});

const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/images', express.static(path.join(__dirname, 'images')))

const counter = require("./counter.json")
var number_of_images = counter.counter;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get('/drawing.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/drawing.html'));
  var liczba = number_of_images;
  console.log(liczba);
  res.render(__dirname + "/views/drawing.html", {
    liczba: liczba
  });
});

app.get('/animation.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/animation.html'));
  var liczba = number_of_images;
  console.log(liczba);
  res.render(__dirname + "/views/animation.html", {
    liczba: liczba
  });
});


uploaded = false;

const uploadImage = async (req, res, next, data) => {
  // to declare some path to store your converted image
  const path = './images/' + number_of_images + '.png'

  console.log("Dostałem kod obrazka w base64")
  const imgdata = req.body.base64image;

  // to convert base64 format into random filename
  //const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

  buf = Buffer.from(req.body.base64image.replace(/^data:image\/\w+;base64,/, ""), 'base64')

  var data = {
    Bucket: "gluchy-telefon",
    Key: number_of_images + '.png',
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };
  s3Bucket.putObject(data, function(err, data) {
    if (err) {
      console.log(err);
      console.log('Error uploading data: ', data);
    } else {
      console.log('successfully uploaded the image!');

      let counter = require("./counter.json")
      counter.counter +=1
      fs.writeFileSync ("./counter.json", JSON.stringify(counter));
    }
  });
}

app.post('/profile', (req, res, next) => {
  uploadImage(req, res, next);
//  uploaded = true;
})

if (uploaded == true) {
  console.log("uploaded == true");

}




/*
app.post('/profile', type, function (req, res) {
  console.log("I'm in app.post /profile")
  s3.upload(req, function(err, data) {
    console.log(err, data);
  });
})
*/
