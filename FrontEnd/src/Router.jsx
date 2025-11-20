import {createBrowserRouter} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

export default router;