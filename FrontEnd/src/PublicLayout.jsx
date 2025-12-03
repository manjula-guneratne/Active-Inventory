import { Outlet } from "react-router-dom";
import {Container} from "react-bootstrap";
import PublicNavbar from "./PublicNavbar";

export default function Layout() {
    return (
        <>
            <PublicNavbar />
            <br></br>
            <Container className="mb-4">
                <Outlet />
            </Container>
        </>
    );
}