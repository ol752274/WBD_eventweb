import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MainUser.css';

const MainUser = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);  // ✅ Declare selectedBooking
  const [rating, setRating] = useState(0);  // ✅ Declare rating state
  const [showRatingModal, setShowRatingModal] = useState(false); // ✅ Declare modal state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getMyUserProfileDetails`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setUserDetails(data.user);
          setUpdatedDetails({ ...data.user }); // Initialize editable details
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchUserBookings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/MeAsUserBookings`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        setUserBookings(data);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchUserDetails();
    fetchUserBookings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updatedDetails) {
      alert('No details to update.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/updateMyUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedDetails),
      });

      const data = await response.json();
      if (data.success) {
        setUserDetails(updatedDetails);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  const handleCancelEdit = () => {
    setUpdatedDetails({ ...userDetails }); // Reset changes to original details
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        alert('Logged out successfully');
        navigate('/');
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');

    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteUsers/${userDetails.userId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.status === 204) {
          alert('Profile deleted successfully.');
          setUserDetails(null);
          await handleLogout();
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete profile.');
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert('An error occurred while deleting the profile.');
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');

    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.status === 200) {
          alert('Booking deleted successfully.');
          setUserBookings(userBookings.filter((booking) => booking._id !== bookingId));
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete booking.');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('An error occurred while deleting the booking.');
      }
    }
  };
  const handleSubmitRating = async () => {
    if (!selectedBooking) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${selectedBooking._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Rating submitted successfully!');
        setShowRatingModal(false);
        setSelectedBooking(null);
        setRating(0);
      } else {
        alert(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('An error occurred while submitting the rating.');
    }
  };
  

  if (!userDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-dashboard">
      <div className="sidebar">
        <h2>Welcome {userDetails.name}</h2><br/><br/>
        <button onClick={() => navigate('/')}>
           Home Page
       </button>
        <button onClick={() => setShowProfile(!showProfile)} className="view-profile-btn">
          {showProfile ? 'Close Profile' : 'View Profile'}
        </button>
        <button onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
        <button onClick={handleDelete}>
          Delete Profile
        </button>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
      {showRatingModal && (
          <div className="rating-modal">
            <div className="modal-content">
              <h1>Rate Your Experience</h1>
              <p>Booking: {selectedBooking?.eventType}</p>
              <p><strong>Employee Email:</strong> {selectedBooking?.employeeEmail}</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? 'star selected' : 'star'}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button onClick={handleSubmitRating}>Submit</button>
              <button onClick={() => setShowRatingModal(false)}>Cancel</button>
            </div>
          </div>
        )}

  {showProfile && (
    <div className="profile-section">
      <div className="profile-details">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <h1>Edit Profile</h1>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={updatedDetails?.name || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                name="phone"
                value={updatedDetails?.phone || ''}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit" className="logout-btn">Save Profile</button>
            <button type="button" onClick={handleCancelEdit} className="logout-btn">
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h1>My Profile</h1>
            <p>
              <strong>Name:</strong> {userDetails?.name}
            </p>
            <p>
              <strong>Phone:</strong> {userDetails?.phone}
            </p>
            <p>
              <strong>Email:</strong> {userDetails?.email}
            </p>
          </>
        )}
      </div>
    </div>
  )}

  <div className={`user-bookings ${showProfile ? 'with-profile' : ''}`}>
    <h2>My Bookings</h2>
    {userBookings.length > 0 ? (
      <div className="card-container">
        {userBookings.map((booking) => (
          <div key={booking._id} className="card">
            <div className="content">
              {/* Front of the card */}
              <div className="front">
                <div className="event-details">
                  <p><strong>Event Type:</strong> {booking.eventType}</p><br/>
                  <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p><br/>
                  <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Back of the card */}
              <div className="back">
                <div className="details">
                  <p><strong>City:</strong> {booking.city || 'N/A'}</p>
                  <p><strong>State:</strong> {booking.state || 'N/A'}</p>
                  <p><strong>Organizer:</strong> {booking.organizerDetails.organizerName}</p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                </div>
                <button onClick={() => handleDeleteBooking(booking._id)} className="book-del-btn">
                  Cancel Booking
                </button>
                <button
                        className="book-del-btn"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowRatingModal(true);
                        }}
                      >
                        Rate
                      </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="no-bookings-message">No bookings found for you.</p>
    )}
  </div>
</div>

    </div>
  );
};

export default MainUser;