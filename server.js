const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

const users = require("./routes/api/users");
const spotify = require("./routes/auth/spotify");
const profile = require("./routes/api/profile");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000'
}))

// load .env file
const envFilePath = (typeof process.env.NODE_ENV !== 'undefined') ? `${process.env.NODE_ENV}.env` : '.env';
try {
    require('dotenv').config({
        path: `./${envFilePath}`
    })
} catch (e) {}

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/auth/spotify", spotify);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
