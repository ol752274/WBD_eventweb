import React, { useEffect, useState } from 'react';
import '../../styles/ManageBookings.css';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]); // State to store bookings
  const [filteredBookings, setFilteredBookings] = useState([]); // For filtered bookings
  const [error, setError] = useState(null); // State to store error messages
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [sortOption, setSortOption] = useState(''); // State for sorting option

  // Function to fetch bookings from the backend API
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/bookings'); // Adjust API URL as needed
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json(); // Parse JSON response
      setBookings(data); // Store bookings data in state
      setFilteredBookings(data); // Initialize filtered bookings
    } catch (error) {
      setError('Error fetching booking data'); // Set error state if any issue occurs
      console.error(error);
    }
  };

  // Function to delete a booking
  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) {
      return; // If the user cancels, exit the function
    }
    try {
      const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // After deletion, update the list by removing the deleted booking
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      setFilteredBookings(filteredBookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      setError('Error deleting booking');
      console.error(error);
    }
  };

  // Handle search input
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter bookings based on the event type
    const filtered = bookings.filter(booking =>
      booking.eventType.toLowerCase().includes(value)
    );
    setFilteredBookings(filtered);
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
    let sortedBookings = [...filteredBookings];

    if (option === 'startDate') {
      sortedBookings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (option === 'totalPrice') {
      sortedBookings.sort((a, b) => a.totalPrice - b.totalPrice);
    }

    setFilteredBookings(sortedBookings);
  };

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bookings-container">
      <h1 className="bookings-header">All Bookings</h1>

      {/* Search input for filtering by event type */}
      <input
        type="text"
        placeholder="Search by event type..."
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Sorting options */}
      <div className="sorting-container">
        <select id="sort" value={sortOption} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By...</option>
          <option value="startDate">Start Date</option>
          <option value="totalPrice">Total Price</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      {filteredBookings.length > 0 ? (
        <ul className="bookings-list">
          {filteredBookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <strong>Event Type:</strong> {booking.eventType} <br />
              <strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()} <br />
              <strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()} <br />
              <strong>City:</strong> {booking.city} <br />
              <strong>State:</strong> {booking.state} <br />
              <strong>Organizer:</strong> {booking.organizerDetails.organizerName} <br />
              <strong>Contact Number:</strong> {booking.organizerDetails.contactNumber} <br />
              <strong>Email:</strong> {booking.organizerDetails.email} <br />
              <strong>Allotted Employee Email:</strong> {booking.employeeEmail} <br />
              <strong>Total Price:</strong> ${booking.totalPrice} <br />

              {/* Conditionally render details based on event type */}
              {booking.eventType === 'Wedding' && booking.weddingDetails && (
                <>
                  {/* <h4>Wedding Details</h4> */}
                  <strong>Bride Name:</strong> {booking.weddingDetails.brideName} <br />
                  <strong>Groom Name:</strong> {booking.weddingDetails.groomName} <br />
                  <strong>Wedding Theme:</strong> {booking.weddingDetails.weddingTheme} <br />
                  <strong>Catering Preferences:</strong> {booking.weddingDetails.cateringPreferences} <br />
                  
                </>
              )}

              {booking.eventType === 'Birthday' && booking.birthdayDetails && (
                <>
                  {/* <h4>Birthday Details</h4> */}
                  <strong>Birthday Person Name:</strong> {booking.birthdayDetails.birthdayPersonName} <br />
                  <strong>Age:</strong> {booking.birthdayDetails.age} <br />
                  <strong>Party Theme:</strong> {booking.birthdayDetails.partyTheme} <br />
                  <strong>Cake Size:</strong> {booking.birthdayDetails.cakeSize} <br />
                  <strong>Entertainment Options:</strong> {booking.birthdayDetails.entertainmentOptions} <br />

                </>
              )}

              {booking.eventType === 'Social' && booking.socialEventDetails && (
                <>
                  {/* <h4>Social Event Details</h4> */}
                  <strong>Event Purpose:</strong> {booking.socialEventDetails.eventPurpose} <br />
                  <strong>Sponsors:</strong> {booking.socialEventDetails.sponsors} <br />
                  <strong>Entertainment:</strong> {booking.socialEventDetails.entertainment} <br />

                </>
              )}

              {booking.eventType === 'Corporate' && booking.corporateEventDetails && (
                <>
                  {/* <h4>Corporate Event Details</h4> */}
                  <strong>Company Name:</strong> {booking.corporateEventDetails.companyName} <br />
                  <strong>Agenda:</strong> {booking.corporateEventDetails.agenda} <br />
                  <strong>Equipment Required:</strong> {booking.corporateEventDetails.equipmentRequired} <br />

                </>
              )}

              {/* Admin actions */}
              <div className='delete-button'>
              <button  onClick={() => deleteBooking(booking._id)}>            
                Delete Booking
              </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings-message">No bookings available.</p>
      )}
    </div>
  );
};

export default BookingsList;