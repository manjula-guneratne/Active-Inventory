import { useState } from "react";
import { getFullURL, saveToken } from "./auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/dashboard";

  async function handleLoginFormSubmission(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(getFullURL("/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.data.accessToken;
      saveToken(token); // store token

      navigate(from, { replace: true }); // redirect
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login Page</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLoginFormSubmission}>
        <label>
          Email <br />
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-email"
          />
        </label>
        <br />
        <label>
          Password <br />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <br />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
