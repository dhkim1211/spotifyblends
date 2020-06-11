const express = require('express');
const router = express.Router();
const passport = require('passport');
const spotifyApi = require('../../config/spotify');
const User = require('../../models/User');

const envFilePath = (typeof process.env.NODE_ENV !== 'undefined') ? `${process.env.NODE_ENV}.env` : '.env';
try {
    require('dotenv').config({
        path: `./${envFilePath}`
    })
} catch (e) {}

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/auth/login');
}

router.get('/login', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-private', 'user-top-read', 'playlist-read-private'], showDialog: true}),
  (req, res) => {
  });

router.get('/callback/', passport.authenticate('spotify', { failureRedirect: '/auth/login' , successRedirect: '/api/profile'}),
  (req, res) => {
    console.log('res', res)
    res.redirect('/api/profile');
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', isAuthenticated, (req, res) => {
  console.log('req', req);
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