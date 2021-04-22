const { uploadFile } = require("../upload");

const express = require("express");
const router = new express.Router();

router.post("/", async function (req, res, next) {
  console.log("ARE WE IN THE POST??!?!!??!!??!")
  console.log("Req.body", req.body)
  // console.log("IMAGE PATH!", imagePath)
  // await uploadFile(imagePath)
  return res.json({ "message" : `success` })
});

module.exports = router;