require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const User = require("./model/user");
const auth = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()); // Middleware for JSON
app.use(cookieParser()); //Middleware for cookies

app.get("/", (req, res) => {
  res.send("<h1>Hello From app.js - Authentication System</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(email && password && firstname && lastname)) {
      res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email }); //PROMISE

    if (existingUser) {
      res.status(401).send("User already exists");
    }

    const myEncPass = await bcrypt.hash(password, 10); //Hashing password using bcryptjs (search npm for more details)

    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myEncPass,
    });

    //Token Creation
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;

    //Before sending the 'user' back as response,
    //MAKING PASSWORD UNDEFINED

    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(`There's some fkin' error - \n ${error}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Field is missing");
    }

    const user = await User.findOne({ email });

    // if (!user) {
    //   res
    //     .status(400)
    //     .send("Seems like you're not registered. Please register first");
    // }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      // res.status(200).json(user);

      //If cookies are to be used - (else uncomment the above line)

      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true, //Can be seen only by the backend server
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });

      return;
    }

    res.status(400).send("Email or password is incorrect");
  } catch (error) {
    console.log(`There's some fkin' error in login - \n ${error}`);
  }
});

app.get("/logout", (req, res) => {
  console.log(`Request body in logout - \n ${JSON.stringify(req.cookies)}`);
  res.cookie("token", "", {
    expires: new Date(Date.now() + 1),
    httpOnly: true,
  });
  res.redirect("/");
});

app.get("/dashboard", auth, (req, res) => {
  res.send("This is some secret information");
});

module.exports = app;
