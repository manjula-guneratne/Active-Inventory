import { useState } from "react";
import { getFullURL } from "./auth";
// import {button} from 'react-bootstrap';

export default function PartsList() {
  const [shelfId, setshelfId] = useState("");
  const [shelves, setShelves] = useState([]);
  const [partNo, setpartNo] = useState("");
  const [description, setdescription] = useState("");

  const [allparts, setallparts] = useState([]);

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(getFullURL("/parts"))
      .then((res) => res.json())
      .then((data) => setShelves(data.data || []));
  }, []);

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
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "20px" }}>
          <h1>Add New Part</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Shelf ID:
              <br />
              <select
                required
                value={shelfId}
                onChange={(e) => setshelfId(e.target.value)}
              >
                <option value="">-- Select Shelf --</option>
                {shelves.map((part) => (
                  <option key={part._id} value={part.shelf_id}>
                    {part.shelf_id} — {part.part_no}
                  </option>
                ))}
              </select>
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
                style={{ resize: "vertical" }}
              />
            </label>
            <br />
            <button type="submit">Add Part</button>
          </form>
        </div>
        <div style={{ flex: 1, backgroundColor: "#fff", padding: "20px" }}>
          <h3>Display Parts</h3>
          <button onClick={handleDisplay}>Show All Parts</button>

          {allparts.length > 0 && (
            <div
              style={{
                maxHeight: "50vh",
                overflowY: "auto",
                border: "1px solid #ccc",
                marginTop: "10px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <thead
                  style={{ position: "sticky", top: 0, background: "#ddd" }}
                >
                  <tr>
                    <th>Shelf ID</th>
                    <th>Part Number</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {[...allparts]
                    .sort((a, b) => a.part_no.localeCompare(b.part_no))
                    .map((part, index) => (
                      <tr key={part._id || index}>
                        <td>{part.shelf_id}</td>
                        <td>{part.part_no}</td>
                        <td>{part.description}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
