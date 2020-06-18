import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
import axios from 'axios';



const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState();
  const [topArtists, setTopArtists] = useState();
  const [topTracks, setTopTracks] = useState();

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost:5000/auth/spotify/profile',
      );
 
      setProfile(result.data.userProfile);
      setTopArtists(result.data.userTopArtists);
      setTopTracks(result.data.userTopTracks);
    };
 
    fetchData();
  }, []);

  console.log('profile', profile);

  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
        <div className="landing-copy col s12 center-align">
          <h4>
            <b>Hey there,</b> {user.name.split(" ")[0]}
            <p className="flow-text grey-text text-darken-1">
              You are logged into a full-stack{" "}
              <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
            </p>
          </h4>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem"
            }}
            onClick={() => {store.dispatch(logoutUser())}}
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Logout
          </button>
          {profile ? '' : (
            <a href="http://localhost:5000/auth/spotify/login">
              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
              >
                Link Spotify Account 
              </button>
            </a>
          )}
          
        </div>
        <div className="col s12 center-align">
          {profile ? (
            <p>{profile.display_name} - {profile.followers.total} followers - {profile.product === 'premium' ? 'Premium User' : 'Free User'}</p>
          ) : ''}
          <div className="row">
            { topArtists ? (
              <div className="topArtists col m6">
                <h3>Your top artists:</h3>
                <ul>
                {topArtists.map((artist) => 
                  <p key={artist.name}>{artist.name}</p>
                )}
                </ul>
              </div>
            ) : ''}
            { topTracks ? (
              <div className="topTracks col m6">
                <h3>Your top tracks:</h3>
                <ul>
                {topTracks.map((track) => 
                  <p key={track.name}>{track.name} - {track.artist}</p>
                )}
                </ul>
              </div>
            ) : ''}
          </div>
          
          <Link to="/room/1234">
            <button
              style={{
                width: "200px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              className="btn btn-large waves-effect waves-light hoverable green accent-3"
            >
              Listen 
            </button>
          </Link>
          
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
