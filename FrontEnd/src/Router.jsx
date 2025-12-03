import {createBrowserRouter} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Signup from "./Signup";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "./Dashboard";
import Parts from "./Parts";
import InventoryCount from "./InventoryCount";
import PublicLayout from "./PublicLayout";

const router = createBrowserRouter([
  { 
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/parts", element: <Parts /> },
      { path: "/inventoryCount", element: <InventoryCount /> },
    ],
  },
]);

export default router;