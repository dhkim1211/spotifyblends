const express = require('express');
const router = express.Router();
const spotifyApi = require('../../config/spotify');

const envFilePath = (typeof process.env.NODE_ENV !== 'undefined') ? `${process.env.NODE_ENV}.env` : '.env';
try {
    require('dotenv').config({
        path: `./${envFilePath}`
    })
} catch (e) {}

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}

router.get('/', isAuthenticated, (req, res) => {
  spotifyApi.setAccessToken(req.user.accessToken);

  spotifyApi.getMe()
    .then((data) => {
      console.log('Some information about the authenticated user', data.body);
      res.json(data.body);
    }, (err) => {
      console.log('Something went wrong!', err);
    });
})

module.exports = router;