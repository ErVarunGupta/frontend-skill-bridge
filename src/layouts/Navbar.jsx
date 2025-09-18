import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { MyContext } from "../MyContext";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="navbar">
      <div className="left_navbar">
        <div className="skill_bridge_icon">
          <NavLink to="/dashboard/home" className="skill_bridge_link"
          >
            Skill Bridge
          </NavLink>
        </div>
      </div>
      <div className="right_navbar">
        <p>
          <NavLink to="/dashboard/home" className={({isActive}) => isActive? "nav_links active": "nav_links deactive"}>
            Home
          </NavLink>
        </p>
        <hr />
        <p>
          <NavLink to="/dashboard/upcoming_sessions" className={({isActive}) => isActive? "nav_links active": "nav_links deactive"}>
            Upcoming Session
          </NavLink>
        </p>
        <hr />
        <p>
          <NavLink to="/dashboard/accepted_requests" className={({isActive}) => isActive? "nav_links active": "nav_links deactive"}>
            Accepted Requests
          </NavLink>
        </p>
        <hr />
        <p>
          <NavLink to="/dashboard/accepted_offers" className={({isActive}) => isActive? "nav_links active": "nav_links deactive"}>
            Accepted Offers
          </NavLink>
        </p>
        <hr />
        <p>
          <NavLink to="/dashboard/completed_requests" className={({isActive}) => isActive? "nav_links active": "nav_links deactive"}>
            Completed Requests
          </NavLink>
        </p>
        <hr />
        <div
          className="profile_icon"
          onClick={() => setShowProfile(!showProfile)}
        >
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      {showProfile && <ProfileCard />}
    </div>
  );
}

export const ProfileCard = () => {
  const navigate = useNavigate();
  const decoded = jwtDecode(localStorage.getItem('token'));
  const userId = decoded.id;
  // const {userProfile} = useContext(MyContext);
  // console.log(userProfile)

  const logout = () => {
    localStorage.clear();
    setTimeout(()=>{
      navigate("/login")
    },1000);
  };
  return (
    <div className="profile_Card">
      <p><i class="fa-solid fa-user"></i><NavLink to={`/show_profile/${userId}`} style={{textDecoration:'none', color: '#000'}}>User Profile</NavLink></p>
      <p><i class="fa-solid fa-book"></i>Study Materials</p>
      <p onClick={logout}><i class="fa-solid fa-right-from-bracket"></i>Log Out</p>
    </div>
  );
};

export default Navbar;
