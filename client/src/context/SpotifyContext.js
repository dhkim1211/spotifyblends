import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios'

const SpotifyContext = React.createContext();

export const SpotifyProvider = (props) => {
  const children = props.children;
  const [token, setToken] = useState(null);
  const [playerLoaded, setPlayerLoaded] = useState();
  const [playerSelected, setPlayerSelected] = useState();
  const [playerState, setPlayerState] = useState();
  const [userDeviceId, setUserDeviceId] = useState();

  const providerValues = useMemo(() => ({
    playerLoaded,
    setPlayerLoaded,
    playerSelected, 
    setPlayerSelected,
    playerState,
    setPlayerState,
    token,
    setToken,
    userDeviceId,
    setUserDeviceId
  }), [playerLoaded, playerSelected, playerState, token, userDeviceId]);

  useEffect(() => {
    async function fetchAccessToken() {
      const result = await axios(
        'http://localhost:5000/auth/spotify/token',
      );
      console.log('result', result)
      setToken(result.data.accessToken);
    };
    fetchAccessToken();
  }, []);

  return (
    <SpotifyContext.Provider value={providerValues}>
      {children}
    </SpotifyContext.Provider>
  )
}

export const SpotifyConsumer = SpotifyContext.Consumer;

export default SpotifyContext;

