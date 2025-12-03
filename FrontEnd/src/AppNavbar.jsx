import { Navbar as BSNavbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Logo from "./assets/Logo.jpg";

export default function AppNavbar() {
  return (
    <BSNavbar bg="dark" variant="dark">
      <Container>

          <BSNavbar.Brand as={Link} to="/" className="ms-4">
          <img src={Logo} alt="Active Inventory Logo" />
            
          </BSNavbar.Brand>

          <Link to="/dashboard" className="ms-4 text-white text-decoration-none">
            Dashboard
          </Link>

          <Link to="/inventoryCount" className="ms-4 text-white text-decoration-none">
            Inventory Count
          </Link>

          <Link to="/parts" className="ms-4 text-white text-decoration-none">
            Parts
          </Link>

      </Container>
    </BSNavbar>
  );
}
