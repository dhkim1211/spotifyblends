import React, { Fragment, useContext } from "react";
import WebPlayback from '../spotify/WebPlayback';
import NowPlaying from '../spotify/NowPlaying';
import Search from '../spotify/Search';
import SpotifyContext from '../../context/SpotifyContext';
import UserQueue from '../spotify/UserQueue';

window.onSpotifyWebPlaybackSDKReady = () => {};

const Room = () => {
  const {
    token,
    playerLoaded,
    playerSelected,
    playerState,
  } = useContext(SpotifyContext);

  // console.log('token', token)

  return (
    <div className="container-fluid valign-wrapper">
      <div className="row">
        {/* {!userAccessToken && <IntroScreen />} */}
          {token &&
              <WebPlayback>
                {!playerLoaded &&
                  <h2 className="action-orange">Loading Player</h2>
                }

                {playerLoaded && !playerSelected && 
                  <Fragment>
                    <h2 className="action-green">Loading Player</h2>
                    <h2 className="action-orange">Waiting for device to be selected</h2>
                    <p>On a Spotify Client, open the device picker, and choose "Spotify React Player".</p>
                  </Fragment>
                }

                {playerLoaded && playerSelected && !playerState &&
                  <Fragment>
                    <h2 className="action-green">Loading Player</h2>
                    <h2 className="action-green">Waiting for device to be selected</h2>
                    <h2 className="action-orange">Start playing music ...</h2>
                  </Fragment>
                }

                {playerLoaded && playerSelected && playerState &&
                  <Fragment>
                    <NowPlaying playerState={playerState} />
                    <Search />
                    <UserQueue />
                  </Fragment>
                  
                }
                
              </WebPlayback>
          }
      </div>
    </div>
  );
}

export default Room;
