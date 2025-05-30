import React, { useEffect, useState } from 'react';

const HousingDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/housing');
        const data = await res.json();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch requests:', err);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Housing Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Adults</th>
                <th>Children</th>
                <th>Infants</th>
                <th>Pets</th>
                <th>Accessibility</th>
                <th>Preferred Location</th>
                <th>Housing Type</th>
                <th>Email Consent</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr key={i}>
                  <td>{new Date(req.createdAt).toLocaleString()}</td>
                  <td>{req.adults}</td>
                  <td>{req.children}</td>
                  <td>{req.infants}</td>
                  <td>{req.pets}</td>
                  <td>{req.accessibilityNeeds || '-'}</td>
                  <td>{req.preferredLocations || '-'}</td>
                  <td>{req.housingType?.join(', ') || '-'}</td>
                  <td>{req.sameEmail}</td>
                  <td>{req.additionalInfo || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HousingDashboard;
