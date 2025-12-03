import {Navigate, useLocation} from "react-router-dom";
import {isLoggedIn} from "./auth";
import {useEffect} from "react";
import Layout from "./Layout";

export default function ProtectedRoute(){
    useEffect(() => {
        console.log("Protected Route is called");
    }, []);
    const location = useLocation();
    if(isLoggedIn()){
        return <Layout />;
    } else {
        return <Navigate to="login" state={{from: location}} replace />;
    }
    return <Layout />;
}
