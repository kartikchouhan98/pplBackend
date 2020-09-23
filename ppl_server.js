const express = require("express");
const cors = require("cors");
const app = express();
var multer = require("multer");
const dotenv = require("dotenv");

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

function generateAccessToken(username) {
  return jwt.sign(username, "hello", {});
}

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log("auth", token);
  if (token == null) return res.sendStatus(401);
  console.log("passed ");
  req.token=token
  next();
  ;
}
app.post("/verify", authenticateToken, (req, res) => {
  jwt.verify(req.token, "hello", (err, user) => {

    console.log(err);
    if (err) return res.sendStatus(403);
    console.log("verify",user);
    res.send({
      success:true
    })
  })
});

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

app.post("/adduser", (req, res) => {
  console.log("data from user", req.body);
  ppl_db.findOne({ username: req.body.username }, (err, exist) => {
    if (err) {
      console.log(err);
    }
    if (exist) {
      console.log("username exists");
      res.send({ msg: "username already taken", ele: "user_border" });
    } else {
      ppl_db.findOne({ email: req.body.email }, (err, exist) => {
        if (err) {
          console.log(err);
        }

        if (exist) {
          console.log("user with this email already exists");
          res.send({
            msg: "user with this email already exist",
            ele: "email_border",
          });
        } else {
          console.log("user doesn't exist");
          ppl_db.create(req.body, (err, result) => {
            if (err) {
              console.log("err", err);
              res.send("data got", err);
            } else {
              console.log("result", result);
              res.send({ msg: "SignUp successful" });
            }
          });
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  console.log("data from user", req.body);

  ppl_db.findOne({ email: req.body.email }, (err, exist) => {
    if (err) {
      console.log(err);
    }
    if (exist) {
      ppl_db.findOne({ password: req.body.password }, (err, match) => {
        if (err) {
          console.log(err);
        }

        if (match) {
          const token = generateAccessToken(req.body.email);
          console.log("user Logged in!");
          res.send({ msg: "Logged in!", token });
        } else {
          res.send("Incorrect Password!");
        }
      });
    } else {
      res.send("user not found");
    }
  });
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
