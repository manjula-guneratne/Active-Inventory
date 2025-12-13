import { useState } from "react";
import { useEffect } from "react";
import { getFullURL } from "./auth";

export default function InventoryCount() {
  const [orderId, setorderId] = useState("");
  const [shelfIdlist, setShelfIdlist] = useState([]);

  const [dateOrdered, setdateOrdered] = useState("");
  const [items, setItems] = useState(
    Array.from({ length: 3 }, () => ({ shelfId: "", qty: "" }))
  );

  const [allInventory, setallInventory] = useState([]);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchShelfIds() {
      try {
        const res = await fetch(getFullURL("/inventoryCount/shelf-ids"));
        const data = await res.json();
        setShelfIdlist(data.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchShelfIds();
  }, []);

  // handle POST to inventory count
  const handleSubmit = async (e) => {
    // Fetch inventory count from backend API
    e.preventDefault();
    try {
      const res = await fetch(getFullURL("/inventoryCount/post"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: Number(orderId),
          date_ordered: new Date(dateOrdered + "T00:00:00"),
          items: items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      setMessage(data.message || "Inventory count added successfully");
      setFormData(data.data || null);

      // Clear form after successful submission
      setorderId("");
      setdateOrdered("");
      setItems(Array.from({ length: 3 }, () => ({ shelfId: "", qty: "" })));
    } catch (err) {
      console.error(err);
    }
  };

  //Added function to display all inventory counts
  function handleChange(index, field, value) {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  }

  function addRow() {
    setItems([...items, { shelfId: "", qty: "" }]);
  }

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
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
            date ordered: <br />
            <input
              type="date"
              required
              value={dateOrdered}
              onChange={(e) => setdateOrdered(e.target.value)}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: "165px", marginBottom: "10px" }}>
          <div>
            <strong> Shelf ID</strong>
          </div>
          <div>
            <strong>Quantity</strong>
          </div>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "30px",
              marginBottom: "10px",
              backgroundColor: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <select
              value={item.shelfId}
              onChange={(e) => handleChange(index, "shelfId", e.target.value)}
            >
              <option value="">Select Shelf</option>

              {shelfIdlist.map((id) => {
                const isUsed = items.some(
                  (item, i) =>
                    String(item.shelfId) === String(id) && i !== index
                );

                return (
                  <option key={id} value={String(id)} disabled={isUsed}>
                    {id}
                  </option>
                );
              })}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={item.qty}
              onChange={(e) => handleChange(index, "qty", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addRow}>
          Add Row
        </button>
        <br />
        <br />
        <br />
        <button type="submit">Add Part</button>
      </form>

      <h3>Display Parts</h3>
      <button onClick={handleDisplay}>Show All Parts</button>

      {allInventory.length > 0 && (
        <ul>
          {allInventory.map((part, index) => (
            <li key={part.shelf_id || index}>
              order_id: {part.order_id}, date ordered: {part.date_ordered},
              shelf_id: {part.shelf_id}, Quantity: {part.qty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
