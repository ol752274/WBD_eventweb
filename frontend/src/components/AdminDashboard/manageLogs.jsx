import React, { useState, useEffect } from 'react';
import "../../styles/manageLogs.css";

const ManageBooking = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [eventType, setEventType] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        sortBy,
        order,
        eventType,
      }).toString();

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/logs?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }

        const data = await response.json();
        setLogs(data.logs);
        calculateTotalIncome(data.logs);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs(); // Automatically fetch on any change to filters
  }, [sortBy, order, eventType]);

  const calculateTotalIncome = (logs) => {
    const income = logs.reduce((sum, log) => sum + log.totalPrice, 0);
    setTotalIncome(income);
  };

  return (
    <div className="container3">
      <h2 className="heading3">View Booking Logs</h2>

      <div className="search-sort-container3">
        <label className="label3">Event Type: </label>
        <input
          className="input-text3"
          type="text"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />

        <label className="label3">Sort By: </label>
        <select className="select3" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">None</option>
          <option value="date">Date</option>
          <option value="price">Price</option>
        </select>

        <label className="label3">Order: </label>
        <select className="select3" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <div className="error-message3">{error}</div>}

      {logs.length === 0 && !loading && !error ? (
        <p className="empty-state3">No booking logs found.</p>
      ) : (
        <>
          <div className="income-summary3">
            <strong>Total Income is </strong>₹{totalIncome.toFixed(2)}
          </div>

          <table className="table3">
            <thead className="thead3">
              <tr>
                <th className="th3">Event Type</th>
                <th className="th3">Start Date</th>
                <th className="th3">End Date</th>
                <th className="th3">Venue</th>
                <th className="th3">Total Price</th>
                <th className="th3">Action</th>
                <th className="th3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr className="tbody-row3" key={log._id}>
                  <td className="td3">{log.eventType}</td>
                  <td className="td3">{new Date(log.startDate).toLocaleDateString()}</td>
                  <td className="td3">{new Date(log.endDate).toLocaleDateString()}</td>
                  <td className="td3">{log.venue}</td>
                  <td className="td3">{log.totalPrice}</td>
                  <td className="td3">{log.action}</td>
                  <td className="td3">{new Date(log.logTimestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ManageBooking;