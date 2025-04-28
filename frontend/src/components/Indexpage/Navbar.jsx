import React, { useEffect, useState } from 'react';
import '../../styles/Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    const [role, setRole] = useState(null); // State to hold role
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State to control dropdown visibility

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/checksession`, {
                    credentials: 'include', // Send cookies with the request
                });

                if (response.ok) {
                    const data = await response.json();
                    setRole(data.role); // Set the role if session is valid
                } else {
                    setRole(null); // Clear role if session is not valid
                }
            } catch (error) {
                console.error('Error checking session:', error);
                setRole(null);
            }
        };

        checkSession();
    }, []);

    // Handlers for hover events
    const showDropdown = () => setIsDropdownVisible(true);
    const hideDropdown = () => setIsDropdownVisible(false);

    return (
        <header>
            <div className="navbar">
                <nav>
                    <ul className="nav-links" aria-label="Main Navigation">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About us</Link></li>
                        <li
                            onMouseEnter={showDropdown} // Show dropdown on hover
                            onMouseLeave={hideDropdown} // Hide dropdown when not hovering
                        >
                            <Link to="/services">Services</Link>
                            <ul className={`dropdown ${isDropdownVisible ? 'visible' : ''}`}>
                                <li><Link to="/wedding">Wedding Events</Link></li>
                                <li><Link to="/birthday">Birthday Events</Link></li>
                                <li><Link to="/corperate">Corporate Events</Link></li>
                                <li><Link to="/social">Social Events</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/contact">Contact us</Link></li>
                        <li><Link to="/eventform">Book Event</Link></li>
                    </ul>
                </nav>
                <div className="login-button">
                    {role ? (
                        <Link to={role === 'Admin' ? '/mainAdmin' : role === 'User' ? '/mainUser' : role === 'Employee' ? '/mainEmployee' : '/'}>
                            {role} Dashboard
                        </Link>
                    ) : (
                        <Link to="/login">Login/Sign Up</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
