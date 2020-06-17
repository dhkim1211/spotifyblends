import React, { Component, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
import axios from 'axios';

const Room = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState();

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await axios(
  //       'http://localhost:5000/auth/spotify/profile',
  //     );
 
  //     setProfile(result.data);
  //   };
 
  //   fetchData();
  // }, []);

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
        </div>
        <div className="col s12 center-align">
          {profile ? (
            <p>{profile.display_name} - {profile.followers.total} followers - {profile.product === 'premium' ? 'Premium User' : 'Free User'}</p>
          ) : ''}
          
        </div>
      </div>
    </div>
  );
}

export default Room;
