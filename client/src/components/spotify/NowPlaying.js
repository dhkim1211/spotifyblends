import React from 'react';

const NowPlaying = (props) => {
  let {
    playerState,
    playerState: { position: position_ms }
  } = props;

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
      images: [{ url: album_image }]
    }
  } = playerState.track_window.current_track;

  return (
    <div className="panel panel-default">
      <div className="panel-heading">Now Playing View</div>
      <div className="panel-body">
        <img src={album_image} alt={track_name} />

        <h4><a href={track_uri}>{track_name}</a> by <a href={artist_uri}>{artist_name}</a></h4>
        <h4><a href={album_uri}>{album_name}</a></h4>
        <h4>ID: {id} | Position: {position_ms} | Duration: {duration_ms}</h4>

        {/* <div className='song-progress-container'>
          <p className='timer-start'>{moment().minutes(0).second(this.state.timeElapsed).format('m:ss')}</p>
          <div className='song-progress'>
            <div style={{ width: this.state.timeElapsed * 16.5 }} className='song-expired' />
          </div>
          <p className='timer-end'>{moment().minutes(0).second(30 - this.state.timeElapsed).format('m:ss')}</p>
        </div> */}
      </div>
    </div>
  )
}

export default NowPlaying;