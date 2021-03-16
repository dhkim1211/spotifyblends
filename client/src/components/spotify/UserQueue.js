import React, { useContext, useEffect } from 'react';
import SpotifyContext from '../../context/SpotifyContext';

const UserQueue = () => {
  const { queue, setQueue, addToPlaybackQueue } = useContext(SpotifyContext);

  const handleRemoveFromQueue = (removeTrack) => {
    setQueue(queue.filter(track => track.uri !== removeTrack.uri));
  }

  const userQueueList = queue && queue.map(track => {
    return (
      <tr key={track.uri}>
        <td>
          <img className="search-result-cover" src={track.image} alt={track.track} />
        </td>
        <td>
          <table>
            <tbody>
              <tr className="nestedTr">
                <td className="search-result-track">{track.track}</td>
              </tr>
              <tr className="nestedTr">
                <td className="search-result-artist">{track.artist}</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <i onClick={() => handleRemoveFromQueue(track)} className="fa fa-times"></i>
        </td>
      </tr>
    )
  })

  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('spotify-queue'));
    console.log('savedQueue', savedQueue)
    if (savedQueue) {
      setQueue(savedQueue);
    }
  }, []);

  return (
    <div className="queue-container col s4">
      <h5>Queue</h5>
      <div className="queue-wrapper">
        <table>
          <tbody>
            {userQueueList} 
          </tbody>
        </table> 
      </div>
      <button onClick={addToPlaybackQueue} className="btn">Add to playback queue</button>
    </div>
  )
};

export default UserQueue;