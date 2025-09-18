import React from "react";
import "./ShowProfile.css";
import { useContext } from "react";
import { MyContext } from "../MyContext";
import { getUserProfile, uploadProfilePicture } from "../api/authApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const ShowProfile = () => {
  const navigate = useNavigate();
  const decoded = jwtDecode(localStorage.getItem("token"));
  const {userId} = useParams();
  const { userProfile } = getUserProfile(userId);

  // console.log(userProfile?.profile);

  if (!userProfile) return <p>Loading profile...</p>;
  const profile = userProfile?.profile;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="user_image">
          <img src={profile.userId.profilePicture} alt="" />
        </div>
        <div className="profile_details">
          <div className="name_username_email">
            <h2>{profile.userId?.name}</h2>
          <p className="profile-email">@{profile.userId?.username}</p>
          <p className="profile-email">{profile.userId?.email}</p>
          </div>
          {userId.toString() === decoded.id.toString() && <button onClick={()=> navigate("/update_profile")}>Update Profile</button>}
        </div>
      </div>

      <div className="profile-section">
        <h3>Bio</h3>
        <p>{profile.bio || "No bio available"}</p>
      </div>

      <div className="profile-section">
        <h3>Current Post</h3>
        <p>{profile.currentPost || "Not specified"}</p>
      </div>

      <div className="profile-section">
        <h3>Skills</h3>
        <div className="skills-list">
          {profile.skills?.length > 0 ? (
            profile.skills?.map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
              </span>
            ))
          ) : (
            <p>No skills added</p>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h3>Work Experience</h3>
        {profile.pastWork?.length > 0 ? (
          profile.pastWork?.map((work, i) => (
            <div key={i} className="work-card">
              <h4>{work.company}</h4>
              <p>
                {work.position} • {work.years} years
              </p>
            </div>
          ))
        ) : (
          <p>No work experience added</p>
        )}
      </div>

      <div className="profile-section">
        <h3>Education</h3>
        {profile.education?.length > 0 ? (
          profile.education?.map((edu, i) => (
            <div key={i} className="edu-card">
              <h4>{edu.school}</h4>
              <p>
                {edu.degree} • {edu.fieldOfStudy}
              </p>
            </div>
          ))
        ) : (
          <p>No education details</p>
        )}
      </div>

      <div className="profile-footer">
        <p>
          <strong>Reviews:</strong> {profile.totalReviews}
        </p>
        <p>
          <strong>Rating:</strong> ⭐ {profile.averageRating?.toFixed(1)}/5
        </p>
      </div>
    </div>
  );
};

export default ShowProfile;
