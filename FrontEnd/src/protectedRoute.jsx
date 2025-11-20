import {Navigate, Outlet, useLocation} from "react-router-dom";
import {isLoggedIn} from "./auth";
import {useEffect} from "react";

export default function ProtectedRoute(){
    useEffect(() => {
        console.log("Protected Route is called");
    }, []);
    const location = useLocation();
    if(isLoggedIn()){
        return <Outlet />;
    } else {
        return <Navigate to="login" state={{from: location}} replace />;
    }
    return <Outlet />;
}
