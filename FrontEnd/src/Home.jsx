import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
        <h2>Home Page</h2>
        <p><Link to="/login">Login</Link></p>
        <p><Link to="/dashboard">Dashboard</Link></p>
         <p><Link to="/profile">Profile</Link></p>
        </>
    )
}