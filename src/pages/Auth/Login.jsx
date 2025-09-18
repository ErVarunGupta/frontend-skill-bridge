import React, { useContext, useState } from "react";
import "./auth.styles.css";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../MyContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

function Login() {

    const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const url = `${API_URL}/login`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // console.log(data);

      const { message, success, token, username } = data;
      // console.log(token)
      if (success) {
        alert("Loggined Successfully!");
        localStorage.setItem('token', token)
        localStorage.setItem('username',username )
        setTimeout(()=>{
            navigate("/dashboard")
        }, 1000)
      } else {
        alert( message);
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
            <h1>Sign In</h1>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="Password"
            />

            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            <button className="auth-button" onClick={handleSubmit}>
              Sign In
            </button>
          </div>
          <div className="right_auth_container"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
