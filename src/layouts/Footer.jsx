import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About</h3>
          <p>
            This platform connects users with top helpers and provides
            personalized support for various tasks.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/helpers">Helpers</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: support@example.com</p>
          <p>Phone: +91 12345 67890</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} YourPlatform. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
