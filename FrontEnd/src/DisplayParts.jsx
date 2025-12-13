import { useEffect, useState } from "react";
import { getFullURL } from "./auth";

export default function DisplayParts() {
  const [rows, setRows] = useState([]);
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

        setRows(data.data || []);
        setMessage(data.message);
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    }

    fetchDisplayParts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Display Parts</h1>
      <p>{message}</p>

      {rows.length > 0 && (
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
            {rows.map((row, index) => (
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
