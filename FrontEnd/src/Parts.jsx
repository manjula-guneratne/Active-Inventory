import { useState } from "react";
import { getFullURL } from "./auth";
// import {button} from 'react-bootstrap';

export default function PartsList() {
  const [shelfId, setshelfId] = useState("");
  const [partNo, setpartNo] = useState("");
  const [description, setdescription] = useState("");

  const [allparts, setallparts] = useState([]);

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");

  // handle POST to parts list
  const handleSubmit = async (e) => {
    // Fetch parts list from backend API
    e.preventDefault();
    try {
      const res = await fetch(getFullURL("/parts/post"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shelf_id: shelfId,
          part_no: partNo,
          description: description,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Part added successfully");
      setFormData(data.data || null);

      // Clear form after successful submission
      setshelfId("");
      setpartNo("");
      setdescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisplay = async () => {
    try {
      const res = await fetch(getFullURL("/parts"));
      const data = await res.json();

      setallparts(data.data || []);
      setMessage(data.message || "Parts retrieved successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Add New Part</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Shelf ID: <br />
          <input
            required
            value={shelfId}
            onChange={(e) => setshelfId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Part Number: <br />
          <input
            required
            value={partNo}
            onChange={(e) => setpartNo(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description: <br />
          <textarea
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            rows={5} 
            cols={50} 
            style={{ resize: 'vertical' }} 
          />
        </label>
        <br />
        <button type="submit">Add Part</button>
      </form>

      <h3>Display Parts</h3>
      <button onClick={handleDisplay}>Show All Parts</button>

      {allparts.length > 0 && (
        <ul>
          {allparts.map((part, index) => (
            <li key={part.shelf_id || index}>
              Shelf ID: {part.shelf_id}, Part Number: {part.part_no},
              Description: {part.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
