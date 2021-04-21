const { uploadFile } = require("./upload");

const express = require("express");
const router = new express.Router();


router.post("/", async function (req, res, next) {
  const imageObject = req.body
  console.log("IMAGE OBJECT!", imageObject)
  uploadFile(imageObject)
  return {"success": "success"}
});
