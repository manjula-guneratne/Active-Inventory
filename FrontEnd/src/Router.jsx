import {createBrowserRouter} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "./Dashboard";
import PartsList from "./PartsList";
import InventoryCount from "./InventoryCount";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/partsList", element: <PartsList /> },
      { path: "/inventoryCount", element: <InventoryCount /> },
    ],
  },
]);

export default router;