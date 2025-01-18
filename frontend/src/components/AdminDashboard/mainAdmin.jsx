import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/mainAdmin.css';

function MainAdmin() {
  const navigate = useNavigate(); // Hook to redirect
  const [adminName, setAdminName] = useState(''); // State to store admin name
  const [isRedirected, setIsRedirected] = useState(false); // State to manage redirection

  // Fetch admin name from the backend when the component mounts
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const response = await fetch('http://localhost:5000/getAdminName', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent
        });

        const data = await response.json();

        if (data.success) {
          // Remove @gmail.com from the admin email
          const name = data.adminName.split('@')[0]; // Get the part before @
          setAdminName(name); // Set admin name from backend

          // Only redirect if not already redirected
          if (!isRedirected) {
            setIsRedirected(true); // Set redirected flag
            navigate('Statistics'); // Redirect to Statistics after fetching admin name
          }
        } else {
          console.error('Failed to fetch admin name');
        }
      } catch (error) {
        console.error('Error fetching admin name:', error);
      }
    };

    fetchAdminName();
  }, [isRedirected, navigate]); // Add isRedirected and navigate as dependencies

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });

      const data = await response.json();

      if (data.success) {
        alert('Logged out successfully');
        navigate('/'); // Redirect to home page after logout
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="admin-container">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>EventWeb Admin Panel</h2>
          </div>
          <ul className="admin-menu">
          <br/>
          <br/>
            <li>
              <Link to="/"><i className="fas fa-home"></i> Home</Link>
            </li>

            <li>
              <Link to="/services"><i className="fas fa-concierge-bell"></i> Services</Link>
            </li>
 
            <li>
              <Link to="ManageUsers"><i className="fas fa-users"></i> Manage Users</Link>
            </li>
            <li>
              <Link to="ManageEmployees"><i className="fas fa-user-tie"></i> Manage Employees</Link>
            </li>
            <li>
              <Link to="ManageEmpRegistrations"><i className="fas fa-id-card"></i> View Employee Registrations</Link>
            </li>
            <li>
              <Link to="ManageBookings"><i className="fas fa-calendar-check"></i> Manage Bookings</Link>
            </li>
            <li>
              <Link to="viewlogs"><i className="fas fa-calendar-check"></i> View Logs</Link>
            </li>
          </ul>
        </div>

        <div className="admin-main-content">
          <header className="admin-header">
            <h1>Welcome {adminName}</h1> {/* Display admin name here */}
            <div className="admin-logout">
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
          </header>

          <div className='outlet-container'>
          <Outlet />
          </div>
          
        </div>

      </div>
    </>
  );
}

export default MainAdmin;
