import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Navbar from "./components/navbar";
import Loader from "./components/Loader";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import { useUser } from "./context/UserContext";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import ImageSearchPage from "./pages/ImageSearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminReports from "./pages/AdminReports";



export default function App() {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white overflow-x-hidden flex flex-col">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
          path="/user"
          element={user ? <UserProfile user={user} /> : <LoginPage />}
        />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/imagesearch" element={<ImageSearchPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
          

          <Route path="*" element={<p className="text-white text-center mt-24">Page not found</p>} />
        </Routes>
      </div>
    </Router>
  );
}