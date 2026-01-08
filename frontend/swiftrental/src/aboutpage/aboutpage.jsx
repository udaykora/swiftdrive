import React from "react";
import "./aboutpage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About SwiftDrive</h1>
        <p className="about-tagline">
          Accelerate your journey, drive the future.
        </p>
      </div>

      <div className="about-content">
        <p>
          <strong>SwiftDrive</strong> is a full-stack car rental web application
          designed to provide a smooth, secure, and user-friendly vehicle
          booking experience. The application is built using modern web
          technologies with a strong focus on performance, scalability, and
          security.
        </p>

        <p>
          The frontend of SwiftDrive is developed using <strong>React</strong>,
          while the backend is powered by <strong>Node.js (Express)</strong>.
          A <strong>MySQL</strong> database is used to manage user data, car
          details, and booking records efficiently. Car images are securely
          stored and managed using <strong>Cloudinary</strong>.
        </p>

        <p>
          SwiftDrive is a <strong>fully responsive web application</strong> that
          seamlessly adapts to any device, whether it's a desktop, tablet, or
          smartphone. The interface is optimized to deliver a consistent and
          intuitive experience across all screen sizes, ensuring users can browse
          and book cars effortlessly from any device.
        </p>

        <p>
          SwiftDrive includes two dedicated portals: an <strong>Admin
          Portal</strong> and a <strong>User Portal</strong>. The Admin Portal
          allows administrators to manage users, control account access, add
          cars, upload images, and monitor all car bookings. The User Portal
          enables users to create accounts, browse available cars, and book
          vehicles for selected date ranges.
        </p>

        <p>
          To ensure security and authenticity, the application implements
          <strong> email verification</strong> during account creation. Users
          receive a verification link via email before setting their password.
          A <strong>Forgot Password</strong> feature is also included, allowing
          users to securely reset their password through an email-based reset
          link.
        </p>

        <p>
          SwiftDrive is deployed using modern cloud platforms. The backend is
          hosted on <strong>Render</strong>, the frontend is deployed on
          <strong> Vercel</strong>, and the MySQL database is managed using
          <strong> Clever Cloud</strong>. Email notifications such as account
          verification and password reset are handled using
          <strong> SendGrid</strong>.
        </p>

        <p className="about-footer-text">
          SwiftDrive demonstrates a complete real-world application with
          role-based access, secure authentication, cloud integration, responsive
          design, and a seamless user experience across all devices.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;