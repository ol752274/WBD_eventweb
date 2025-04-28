import React, { useEffect, useState } from 'react';
import '../../styles/manageUsers.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/manageUsers`); // Your backend API endpoint
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteUsers/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>

      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id) } >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default ManageUsers;
