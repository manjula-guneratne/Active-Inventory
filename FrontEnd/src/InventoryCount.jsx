import { useState } from "react";
import { getFullURL } from "./auth";

export default function PartsList() {
  const [shelfId, setshelfId] = useState("");
  const [orderId, setorderId] = useState("");
  const [dateOrdered, setdateOrdered] = useState("");
  const [qty, setQty] = useState("");

  const [allInventory, setallInventory] = useState([]);

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");

  // handle POSt to parts list
  const handleSubmit = async (e) => {
    // Fetch parts list from backend API
    e.preventDefault();
    try {
      const res = await fetch(getFullURL("/inventoryCount/post"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shelf_id: shelfId,
          order_id: orderId,
          qty: qty,
          date_ordered: dateOrdered,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Inventory count added successfully");
      setFormData(data.data || null);

      // Clear form after successful submission
      setshelfId("");
      setorderId("");
      setQty("");
      setdateOrdered("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisplay = async () => {
    try {
      const res = await fetch(getFullURL("/inventoryCount"));
      const data = await res.json();

      setallInventory(data.data || []);
      setMessage(data.message || "Inventory counts retrieved successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Inventory Count</h1>
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
          date ordered: <br />
          <input
            required
            value={dateOrdered}
            onChange={(e) => setdateOrdered(e.target.value)}
          />
        </label>
        <br />
        <label>
          order_id: <br />
          <input
            required
            value={orderId}
            onChange={(e) => setorderId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Quantity: <br />
          <input
            required
            value={qty}
            onChange={(e) => setQty(e.target.value)}
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
              Shelf ID: {part.shelf_id}, date ordered: {part.date_ordered},
              order_id: {part.order_id}, Quantity: {part.qty}   
            </li>
          ))}   
        </ul>
      )}
    </div>
  );
}
