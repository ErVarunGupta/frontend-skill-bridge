import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { MyContext } from "../../MyContext";
import { getUsersProfile } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading } = getUsersProfile();

  const filteredUsers = users?.filter((user) => {
    const username = user.userId?.username || "";
    const email = user.userId?.email || "";
    const name = user.userId?.name || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section className="home-container">
      <div className="search-field">
        <input
          type="text"
          placeholder="Search your favorite helper..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="users-field">
        <h2>Top Recommended Helpers</h2>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="loading">No users found.</div>
          ) : (
            filteredUsers.map((user) => (
              <div className="user-card" key={user._id}>
                <img
                  className="profile-pic"
                  src={user.userId?.profilePicture}
                  alt={user.name}
                  onClick={() => navigate(`/show_profile/${user.userId?._id}`)}
                />
                <h3>{user.name}</h3>
                <p className="username">@{user.userId?.username}</p>
                <p className="email">{user.userId?.email}</p>
                <p className="bio">{user.bio}</p>
                <div className="rating">
                  <span>⭐ {user.averageRating?.toFixed(1)}</span>
                  <span>({user.totalReviews} reviews)</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
