import { useEffect, useState } from "react";
import { getFullURL } from "./auth";

export default function InventoryCount() {
  const [dateOrdered, setDateOrdered] = useState("");
  const [items, setItems] = useState([]);

  // Load ALL shelf IDs ONCE
  useEffect(() => {
    async function loadShelves() {
      const res = await fetch(getFullURL("/inventoryCount/shelf-ids"));
      const data = await res.json();

      // Every shelf is visible, qty editable
      setItems(
        (data.data || []).map((shelfId) => ({
          shelfId,
          qty: 0,
        }))
      );
    }

    loadShelves();
  }, []);

  function handleQtyChange(index, value) {
    if (value < 0) return;

    const updated = [...items];
    updated[index].qty = value;
    setItems(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!dateOrdered) {
      alert("Please select a date");
      return;
    }

    await fetch(getFullURL("/inventoryCount/post"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date_ordered: new Date(dateOrdered + "T00:00:00"),
        items,
      }),
    });

    alert("Inventory saved");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Count</h1>

      <label>
        Date Ordered:
        <br />
        <input
          type="date"
          required
          value={dateOrdered}
          onChange={(e) => setDateOrdered(e.target.value)}
        />
      </label>

      <form onSubmit={handleSubmit}>
        <table style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Shelf ID</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.shelfId}>
                <td style={{ textAlign: "center" }}>{item.shelfId}</td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="number"
                    min="0"
                    value={item.qty}
                    onChange={(e) =>
                      handleQtyChange(i, Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <button type="submit">Save Inventory</button>
      </form>
    </div>
  );
}
