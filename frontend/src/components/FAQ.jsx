import React, { useState } from 'react';

const HelpAndSupport = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleAnswer = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="container">
      <h1>Help and Support</h1>

      <div className="section contact-info">
        <p>
          If you need assistance or have any questions, feel free to contact our support team. We're here to help! You can reach out to us via:
        </p>
        <ul>
          <li> <i className="fas fa-envelope"></i> <strong>Email:</strong> support@eventweb.com</li>
          <li> <i className="fas fa-phone"></i> <strong>Phone:</strong> +91 (555) 123-4567</li>
          <li> <i className="fas fa-comments"></i> <strong>24/7 Chat Support:</strong> Available on our website</li>
        </ul>
      </div>

      <div className="section faq">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="Q">
          {[...Array(5).keys()].map((i) => (
            <div key={i}>
              <div className="question" onClick={() => toggleAnswer(i)}>
                <strong>{i + 1}.</strong> 
                {i === 0 && "How do I book an event through your website?"}
                {i === 1 && "What types of events can I book?"}
                {i === 2 && "How can I change or cancel my event booking?"}
                {i === 3 && "What payment methods do you accept?"}
                {i === 4 && "Can I access recordings of my past events?"}
                <i className={`fas ${openQuestion === i ? 'fa-chevron-up' : 'fa-chevron-down'} arrow-icon`} />
              </div>
              {openQuestion === i && (
                <div className="answer">
                  {i === 0 && "To book an event, simply visit our event booking page, choose the event type, fill in the details like date, time, venue, and number of guests, and submit the form. You’ll receive a confirmation email after successful booking."}
                  {i === 1 && "You can book events like weddings, birthdays, corporate events, social events, and more. Each event type has its own set of customizable options."}
                  {i === 2 && "To modify or cancel your event, please contact our support team at least 48 hours before the event. Any cancellations within this time may be subject to cancellation fees."}
                  {i === 3 && "We accept payment methods including credit/debit cards, PayPal, and bank transfers. You can choose your preferred method during the booking process."}
                  {i === 4 && "Yes, after the event is over, you can log in to your account and access recordings of your past events under your event history."}
                  <hr />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section documentation">
        <h2>Documentation</h2>
        <p>Here you can find helpful documentation for troubleshooting common issues and understanding our features.</p>
        <h3>Troubleshooting Tips</h3>
        <ul>
          <li>Make sure you are using the latest version of your web browser.</li>
          <li>Clear your browser cache and cookies.</li>
          <li>Check your internet connection.</li>
        </ul>
        <h3>Feature Explanation</h3>
        <ul>
          <li><strong>Event Booking:</strong> Easily book events through our website or contact our support team for assistance.</li>
          <li><strong>Payment Methods:</strong> We accept various payment methods, including credit cards, debit cards, PayPal, and bank transfers.</li>
          <li><strong>Event Recordings:</strong> Access recordings of past events through your account after the event concludes.</li>
        </ul>
      </div>

      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            line-height: 1.6;
          }

          .container {
            width: 80%;
            max-width: 1200px;
            margin: 20px auto;
            padding: 50px 20px;
            background-color: #ffffff;
            border-radius: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #f0e68c; /* Warm yellow theme color */
          }

          h1 {
            text-align: center;
            color: #f0e68c; /* Warm yellow theme color */
            margin-bottom: 50px;
            font-size: 42px;
            font-weight: bold;
          }

          .section {
            margin-bottom: 40px;
            padding: 30px;
            background-color: #f9f9f9;
            border-radius: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
          }

          .section:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          }

          p {
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 20px;
            color: #666;
          }

          .contact-info {
            margin-bottom: 20px;
          }

          .contact-info h2 {
            font-size: 28px;
            font-weight: 600;
            color: #f0e68c; /* Warm yellow theme color */
            margin-bottom: 10px;
          }

          .contact-info ul {
            list-style-type: none;
            padding: 0;
            font-size: 18px;
            color: #555;
          }

          .contact-info li {
            margin-bottom: 10px;
          }

          .faq {
            margin-bottom: 20px;
          }

          .faq h2 {
            font-size: 28px;
            font-weight: 600;
            color: #f0e68c; /* Warm yellow theme color */
          }

          .faq .question {
            position: relative;
            padding: 12px 20px;
            background-color: #eee;
            border-radius: 10px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 18px;
            color: #333;
          }

          .faq .answer {
            margin-left: 20px;
            font-size: 16px;
            color: #777;
            padding-left: 10px;
          }

          .faq .arrow-icon {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            color: #f0e68c; /* Warm yellow theme color */
            cursor: pointer;
          }

          .documentation h2 {
            font-size: 28px;
            font-weight: 600;
            color: #f0e68c; /* Warm yellow theme color */
          }

          .documentation h3 {
            font-size: 22px;
            color: #f0e68c; /* Warm yellow theme color */
          }

          .documentation ul {
            padding: 0;
            font-size: 18px;
            margin-left: 20px;
            color: #555;
          }

          .documentation ul li {
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default HelpAndSupport;