var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("D:\Web Devlopment\h3mart\src\routes\index.js");
});
module.exports = router;
