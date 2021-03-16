const envFilePath = (typeof process.env.NODE_ENV !== 'undefined') ? `${process.env.NODE_ENV}.env` : '.env';
try {
    require('dotenv').config({
        path: `./${envFilePath}`
    })
} catch (e) {}

const mongoose = require("mongoose");
const User = mongoose.model("users");
const SpotifyStrategy = require('passport-spotify').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const spotifyService = require('../services/spotify');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({_id: id}, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
          User.findById(jwt_payload.id)
            .then(user => {
              if (user) {
                return done(null, user);
              }
              return done(null, false);
            })
            .catch(err => console.log(err));
        })
      );

  passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
      // asynchronous verification, for effect...
      profile.accessToken = accessToken;
      console.log('passport profile', profile)
      console.log('passport aToken', accessToken)
      console.log('passport rToken', refreshToken)

      User.findOne({email: profile.emails[0].value}, function(err, user) {
          console.log('findONe')

          if (err) return done(err);

          if (user) {
            spotifyService.createPlaylist(profile.id, accessToken, refreshToken, (err, playlistId) => {
                if (err) return done(err, {message: 'Playlist could not be created'});
                console.log('err', err)
                console.log('playlistId', playlistId.id);

                user.queueId = playlistId.id;
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                user.save();

                return done(null, user);

                
            })

              
          }
          else {
              console.log('not found user')
            let queuePlaylistId;
            console.log('queuePlaylistId ', queuePlaylistId);

            spotifyService
                .createPlaylist(profile.id, accessToken, refreshToken)
                .then(function(playlistId) {
                    console.log('playlistID', playlistId)
                    queuePlaylistId = playlistId;
                })
                .catch(function(err) {
                    console.log('error', error)
                    return done(err, {message: 'Playlist could not be created'});
                })

                console.log('queuePlaylistId: ', queuePlaylistId);

              User.create({
                  name: profile.id,
                  email: profile.emails[0].value,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  product: profile.product,
                  queueId: queuePlaylistId
              }, (err, newUser) => {
                  console.log('newuser', newUser);
                  if (err) return done(err);

                  if (!newUser) return done(null, {message: 'New user could not be created'});

                  return done(null, newUser);
              })
          }

      })
  }));
};
