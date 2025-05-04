import React, { useState, useEffect } from 'react';
import '../../styles/empReg.css';  // Import the CSS file

function ManageEmpRegistrations() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee

  useEffect(() => {
    // Fetch employee data from the backend API
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/manageEmpRegistrations`); // Adjust port if necessary
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json(); // Parse JSON
        setEmployees(data); // Store the fetched data in the state
      } catch (error) {
        setError('Error fetching employee data');
        console.error(error);
      }
    };

    fetchEmployees(); // Call the fetch function on component mount
  }, []); // Empty dependency array means this will only run once on mount

  const approveEmployee = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/approveEmployee/${id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to approve employee');
      }
      // Optionally refetch employees or update state to remove the approved employee
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      setError('Error approving employee');
      console.error(error);
    }
  };

  const deleteEmpRegistrations = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteEmpRegistrations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      setError('Error deleting employee');
      console.error(error);
    }
  };


  const viewProfile = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
  };

  const closeProfile = () => {
    setSelectedEmployee(null); // Clear the selected employee
  };

  return (
    <div className="manage-emp-registrations">
       <h1>Manage Employee Registrations</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error if any */}
      <table className="emp-reg-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
  {employees.length > 0 ? (
    employees.map((employee) => (
      <tr key={employee._id}>
        <td>{`${employee.firstName} ${employee.lastName}`}</td>
        <td>{employee.email}</td>
        <td>
          <div className="action-buttons">
            <button onClick={() => viewProfile(employee)}>View Profile</button>
            <button onClick={() => approveEmployee(employee._id)}>Approve</button>
            <button onClick={() => deleteEmpRegistrations(employee._id)}>Delete</button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3">No employees found</td>
    </tr>
  )}
</tbody>

      </table>

      {/* Profile Details Modal */}
      {selectedEmployee && (
        <div className="full-profile">
          <div className="profile-details">
          <h2>Employee Profile</h2>
          <img
                src={`data:${selectedEmployee.imageType};base64,${selectedEmployee.imageBuffer}`}
                alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                className="employee-image"
              />
       <p><strong>Employee Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
            <p><strong>Marital Status:</strong> {selectedEmployee.maritalStatus}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
            <p><strong>Experience:</strong> {selectedEmployee.experience}</p>
            <p><strong>Skills:</strong> {selectedEmployee.skills}</p>
            <p><strong>Street:</strong> {selectedEmployee.street}</p>
            <p><strong>City:</strong> {selectedEmployee.city}</p>
            <p><strong>State:</strong> {selectedEmployee.state}</p>
            <p><strong>Country:</strong> {selectedEmployee.country}</p>
            <button onClick={closeProfile}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEmpRegistrations;
