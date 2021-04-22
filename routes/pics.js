const { uploadFile } = require("../upload");

const express = require("express");
const router = new express.Router();


router.post("/", async function (req, res, next) {
  const imagePath = req.body
  console.log("IMAGE PATH!", imagePath)
  //await uploadFile(imagePath)
  return {"success": "success"}
});

module.exports = router