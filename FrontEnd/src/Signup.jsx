import { useState } from "react";
import { getFullURL, saveToken } from "./auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/dashboard";

    async function handleSignupFormSubmission(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(getFullURL("/users/signup"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Clear email, password, and name fields
            setEmail("");
            setPassword("");
            setName("");

            navigate(from, { replace: true }); // redirect
        } catch (err) {
            console.error(err);
            setError(err.message || "Signup failed");
        }
    }

    return (
        <div>
            <h2>Signup Page</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSignupFormSubmission}>
                <label>
                    Name <br />
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="new-name"
                    />
                </label>
                <br />
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
                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}