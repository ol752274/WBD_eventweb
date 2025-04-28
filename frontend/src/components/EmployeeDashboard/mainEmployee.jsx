import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/mainEmployee.css';

function MainEmployee() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isRedirected, setIsRedirected] = useState(false); // Track redirection
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  // Fetch employee details from the backend
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getMyEmpProfileDetails`, {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent for session management
        });

        const data = await response.json();

        if (data.success) {
          setEmployeeDetails(data.employee); // Set employee details from backend
        } else {
          console.error('Failed to fetch employee details');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, []);

  // Automatically navigate to Employee Profile when employee details are fetched
  useEffect(() => {
    if (employeeDetails && !isRedirected && location.pathname === '/mainEmployee') {
      setIsRedirected(true); // Set redirected flag
      navigate('EmpProfile'); // Navigate to Employee Profile
    }
  }, [employeeDetails, isRedirected, navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent for session management
      });

      const data = await response.json();

      if (data.success) {
        alert('Logged out successfully');
        navigate('/'); // Redirect to the home page after logout
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="EventEmp-container">
        <div className="EventEmp-sidebar">
          <div className="EventEmp-sidebar-header">
            <h2>Event Web Employee Panel</h2>
          </div>
          <ul className="EventEmp-menu">
            <br></br>
            <br></br>
            <li>
              <Link to="/"><i className="fas fa-home"></i> Home</Link>
            </li>
   
            <li>
              <Link to="/services"><i className="fas fa-concierge-bell"></i> Services</Link>
            </li>
            <li>
              <Link to="EmpProfile">Profile</Link>
              </li>  
            <li>
              <Link to="ManageMyBookings"><i className="fas fa-calendar-check"></i> Manage Bookings</Link>
            </li>
            <li>
            <a href="#" onClick={handleLogout}>Logout</a>
            </li>
            <li>


            </li>
          </ul>
        </div>
        <div className="EventEmp-main-content">
          <header className="EventEmp-header">
            <h1>
              Welcome {employeeDetails ? `${employeeDetails.firstName} ${employeeDetails.lastName}` : 'Employee'}
            </h1>
            <div className='EventEmp-profile'>
              <div className="EventEmp-logout">
                
              </div>

              <div className="EventEmp-logout">
                
              </div>
            </div>
          </header>
          <div className='emp-outlet-cont'>
             <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default MainEmployee;
