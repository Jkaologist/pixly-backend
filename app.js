const express = require("express");
const cors = require("cors");
const aws = require('aws-sdk'); // ^2.2.41
const multer = require('multer'); // "multer": "^1.1.0"
const multerS3 = require('multer-s3'); //"^1.4.1"
const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require("./expressError");
const { secretAccessKey, accessKeyId } = require("./config")
const { addToDb, getAllFromDb } = require("./helpers")
const app = express();
const ExifImage = require('exif').ExifImage;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

aws.config.update({
    secretAccessKey,
    accessKeyId,
    region: 'us-west-1'
});

const s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'pixlypics',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, `${uuidv4()}.jpeg`);
        }
        
    })
});

// async function getPic(Id) {
//   var params = { Bucket: 'pixlypics', Key: "7d8d2256-05c7-4096-b72f-ec6c7effa15c.jpeg" };
//   const res = await s3.getObject(params, function(err, data) {
//     if (err)
//     return err;
//   });
//   console.log("inside get pic!", res)
//   return res;
// }

app.get("/", async function (req, res, next) {
  const result = await getAllFromDb()
  return res.json(result)
})

//req.file.location - gives us the url of the uploaded image
//used by upload form
app.post('/upload', upload.single("file"), async function (req, res, next) {
  await addToDb(req.file.key, req.file.location)
  res.send("Uploaded!");
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;