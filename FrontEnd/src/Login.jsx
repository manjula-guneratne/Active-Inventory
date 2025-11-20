import { useState } from "react";
import { getFullURL, saveToken } from "./auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname || "/dashboard";
 const navigate = useNavigate();

  async function handleLoginFormSubmission(e) {
    e.preventDefault();
    setError(null);
    try {
        const res = await fetch(getFullURL("/users/login"), {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({email, password})
        })

        if(! res.ok) {
            throw new Error (await res.json() || "Login failed")
        }
        const data = await res.json();
        const token = data.token;
        console.log("token", token);
        saveToken(token);
        navigate(from, {replace: true})
    } catch(error) {
        setError(error.message || "Login Failed")
    }
  }

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLoginFormSubmission}>
        <label>
          email <br />
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />

        <label>
          password <br />
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
