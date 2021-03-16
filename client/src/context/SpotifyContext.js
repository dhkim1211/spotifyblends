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
  const [queue, setQueue] = useState([]);

  const addToPlaybackQueue = async () => {
    try {
      const response = await axios.post(`https://api.spotify.com/v1/me/player/queue?uri=${queue[0].uri}`, {}, {headers: {'Authorization': `Bearer ${token}`}});
      console.log('response', response)
      const songToRemove = queue[0];
      setQueue(queue.filter(track => track.uri !== songToRemove.uri));
      console.log('queue!', queue);
    } catch(err) {
      console.error('Could not add to playback queue', err.response);
    }
  } 

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
    setUserDeviceId,
    queue,
    setQueue,
    addToPlaybackQueue
  }), [playerLoaded, playerSelected, playerState, token, userDeviceId, queue]);

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

