const fs = require("fs");
const http = require("http");
const express = require('express');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/drawing.html', (req, res) => {
  res.sendFile(path.join(__dirname, './drawing.html'));
});

const uploadImage = async (req, res, next, data) => {

  try {

      // to declare some path to store your converted image
      const path = './images/'+Date.now()+'.png'

      console.log(req.body.base64image)
      const imgdata = req.body.base64image;

      // to convert base64 format into random filename
      const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      
      fs.writeFileSync(path, base64Data,  {encoding: 'base64'});

      return res.send(path);

  } catch (e) {
      next(e);
  }
}

app.post('/profile', (req, res, next) => {
  uploadImage(req, res, next)
})

app.get('/animation.html', (req, res) => {
  res.sendFile(path.join(__dirname, './animation.html'));
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

fs.readdir("./images", (err, files) => {
  console.log(files.length);
  let number_of_images = files.length;
});
