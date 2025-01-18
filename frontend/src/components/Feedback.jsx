// FeedbackForm.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setRating } from "../redux/actions"; // Import the actions
import "../styles/Feedback.css";

const FeedbackForm = () => {
  // Get the email and rating values from Redux store
  const { email, rating } = useSelector((state) => state);

  // Dispatch actions to update Redux store
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}, Rating: ${rating}`);

    // Reset rating and email after submission
    dispatch(setRating(0));
    dispatch(setEmail(""));
  };

  return (
    <div className="feedback-container">
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="email-field">
          <label htmlFor="email">Employee Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            placeholder="Enter employee email"
            required
          />
        </div>

        {/* Star Rating */}
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? "active" : ""}`}
              onClick={() => dispatch(setRating(star))}
            >
              &#9733;
            </span>
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;