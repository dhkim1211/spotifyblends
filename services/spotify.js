const User = require('../models/User');
const querystring = require('querystring');
const spotifyApi = require('../config/spotify');
const axios = require('axios');

module.exports = {
  refreshAccessToken: async (id, refreshToken, callback) => {
    const encodeThis = process.env.SPOTIFY_API_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET;
    const buffer = Buffer.from(encodeThis);
    const toBase64 = buffer.toString('base64');
  
    const data = querystring.stringify({'grant_type':'refresh_token', 'refresh_token': refreshToken});
    const headers = {
      'Authorization': `Basic ${toBase64}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  
    try {
      const newAccessToken = await axios.post('https://accounts.spotify.com/api/token', data, { headers: headers});
      spotifyApi.setAccessToken(newAccessToken.data.access_token);
  
      const user = await User.findById(id);
      user.accessToken = newAccessToken.data.access_token;
      await user.save(function(){});

      if (callback) {
        callback(newAccessToken.data.access_token);
      } else {
        return newAccessToken.data.access_token;
      }
      
    } catch(err) {
      console.log('Could not refresh Access Token', err.response.data);
    }
  },
  fetchProfile: async (id, refreshToken) => {
    try {
      const profile = await spotifyApi.getMe();
      return profile.body;
    } catch(err) {
      console.log('Could not fetch profile', err);
      if (err.statusCode == 401) {
        await module.exports.refreshAccessToken(id, refreshToken, module.exports.fetchProfile);
      }
    }
  },
  fetchTopArtists: async (id, accessToken, refreshToken) => {
    try {
      const topArtists = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term', {headers: {'Authorization': `Bearer ${accessToken}`}});
      const consolidatedTopArtists = topArtists.data.items.map((artist) => {
        return {
          name: artist.name,
          genres: artist.genres,
          images: artist.images
        }
      })
      return consolidatedTopArtists;
    } catch(err) {
      console.log('Could not fetch top artists', err.response.data);
      if (err.response.status == 401) {
        await module.exports.refreshAccessToken(id, refreshToken, module.exports.fetchTopArtists);
      }
    }
  },
  fetchTopTracks: async (id, accessToken, refreshToken) => {
    try {
      const topTracks = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=long_term', {headers: {'Authorization': `Bearer ${accessToken}`}})
      const consolidatedTopTracks = topTracks.data.items.map((track) => {
        return {
          name: track.name,
          artist: track.artists[0].name,
          image: track.album.images[0]
        }
      })
      // console.log('consolidatedTopTracks', consolidatedTopTracks)
      return consolidatedTopTracks;
    } catch(err) {
      console.log('Could not fetch top artists', err.response.data);
      if (err.response.status == 401) {
        await module.exports.refreshAccessToken(id, refreshToken, module.exports.fetchTopArtists);
      }
    }
  },
  createPlaylist: async (userId, accessToken, refreshToken) => {
    const playlistData = {
      'name': 'Spotify Blends QUEUE',
      'description': 'Queue for Spotify Blends app'
    }
    try {
      const playlist = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, playlistData, {headers: {'Authorization': `Bearer ${accessToken}`}});
      console.log('playlist', playlist.data.id)
      return { id: playlist.data.id };
    } catch(err) {
      console.log('Could not create playlist', err.response.data);
      return {
        error: 'Could not create playlist'
      }
    }
  }
}



