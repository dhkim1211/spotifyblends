import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import SpotifyContext from '../../context/SpotifyContext';

const Search = () => {
  const { token, queue, setQueue, addToPlaybackQueue } = useContext(SpotifyContext);
  const [query, setQuery] = useState();
  const [searchResults, setSearchResults] = useState();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const results = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {headers: {'Authorization': `Bearer ${token}`}});
      console.log('results', results.data.tracks.items);
      setSearchResults(results.data.tracks.items);
    } catch(err) {
      console.log('Could not fetch search results', err);
    }
  }

  const handleAddToQueue = async (trackInfo) => {
    // Add to queue state
    // Add to database
    console.log('queue', queue);
    localStorage.setItem('spotify-queue', JSON.stringify(queue.concat(trackInfo)));
    await setQueue(queue.concat(trackInfo));

    console.log('queue', queue)
  }

  const handleSetQuery = (e) => {
    if (e.target.value === '') {
      setSearchResults([]);
      setQuery();
    } else {
      setQuery(e.target.value);
    }
  }

  const handleClearQuery = () => {
    setQuery('');
    setSearchResults([]);
  }

  //TODO: Own component
  const listSearchResults = searchResults && searchResults.map((result) => {
    const trackInfo = {
      uri: result.uri,
      artist: result.artists[0].name,
      track: result.name,
      image: result.album.images[2].url
    }

    return (
      <tr key={result.id.toString()}>
        <td>
          <img className="search-result-cover" src={result.album.images[2].url} alt={result.album.name} />
        </td>
        <td>
          <table>
            <tbody>
              <tr className="nestedTr">
                <td className="search-result-track">{result.name}</td>
              </tr>
              <tr className="nestedTr">
                <td className="search-result-artist">{result.artists[0].name}</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <i onClick={() => handleAddToQueue(trackInfo)} className="fa fa-plus"></i>
        </td>
      </tr>
    )
  });

  return (
    <div className="search-container col s4">
      <div className="row search-box-container">
        <form onSubmit={handleOnSubmit}>
          <input value={query || ''} onChange={e => handleSetQuery(e)} type="text" className="search-input" placeholder="Enter artist or track name" />
          { query && <i className="fa fa-times" onClick={handleClearQuery}></i>}
          <button type="submit">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </form>
      </div>
      {searchResults && query &&
        <div className="search-results-container">
          <table>
            <tbody>
              {
                searchResults.length ? 
                listSearchResults : 
                (
                  !query && <p>No results found</p>
                )
              }
            </tbody>
          </table>
        </div>
      }
    </div>
    
  )
};

export default Search;