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

      // Shelves that not add successfully
      if (data.errors && data.errors.length > 0) {
        alert(
          "Some shelves were not added:\n" +
            data.errors.map((e) => `Shelf ${e.shelf_id}: ${e.error}`).join("\n")
        );
      }

      setMessage(data.message || "Inventory count added successfully");
      setFormData(data.data || null);

      // Clear form after successful submission
      setorderId("");
      setdateOrdered("");
      setItems(Array.from({ length: 3 }, () => ({ shelfId: "", qty: "" })));

      //Update the Display after submission
      handleDisplay();
    } catch (err) {
      console.error(err);
    }
  };

  //Added function to display all inventory counts
  function handleChange(index, field, value) {
    if (field === "qty") {
      // Block negative values
      if (value !== "" && Number(value) < 0) {
        return;
      }
    }

    if (field === "shelfId") {
      const isDuplicate = items.some(
        (item, i) => String(item.shelfId) === String(value) && i !== index
      );

      if (isDuplicate) {
        alert("This shelf is already selected in another row");
        return;
      }
    }

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
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "20px" }}>
          <h1>Inventory Count</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <label>
                order_id: <br />
                <input
                  required
                  value={orderId}
                  onChange={(e) => setorderId(e.target.value)}
                  style={{ textAlign: "center" }}
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
            <div
              style={{ display: "flex", gap: "165px", marginBottom: "10px" }}
            >
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
                <input
                  list={`shelfIds-${index}`}
                  placeholder="Type or select Shelf ID"
                  value={item.shelfId}
                  onChange={(e) =>
                    handleChange(index, "shelfId", e.target.value)
                  }
                  style={{ textAlign: "center" }}
                />
                <datalist id={`shelfIds-${index}`}>
                  {shelfIdlist.map((shelfId) => (
                    <option key={shelfId} value={shelfId} />
                  ))}
                </datalist>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.qty}
                  min="0"
                  step="1"
                  onChange={(e) => handleChange(index, "qty", e.target.value)}
                  style={{ textAlign: "center" }}
                />

                <button
                  type="button"
                  onClick={addRow}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Add Row
                </button>
              </div>
            ))}
            <br />
            <button type="submit">Add Part</button>
          </form>
        </div>
        <div style={{ flex: 1, backgroundColor: "#fff", padding: "20px" }}>
          <h3>Display Parts</h3>
          <button onClick={handleDisplay}>Show All Parts</button>

          {allInventory.length > 0 && (
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
                    <th>Order ID</th>
                    <th>Date Ordered</th>
                    <th>Shelf ID</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {[...allInventory]
                    .sort((a, b) => a.order_id - b.order_id)
                    .map((part, index) => (
                      <tr key={part._id || index}>
                        <td>{part.order_id}</td>
                        <td>
                          {new Date(part.date_ordered).toLocaleDateString()}
                        </td>
                        <td>{part.shelf_id}</td>
                        <td>{part.qty}</td>
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
