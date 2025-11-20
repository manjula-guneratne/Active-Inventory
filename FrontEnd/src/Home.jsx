import {Link} from "react-router-dom";

export default function Home(){
    return(
        <div>
            <h1>Welcome to the Home Page</h1>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </nav>
        </div>
    )
}