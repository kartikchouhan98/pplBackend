const express = require("express");
const authRouter = express.Router();
const apiCaller = require("../API/apiCaller");
const dotenv = require("dotenv");
const verifyToken=require("./verifyToken")
dotenv.config();
process.env.ACCESS_TOKEN_SECRET;

const jwt = require("jsonwebtoken");

function generateAccessToken(data) {
  return jwt.sign(data,  process.env.ACCESS_TOKEN_SECRET, {});
}



authRouter.post("/adduser", (req, res) => {
  apiCaller
    .usernameCheck(req.body)
    .then((exist) => {
      console.log("exist", exist);
      if (exist) {
        console.log("username exists");
        res.send({ msg: "username already taken", ele: "user_border" });
      } else {
        apiCaller
          .emailCheck(req.body)
          .then((exist) => {
            if (exist) {
              res.send({
                msg: "user with this email already exist",
                ele: "email_border",
              });
            } else {
              apiCaller.addUser(req.body).then((result) => {
                console.log("result", result);
                res.send({ msg: "SignUp successful" });
              });
            }
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
});

authRouter.post("/login", (req, res) => {
  apiCaller
    .emailCheck(req.body)
    .then((exist) => {
      if (exist) {
        apiCaller.passwordCheck(req.body).then((result) => {
          console.log("result", result);
          if (result) {
            const token = generateAccessToken(req.body.email);
            console.log("user Logged in!");
            res.send({ msg: "Logged in!", token });
          } else {
            res.send({ msg: "Incorrect Password!" });
          }
        });
      } else {
        res.send({ msg: "user not found" });
      }
    })
    .catch((err) => console.error(err));
});

authRouter.post("/forgot", (req, res) => {
  console.log("data from user", req.body);

  apiCaller
    .emailCheck(req.body)
    .then((exist) => {
      if (exist) {
        res.send("Email for password reset sent!");
      } else {
        res.send("Email is not registered!");
      }
    })
    .catch((err) => console.error(err));
});

authRouter.post("/verify", verifyToken, (req, res) => {
  res.send({
    success: true
  })
});

module.exports = authRouter;
