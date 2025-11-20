import {useEffect, useState} from "react";
import {authFetch, getFullURL} from "./auth";

export default function Dashboard() {
     const [data, setData] = useState(null);
     useEffect(() => {
        authFetch(getFullURL("/students"))
            .then(async (r) => r.json())
            .then((res) => console.log(res));
        }, []);

    return <h1>Dashboard Page</h1> ;
}
            