import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    setError("");
    setFilteredData([]);
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await response.json();
      

      if (result[0].Status === "Success") {
        setData(result[0].PostOffice);
        setFilteredData(result[0].PostOffice);
      } else {
        setError(result[0].Message || "No data found.");
        setData([]);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.Name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <h2>Enter Pincode</h2>
      <input
        type="text"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        maxLength="6"
      />
      <button onClick={handleLookup}>Lookup</button>

      {loading && <div className="loader">Loading...</div>}

      {error && <p className="error">{error}</p>}
      {!loading && data.length > 0 && (
  <>
    <p><strong>Pincode:</strong> {pincode}</p>
    <p><strong>Message:</strong> Number of pincode found: {filteredData.length}</p>

    <label>
      🔍
      <input
        type="text"
        placeholder="Filter by post office name"
        value={searchTerm}
        onChange={handleFilter}
      />
    </label>
  </>
)}

     
  {!loading && filteredData.length > 0 && (
  <div className="grid">
  {filteredData.map((office, idx) => (
 <div key={idx} className="card">
   <p><strong>Name:</strong> {office.Name}</p>
    <p><strong>Branch Type:</strong> {office.BranchType}</p>
    <p><strong>Delivery Status:</strong> {office.DeliveryStatus}</p>
    <p><strong>District:</strong> {office.District}</p>
    <p><strong>Division:</strong> {office.Division}</p>
  </div>
    ))}
  </div>
)}


 {!loading && filteredData.length === 0 && data.length > 0 && (
    <p>Couldn’t find the postal data you’re looking for…</p>
      )}
 </div>
  );
};

export default App;
