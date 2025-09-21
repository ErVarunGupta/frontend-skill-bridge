import React, { useContext, useState } from "react";
import "./auth.styles.css";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../MyContext";

const API_URL = import.meta.env.VITE_BACKEND_URL ;

function Register() {
    const navigate = useNavigate()
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const url = `${API_URL}/register`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      const { message, success, token } = data;
      if (success) {
        alert("Registered successfully!")
        localStorage.setItem('token',token)
         localStorage.setItem('profilePicture', data.user.profilePicture);
        // localStorage.setItem('username',username)
        setTimeout(()=>{
            navigate("/dashboard")
        }, 1000)
      }
    } catch (error) {
      console.log("Error during registering: ", error.message);
    }
  };
  return (
    <>
      <div className="auth_container">
        <div className="wrapper_container">
          <div className="left_auth_container">
            <h1>Sign Up</h1>
            <div className="name_username">
              <input onChange={(e)=> setName(e.target.value)} type="text" placeholder="Name" />
              <input onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Username" />
            </div>
            <input onChange={(e)=> setEmail(e.target.value)} type="text" placeholder="Email" />
            <input onChange={(e)=> setPassword(e.target.value)} type="text" placeholder="Password" />

            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
            <button className="auth-button" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>
          <div className="right_auth_container"></div>
        </div>
      </div>
    </>
  );
}

export default Register;
