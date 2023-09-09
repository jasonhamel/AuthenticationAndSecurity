import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
import md5 from "md5";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", (req, res) => {
  const enteredUsername = req.body.username;
  const enteredPassword = req.body.password;
  User.findOne({ username: enteredUsername })
    .then((foundUser) => {
      if (foundUser.password === md5(enteredPassword)) {
        res.render("secrets");
      }
    })
    .catch((err) => {
      console.log(err);
      res.render("login");
    });
});

app.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: md5(req.body.password),
  });
  newUser
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen("3000", () => {
  console.log("App started on port 3000");
});
