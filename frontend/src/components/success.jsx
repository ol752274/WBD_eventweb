import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ThankYouPage = () => {
  return (
    <div style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "linear-gradient(to bottom, #222, #333)", backgroundSize: "cover", backgroundPosition: "center", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexDirection: "column" }}>
      
      <style>
        {`
          @keyframes glow {
            from {
              text-shadow: 0 0 10px #00cc00;
            }
            to {
              text-shadow: 0 0 20px #00cc00, 0 0 30px #00cc00, 0 0 40px #00cc00;
            }
          }

          @keyframes expandCircle {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>

      <div style={{ position: "relative", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", animation: "expandCircle 2s ease forwards" }}>
        <div style={{ textAlign: "center", marginTop: "20px", opacity: 0, animation: "fadeIn 1s ease forwards" }}>
          <h1 style={{ animation: "glow 2s infinite alternate" }}>Thank You for Booking</h1>
          <div style={{ fontSize: "48px", color: "#00cc00", marginBottom: "10px" }}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p>Your booking has been received successfully.</p>
      </div>
    </div>
  );
};

export default ThankYouPage;