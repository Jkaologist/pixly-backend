const express = require("express");
const cors = require("cors");
const aws = require('aws-sdk'); // ^2.2.41
const multer = require('multer'); // "multer": "^1.1.0"
const multerS3 = require('multer-s3'); //"^1.4.1"
const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require("./expressError");
const {secretAccessKey, accessKeyId} = require("./config")
const app = express();

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
        key: function (req, file, cb) {
            console.log(file);
            cb(null, `${uuidv4()}.jpeg`);
        }
    })
});

//used by upload form
app.post('/upload', upload.single("file"), function (req, res, next) {
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