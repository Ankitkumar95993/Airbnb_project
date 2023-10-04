const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./Config/database");
const User = require("./Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "adkadoenfdd3235";

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

database.dbConnect();
app.use(express.json());

app.get("/test", (req, res) => {
  res.json("test Ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = new User({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    userDoc.save();
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("Pass not matched");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// console.log({__dirname});
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = 'photo'+Date.now()+".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName)
});

app.listen(4000, () => {
  console.log("app is running on port no 4000");
});
 