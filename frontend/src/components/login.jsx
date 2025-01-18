import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Add loading state
  const [success, setSuccess] = useState(false);  // Add success state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // To send cookies (if any) with the request
        body: JSON.stringify({ email, password }),
      });

      setLoading(false); // Stop loading

      if (response.ok) {
        const data = await response.json();
        setSuccess(true); // Set success state

        const role = data.role;
        
        // Navigate based on role
        if (role === 'Admin') {
          navigate('/mainAdmin');
        }else if (role === 'Employee') {
          navigate('/mainEmployee');
        } 
        else if (role === 'User') {
          navigate('/mainUser');
        }
      } else {
        setError('Invalid login credentials');
      }
    } catch (error) {
      setLoading(false); // Stop loading on error
      setError('An error occurred during the login process.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className='whole-login-page'>
      <div className="login-container">
        <div className="login-left"></div>
        <div className="login-right">
          <div className="login-box">
            <div className="logo">Event Web</div>
            <h2>Welcome back!</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loading && <p>Logging in...</p>} {/* Display loading message */}
              {error && <p className="error">{error}</p>} {/* Display error message */}
              {success && <p className="success">Login successful!</p>} {/* Display success message */}
              <button type="submit" className="sign-in-button" disabled={loading}>
                {loading ? 'Please wait...' : 'Sign in'}
              </button>
            </form>
            <p className="signup-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
            <Link className="forgot-password-link" to='/forgot-password'>Forgot Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
