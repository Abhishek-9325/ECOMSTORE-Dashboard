import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProductsPage from "./pages/ProductsPage";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/[productId]";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/[categoryId]";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/home" />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/create",
        element: <CreateProduct />,
      },
      {
        path: "products/edit/:productId",
        element: <EditProduct />,
      },
      {
        path: "category",
        element: <CategoryPage />,
      },
      {
        path: "category/create",
        element: <CreateCategory />,
      },
      {
        path: "category/edit/:categoryId",
        element: <EditCategory />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
