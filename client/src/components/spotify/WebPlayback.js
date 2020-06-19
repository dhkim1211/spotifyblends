import React, { Fragment, useContext, useEffect } from 'react';
import SpotifyContext from '../../context/SpotifyContext';
import axios from 'axios';

const WebPlayback = (props) => {
  const {
    token,
    setToken,
    setPlayerLoaded,
    setPlayerSelected,
    setUserDeviceId,
    setPlayerState
  } = useContext(SpotifyContext);

  let deviceSelectedInterval = null;
  let statePollingInterval = null;
  let webPlaybackInstance = null;

  const webPlaybackSdkProps = {
    playerName: "Spotify Blends Player",
    playerInitialVolume: 1.0,
    playerRefreshRateMs: 100,
    playerAutoConnect: true,
    onPlayerError: (playerError => console.error(playerError))
  };

  async function handleState(state) {

    if (state) {
      setPlayerState(state);
    } else {
      let {
        _options: { id: device_id }
      } = webPlaybackInstance;

      clearStatePolling();
      // setPlayerSelected(true); 
      setUserDeviceId(device_id);

      await waitForDeviceToBeSelected();
      setPlayerSelected(true)
    }
  }

  const startStatePolling = async () => {
    statePollingInterval = setInterval(async () => {
      let state = await webPlaybackInstance.getCurrentState();
      await handleState(state);
    }, webPlaybackSdkProps.playerRefreshRateMs || 1000);
  }

  const clearStatePolling = () => {
    clearInterval(statePollingInterval);
  }

  const waitForSpotify = () => {
    return new Promise(resolve => {
      if ('Spotify' in window) {
        console.log('spotify in window')
        resolve();
      } else {
        console.log('spotify not in window')
        window.onSpotifyWebPlaybackSDKReady = () => { resolve(); };
      }
    });
  }

  const waitForDeviceToBeSelected = () => {
    return new Promise(resolve => {
      deviceSelectedInterval = setInterval(() => {
        if (webPlaybackInstance) {
          webPlaybackInstance.getCurrentState().then(state => {
            if (state !== null) {
              startStatePolling();
              clearInterval(deviceSelectedInterval);
              resolve(state);
            }
          });
        }
      });
    });
  }

  async function setupWebPlaybackEvents() {
    console.log('settingup')
    let { Player } = window.Spotify;
    let {
      playerName,
      playerInitialVolume,
    } = webPlaybackSdkProps;

    webPlaybackInstance = new Player({
      name: playerName,
      volume: playerInitialVolume,
      getOAuthToken: async callback => {
        if (typeof token !== "undefined") {
          let userAccessToken = token;
          callback(userAccessToken);
        }
      }
    });

    async function refreshAccessToken() {
      const newToken = await axios.get('http://localhost:5000/auth/spotify/refreshToken');
      console.log('newToken', newToken)
      setToken(newToken.accessToken);
    }
    
    webPlaybackInstance.on("initialization_error", ({ message }) => {
      console.error(message);
      console.log('init error')
    });
    
    webPlaybackInstance.on("authentication_error", async ({ message }) => {
      console.error(message);
      console.log('auth error')
      await refreshAccessToken();
      console.log('token', token)
      setupWebPlaybackEvents();
    });

    webPlaybackInstance.on("account_error", ({ message }) => {
      console.error(message);
    });

    webPlaybackInstance.on("playback_error", ({ message }) => {
      console.error(message);
    });

    webPlaybackInstance.on("player_state_changed", async state => {
      await handleState(state);
    });

    webPlaybackInstance.on("ready", data => {
      // setPlayerSelected(true); 
      setUserDeviceId(data);
    });

    if (webPlaybackSdkProps.playerAutoConnect) {
      webPlaybackInstance.connect();
    }
  }

  const setupWaitingForDevice = () => {
    return new Promise(resolve => {
      webPlaybackInstance.on("ready", data => {
        resolve(data);
      });
    });
  }

  const playbackSetupFlow = async () => {
    setPlayerLoaded(true)
    console.log('loading')
      
    await waitForSpotify();
    console.log('waiting for spotify')
    
    await setupWebPlaybackEvents();
    console.log('setupplaybackevents')
    
    let device_data = await setupWaitingForDevice();
    console.log('device_data', device_data)
    // setPlayerSelected(true); 
    setUserDeviceId(device_data);
    console.log('waitingfordevice')

    await waitForDeviceToBeSelected();
    console.log('waitfordevicetobeselected')
    setPlayerSelected(true)
  }

  useEffect(() => {
    playbackSetupFlow();
  }, []);

  return (<Fragment>{props.children}</Fragment>);

}

export default WebPlayback;
