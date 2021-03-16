import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import SpotifyContext from '../../context/SpotifyContext';

const NowPlaying = (props) => {
  const { token, userDeviceId, addToPlaybackQueue } = useContext(SpotifyContext);

  let {
    playerState,
    playerState: { position: position_ms }
  } = props;

  // console.log('playerstate', playerState)
  let {
    id,
    uri: track_uri,
    name: track_name,
    duration_ms,
    artists: [{
      name: artist_name,
      uri: artist_uri
    }],
    album: {
      name: album_name,
      uri: album_uri,
      images: [{},{},{ url: album_image }]
    }
  } = playerState.track_window.current_track;

  const msToTime = (s) => {

    // Pad to 2 or 3 digits, default is 2
    const pad = (n, z) => {
      z = z || 2;
      return ('00' + n).slice(-z);
    }
  
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
  
    return pad(mins) + ':' + pad(secs) 
  }

  let currentPosition = msToTime(position_ms);
  let trackDuration = msToTime(duration_ms);

  const pausePlayback = async () => {
    try {
      const response = await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${userDeviceId.device_id}`, {}, {headers: {'Authorization': `Bearer ${token}`}});
    } catch(err) {
      console.log('Could not pause playback', err.response);
    }
  }

  const resumePlayback = async () => {
    try {
      const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${userDeviceId.device_id}`, {}, {headers: {'Authorization': `Bearer ${token}`}});
    } catch(err) {
      console.log('Could not pause playback', err.response);
    }
  }

  // TODO: Better way to trigger
  useEffect(() => {
    const minuteLeftInPlayback = (duration_ms - position_ms) < 60000 && (duration_ms - position_ms) > 59925;
    console.log('minuteLeftInPlayback', minuteLeftInPlayback);
    if (minuteLeftInPlayback) {
      addToPlaybackQueue();
    }
  }, [playerState.position])


  return (
    <div className="now-playing-container col s4">
      <div className="now-playing-body">
        <img src={album_image} alt={track_name} className="now-playing-cover"/>
        <h5><a href={track_uri}>{track_name}</a></h5>
        <h6><a href={artist_uri}>{artist_name}</a></h6>
        <div className='song-progress-container'>
          <p className='timer-start'>{currentPosition}</p>
          <div className='song-progress'>
            <div style={{ width: position_ms / duration_ms * 100 + '%' }} className='song-expired' />
          </div>
          <p className='timer-end'>{trackDuration}</p>
        </div>
        <div className='song-controls'>

          <div className='play-pause-btn'>
            {playerState.paused ? (
              <i onClick={() => resumePlayback()} className={"fa fa-play fa-3x"} aria-hidden="true" />
            ) : (
              <i onClick={() => pausePlayback()} className={"fa fa-pause fa-3x"} aria-hidden="true" />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default NowPlaying;