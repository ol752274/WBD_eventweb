import React, { useEffect, useState } from 'react';
import '../../styles/EmployeeProfile.css';

const EmployeeProfile = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit modes
  const [updatedDetails, setUpdatedDetails] = useState({}); // To store the updated profile details

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
          setUpdatedDetails(data.employee); // Initialize updated details with current data
        } else {
          console.error('Failed to fetch employee details');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value }); // Update local state with changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/updateEmpProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...updatedDetails, employeeId: employeeDetails._id }), // Include employeeId in the request
      });
    
      const data = await response.json();
      if (data.success) {
        setEmployeeDetails(updatedDetails);
        setIsEditing(false);
        alert('Profile updated successfully!'); // Success notification
      } else {
        console.error('Failed to update employee profile:', data.message);
        alert(data.message || 'Failed to update profile.'); // Display specific error message
      }
    } catch (error) {
      console.error('Error updating employee profile:', error);
      alert('An error occurred while updating the profile.'); // Error notification
    }
  };
  

  if (!employeeDetails) {
    return <p>Loading...</p>; // Display a loading message while fetching employee data
  }

  return (
    <div className="employee-profile">
      <div className="profile-details">
        <div className="profile-image">
          <img
            src={`${process.env.REACT_APP_API_URL}/${employeeDetails.image}`}
            alt={`${employeeDetails.firstName} ${employeeDetails.lastName}`}
            className="emp-image"
          />
        </div>

        {isEditing ? (
          // Edit form
          <form onSubmit={handleSubmit}>
            <h1>Edit Profile</h1>
            <label>
              <strong>First Name:</strong>
              <input
                type="text"
                name="firstName"
                value={updatedDetails.firstName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Last Name:</strong>
              <input
                type="text"
                name="lastName"
                value={updatedDetails.lastName}
                onChange={handleInputChange}
              />
            </label>
 
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                name="phone"
                value={updatedDetails.phone}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Marital Status:</strong>
              <input
                type="text"
                name="maritalStatus"
                value={updatedDetails.maritalStatus}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Date of Birth:</strong>
              <input
                type="date"
                name="dob"
                value={updatedDetails.dob}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                name="street"
                value={updatedDetails.street}
                onChange={handleInputChange}
              /><br/>
              <strong>City:</strong>
              <input
                type="text"
                name="city"
                value={updatedDetails.city}
                onChange={handleInputChange}
              /><br/>
              <strong>state:</strong>
              <input
                type="text"
                name="state"
                value={updatedDetails.state}
                onChange={handleInputChange}
              /><br/>
              <strong>Country:</strong>
              <input
                type="text"
                name="country"
                value={updatedDetails.country}
                onChange={handleInputChange}
              /><br/>
            </label>
            <label>
              <strong>Experience:</strong>
              <input
                type="text"
                name="experience"
                value={updatedDetails.experience}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Skills:</strong>
              <input
                type="text"
                name="skills"
                value={updatedDetails.skills}
                onChange={handleInputChange}
              />
            </label>

            <button type="submit" className="save-profile-btn">Save Profile</button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-edit-btn">
              Cancel
            </button>
          </form>
        ) : (
          // View mode
          <>
            <h1>My Profile</h1>
            <p><strong>First Name:</strong> {employeeDetails.firstName}</p>
            <p><strong>Last Name:</strong> {employeeDetails.lastName}</p>
            <p><strong>Employee Rating:</strong> 
              {employeeDetails.rateCount > 0 
                ? (employeeDetails.rating / employeeDetails.rateCount).toFixed(1) 
                     : "Not Rated Yet"}
             </p>

            <p><strong>Email:</strong> {employeeDetails.email}</p>
            <p><strong>Phone:</strong> {employeeDetails.phone}</p>
            <p><strong>Marital Status:</strong> {employeeDetails.maritalStatus}</p>
            <p><strong>Date of Birth:</strong> {new Date(employeeDetails.dob).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {employeeDetails.street}, {employeeDetails.city}, {employeeDetails.state}, {employeeDetails.country}</p>
            <p><strong>Experience:</strong> {employeeDetails.experience}</p>
            <p><strong>Skills:</strong> {employeeDetails.skills}</p>
            <button onClick={() => setIsEditing(true)} className="edit-EmpProfile-btn">Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
