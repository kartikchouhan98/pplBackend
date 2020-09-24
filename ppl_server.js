const express = require("express");
const cors = require("cors");
const app = express();
var multer = require("multer");
const dotenv = require("dotenv");
const authRouter = require("./Router/authRouter");

dotenv.config();
process.env.TOKEN_SECRET;

const jwt = require("jsonwebtoken");

const port = 1818;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var ppl_time_db = require("./time_schema");

var ppl_db = require("./ppl_schema");
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect("mongodb://localhost:27017/ppldatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRouter);

app.get("/routename", (req, res) => {
  console.log("got a call");
  res.send(res);
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + "new");
  },
});
var upload = multer({ storage: storage });

app.post("/upload", upload.single("pic"), function (req, res) {
  ppl_time_db.create(req.body, (err, result) => {
    if (err) {
      console.log("err", err);
      res.send("data got", err);
    } else {
      console.log("result", result);
      res.send(result);
    }
  });
  console.log("req.file", req.file);

  console.log("req.body", req.body);
});

app.post("/forgot", (req, res) => {
  console.log("data from user", req.body);

  ppl_db.findOne({ email: req.body.email }, (err, exist) => {
    if (err) {
      console.log(err);
    }
    if (exist) {
      res.send("Email for password reset sent!");
    } else {
      res.send("Email is not registered!");
    }
  });
});

app.listen(port, () => {
  console.log(`server is working at http://localhost:${port}`);
});
