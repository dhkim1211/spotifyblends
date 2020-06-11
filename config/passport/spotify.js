const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User');

module.exports = (passport) => {

    passport.use(new SpotifyStrategy({
            clientID: process.env.SPOTIFY_CLIENTID,
            clientSecret: process.env.SPOTIFY_CLIENTSECRET,
            callbackURL: process.env.SPOTIFY_CALLBACK_URL
        },
        (accessToken, refreshToken, profile, done) => {
            // asynchronous verification, for effect...
            profile.accessToken = accessToken;

            User.findOne({name: profile.id}, function(err, user) {

                if (err) return done(err);

                if (user) {
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken;
                    user.save();

                    return done(null, user);
                }
                else {
                    User.create({
                        name: profile.id,
                        spotifyId: profile.id,
                        email: profile.email,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }, (err, newUser) => {
                        if (err) return done(err);

                        if (!newUser) return done(null, {message: 'New user could not be created'});

                        return done(null, newUser);
                    })
                }

            })
        }));

}