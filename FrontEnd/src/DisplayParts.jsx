import { useEffect, useState } from "react";
import { getFullURL } from "./auth";

export default function DisplayParts() {
  const [allRows, setAllRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [selectedShelf, setSelectedShelf] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchDisplayParts() {
      try {
        const res = await fetch(getFullURL("/displayParts"));
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load data");
          return;
        }

        setAllRows(data.data || []);
        setVisibleRows(data.data || []);
        setMessage(data.message);
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    }

    fetchDisplayParts();
  }, []);

  function handleShowSelected() {
    if (!selectedShelf) return;

    const filtered = allRows.filter(
      (row) => String(row.shelf_id) === String(selectedShelf)
    );

    setVisibleRows(filtered);
  }

  function handleShowAll() {
    setVisibleRows(allRows);
    setSelectedShelf("");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Display Parts</h1>
      <p>{message}</p>

      {/* Controls */}
      <div style={{ marginBottom: "15px" }}>
        <select
          value={selectedShelf}
          onChange={(e) => setSelectedShelf(e.target.value)}
        >
          <option value="">-- Select Shelf --</option>
          {allRows.map((row) => (
            <option key={row.shelf_id} value={row.shelf_id}>
              {row.shelf_id}
            </option>
          ))}
        </select>

        <button
          onClick={handleShowSelected}
          style={{ marginLeft: "10px" }}
        >
          Show Selected
        </button>

        <button
          onClick={handleShowAll}
          style={{ marginLeft: "10px" }}
        >
          Show All
        </button>
      </div>

      {/* Table */}
      {visibleRows.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <thead style={{ background: "#ddd" }}>
            <tr>
              <th style={{ border: "1px solid #999" }}>Shelf ID</th>
              <th style={{ border: "1px solid #999" }}>Description</th>
              <th style={{ border: "1px solid #999" }}>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #999" }}>{row.shelf_id}</td>
                <td style={{ border: "1px solid #999" }}>
                  {row.description}
                </td>
                <td style={{ border: "1px solid #999" }}>{row.totalQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
