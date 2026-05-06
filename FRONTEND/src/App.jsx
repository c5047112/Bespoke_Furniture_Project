import "./App.css";
import Signup from "./components/User Pages/Signup";
import Login from "./components/User Pages/Login";
import Home from "./components/User Pages/Home";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/pages/AdminDashboard";
import AdminProducts from "./components/pages/AdminProducts";
import AddProduct from "./components/pages/AddProduct";
import ViewProducts from "./components/pages/ViewProducts";
import EditProduct from "./components/pages/EditProduct";
import UserProducts from "./components/User Pages/Products/UserProducts";
import ViewProduct from "./components/User Pages/Products/ViewProduct";
import CartPage from "./components/User Pages/Products/CartPage";
import AddressPage from "./components/User Pages/Products/AddressPage";
import CheckoutPage from "./components/User Pages/Products/CheckoutPage";
import OrderHistory from "./components/User Pages/Products/OrderHistory";
import StaffPage from "./components/pages/StaffPage";
import VansPage from "./components/pages/VansPage";
import OrdersPage from "./components/pages/OrdersPage";
import OrderDetailsPage from "./components/pages/OrderDetailsPage";
import AdminUsers from "./components/pages/AdminUsers";
import WishlistPage from "./components/User Pages/Products/WishlistPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-products" element={<AdminProducts />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/view-products" element={<ViewProducts />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/product/:id" element={<ViewProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/checkout/:userId/:addressId" element={<CheckoutPage />} />
        <Route path="/orders/:userId" element={<OrderHistory />} />
        <Route path="/admin-staff" element={<StaffPage />} />
        <Route path="/admin/vans" element={<VansPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </>
  );
}

export default App;
