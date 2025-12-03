import { Navbar as BSNavbar, Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Logo from "./assets/Logo_resized.png";


export default function AppNavbar() {
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("at");
    navigate("/login");
  }

  return (
    <BSNavbar bg="dark" variant="dark">
      <Container>
        <BSNavbar.Brand as={NavLink} to="/" className="ms-4">
          <img src={Logo} alt="Active Inventory Logo" /><span style={{ display: "inline-block", width: "30px" }}></span>
          Active Inventory
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link as={NavLink} to="/dashboard" className="nav-link">Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/parts" className="nav-link">Parts</Nav.Link>
            <Nav.Link as={NavLink} to="/inventoryCount" className="nav-link">Inventory Count</Nav.Link>
          </Nav>

        <Nav className="ms-auto me-4">
          {/* Logout */}
          <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
        </Nav>  
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
