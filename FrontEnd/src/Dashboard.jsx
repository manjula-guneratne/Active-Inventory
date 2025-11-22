import { useEffect, useState } from "react";
import { authFetch, getFullURL } from "./auth";

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
    <div>
      <h1>Dashboard Page</h1>
      {userData ? (
        <div>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
          <p>Created At: {new Date(userData.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
