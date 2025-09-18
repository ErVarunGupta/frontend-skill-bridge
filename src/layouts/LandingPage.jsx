import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate()
  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="logo">Skill Bridge</h1>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <button className="signin-btn" onClick={()=>{
            navigate("/login");
          }}>Sign In</button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <h2 className="hero-title">Get Help, Give Help – Anytime, Anywhere</h2>
        <p className="hero-subtitle">
          A community-driven platform where you can request help, offer help,
          share study material, and grow together.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn" onClick={()=>{
            navigate("/login");
          }}>Get Started →</button>
        </div>
      </main>

      {/* How it Works Section */}
      <section className="how-it-works" id="about">
        <h3 className="section-title">How It Works</h3>
        <div className="steps">
          <div className="step-card">
            <h4>1. Post Your Request</h4>
            <p>Describe what help you need.</p>
          </div>
          <div className="step-card">
            <h4>2. Connect</h4>
            <p>Helpers accept your request & schedule a time.</p>
          </div>
          <div className="step-card">
            <h4>3. Learn & Share</h4>
            <p>Join via chat or video and share feedback after.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} HelpExchange. All rights reserved.</p>
      </footer>
    </div>
  );
}
