import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch, getFullURL } from "./auth";
import PartsList from "./Parts";
import InventoryCount from "./InventoryCount";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await authFetch(getFullURL("/users/dashboard"));
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch dashboard");
        }

        setUserData(data.data.user);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2>This is the Dashboard</h2>
      <p>
        <Link to="/parts">Add new Part</Link>
      </p>
      <p>
        <Link to="/inventoryCount">Inventory Count</Link>
      </p>
    </>
  );
}
