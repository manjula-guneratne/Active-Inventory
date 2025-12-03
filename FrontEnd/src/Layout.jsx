import AppNavbar from "./AppNavbar";
import { Outlet } from "react-router-dom";
import {Container} from "react-bootstrap";

export default function Layout() {
    return (
        <>
            <AppNavbar />
            <br></br>
            <Container className="mb-4">
                <Outlet />
            </Container>
        </>
    );
}