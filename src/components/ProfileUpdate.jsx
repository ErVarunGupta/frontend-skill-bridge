import React, { useEffect, useState } from "react";
import "./ProfileUpdate.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { uploadProfilePicture } from "../api/authApi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [profile, setProfile] = useState({
    userId: {
      name: "",
      email: "",
      username: "",
    },
    bio: "",
    skills: [],
    currentPost: "",
    pastWork: [],
    education: [],
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newWork, setNewWork] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/my_profile/${decoded.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill("");
    }
  };

  const deleteSkill = (index) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    });
  };

  const addWork = () => {
    setProfile({ ...profile, pastWork: [...profile.pastWork, newWork] });
    setNewWork({ company: "", position: "", years: "" });
  };

  const deleteWork = (index) => {
    setProfile({
      ...profile,
      pastWork: profile.pastWork.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setProfile({ ...profile, education: [...profile.education, newEducation] });
    setNewEducation({ school: "", degree: "", fieldOfStudy: "" });
  };

  const deleteEducation = (index) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response1 = await fetch(`${API_URL}/update_profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(profile),
      });

      const response2 = await fetch(`${API_URL}/user_update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(user),
      });

      const data1 = await response1.json();
      const data2 = await response2.json();

      if (data1.success && data2.success) {
        alert("Profile updated successfully!");
        // resetForm();
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        const message = data1.success? data2.message: data1.message;
        alert("Update failed: " + message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  //   const resetForm = () => {
  //     setProfile({
  //       bio: "",
  //       skills: [],
  //       currentPost: "",
  //       pastWork: [],
  //       education: [],
  //     });
  //   };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="name_username">
          <input
            onChange={handleUserChange}
            name="name"
            type="text"
            placeholder="Name"
            value={user?.name}
          />
          {/* <input
            onChange={handleUserChange}
            name="password"
            type="password"
            placeholder="Password"
          /> */}
          <input
            onChange={handleUserChange}
            name="username"
            type="username"
            placeholder="Username"
            value={user?.username}
          />
        </div>
        <div className="email_form">
          <input
            onChange={handleUserChange}
            name="email"
            type="text"
            placeholder="email"
            value={user?.email}
          />
          <input style={{paddingBlock: '.5rem'}} type="file" onChange={uploadProfilePicture}/>
        </div>
        {/* Bio */}
        <div>
          <h3>Bio:</h3>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="input-textarea"
          />
        </div>

        <div>
          <h3>Current Post:</h3>
          <input
            type="text"
            name="currentPost"
            value={profile.currentPost}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <h3>Skills</h3>
          <div className="skills-list">
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}{" "}
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteSkill(index)}
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ))}
          </div>
          <div className="input-group">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill"
              className="input-field"
            />
            <button type="button" onClick={addSkill} className="btn">
              Add
            </button>
          </div>
        </div>

        <div>
          <h3>Past Work</h3>
          {profile.pastWork.map((work, index) => (
            <div key={index} className="card">
              <p>
                <strong>{work.company}</strong> - {work.position} ({work.years}{" "}
                years)
              </p>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteWork(index)}
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
          <div className="input-group">
            <input
              type="text"
              placeholder="Company"
              value={newWork.company}
              onChange={(e) =>
                setNewWork({ ...newWork, company: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Position"
              value={newWork.position}
              onChange={(e) =>
                setNewWork({ ...newWork, position: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Years"
              value={newWork.years}
              onChange={(e) =>
                setNewWork({ ...newWork, years: e.target.value })
              }
              className="input-field"
            />
            <button type="button" onClick={addWork} className="btn">
              Add
            </button>
          </div>
        </div>

        {/* Education */}
        <div>
          <h3>Education</h3>
          {profile.education.map((edu, index) => (
            <div key={index} className="card">
              <p>
                <strong>{edu.school}</strong> - {edu.degree} ({edu.fieldOfStudy}
                )
              </p>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteEducation(index)}
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
          <div className="input-group">
            <input
              type="text"
              placeholder="School"
              value={newEducation.school}
              onChange={(e) =>
                setNewEducation({ ...newEducation, school: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Degree"
              value={newEducation.degree}
              onChange={(e) =>
                setNewEducation({ ...newEducation, degree: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={newEducation.fieldOfStudy}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  fieldOfStudy: e.target.value,
                })
              }
              className="input-field"
            />
            <button type="button" onClick={addEducation} className="btn">
              Add
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
