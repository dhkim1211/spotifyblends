const express = require('express');
const router = express.Router();
const passport = require('passport');
const spotifyService = require('../../services/spotify');

const envFilePath = (typeof process.env.NODE_ENV !== 'undefined') ? `${process.env.NODE_ENV}.env` : '.env';
try {
    require('dotenv').config({
        path: `./${envFilePath}`
    })
} catch (e) {}

router.get('/login', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-private', 'user-top-read', 'playlist-read-private', 'streaming'], showDialog: true}),
  (req, res) => {
  });

router.get('/callback/', passport.authenticate('spotify', { failureRedirect: '/auth/login'}),
  (req, res) => {
    console.log('req', req.user);
    res.redirect('http://localhost:3000/dashboard/#')
    
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('req', req.user);

  try {
    const userProfile = await spotifyService.fetchProfile(req.user._id, req.user.refreshToken);
    const userTopArtists = await spotifyService.fetchTopArtists(req.user._id, req.user.accessToken, req.user.refreshToken);
    const userTopTracks = await spotifyService.fetchTopTracks(req.user._id, req.user.accessToken, req.user.refreshToken);

    res.json({
      userProfile,
      userTopArtists,
      userTopTracks
    })
  } catch(err) {
    console.log('Error fetching profile', err);
  }

})

module.exports = router;