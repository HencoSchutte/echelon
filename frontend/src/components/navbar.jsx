import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, User, Menu, X, Package, LogOut, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const menuRef = useRef(null);
  const { cartItems } = useCart();
  const { user, logout } = useUser();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setUserMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleUserClick = () => {
    if (user) {
      setUserMenu(!userMenu);
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/95 backdrop-blur-xl border-b border-neutral-900 py-2 shadow-[0_4px_20px_rgba(139,92,246,0.3)]"
          : "bg-[#020202]/90 backdrop-blur-lg py-4 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 lg:px-14">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="logo-square">
            <span className="line top"></span>
            <span className="line right"></span>
            <span className="line bottom"></span>
            <span className="line left"></span>
          </div>
          <span className="logo-text text-white relative group-hover:text-indigo-400 transition-colors duration-300">
            ECHELON
            <span className="absolute -inset-0.5 rounded-lg bg-indigo-500/10 blur-md opacity-0 group-hover:opacity-100 transition duration-300"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10 text-neutral-400 text-sm">
          <NavItem text="Products" to="/products" />
          <NavItem text="Categories" to="/products" />
          <NavItem text="AI Image Search" to="/imagesearch" />
          <NavItem text="Deals" to="/products" />
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-4 relative">
          {/* Search */}
          <div
            className={`flex items-center bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden transition-all duration-300 ${
              searchOpen ? "w-40 md:w-64 px-3" : "w-9"
            }`}
          >
            <Search
              size={18}
              className="cursor-pointer text-neutral-400 hover:text-white"
              onClick={() => setSearchOpen(!searchOpen)}
            />
            {searchOpen && (
              <input
                placeholder="Search products..."
                className="bg-transparent outline-none ml-2 text-sm w-full text-white placeholder-neutral-500"
              />
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative cursor-pointer group">
            <ShoppingCart className="text-neutral-300 group-hover:text-white transition" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-white text-black px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Icon */}
          <div className="relative">
            <button
              onClick={handleUserClick}
              className="text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <User size={22} />
            </button>

            {/* Dropdown menu for logged-in users */}
            {user && userMenu && (
            <div 
            ref={menuRef}
            className="absolute right-0 mt-3 w-56 rounded-2xl bg-neutral-900/80 backdrop-blur-2xl border border-neutral-800 shadow-[0_0_40px_rgba(139,92,246,0.25)] overflow-hidden">

              {/* Top user info */}
              <div className="px-4 py-3 border-b border-neutral-800">
                <p className="text-sm text-white font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>

              {/* Menu items */}
              <div className="flex flex-col p-2 gap-1">

                <Link
                  to="/user"
                  onClick={() => setUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-indigo-600/20 transition"
                >
                  <User size={16} />
                  Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-indigo-600/20 transition"
                >
                  <Package size={16} />
                  Orders
                </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-indigo-600/20 transition"
                  >
                    <Heart size={16} />
                    <span className="flex-1">Wishlist</span>
                    {user?.wishlist?.length > 0 && (
                      <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                        {user.wishlist.length}
                      </span>
                    )}
                  </Link>

                <div className="h-px bg-neutral-800 my-1"></div>

                <button
                  onClick={() => {
                    logout();
                    setUserMenu(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-red-500/20 transition text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
          </div>


          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-300"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden border-t border-neutral-800 bg-black/90 backdrop-blur-xl shadow-[0_0_25px_rgba(139,92,246,0.3)]">
          <div className="flex flex-col px-6 py-4 gap-4 text-neutral-300">
            <MobileNavItem text="Products" to="/products" />
            <MobileNavItem text="Categories" to="/products" />
            <MobileNavItem text="AI Image Search" to="/imagesearch" />
            <MobileNavItem text="Deals" to="/products" />
            {!user && (
              <>
                <MobileNavItem text="Login" to="/login" />
                <MobileNavItem text="Register" to="/register" />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ text, to }) {
  return (
    <Link to={to} className="relative cursor-pointer group">
      <span className="group-hover:text-white transition">{text}</span>
      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavItem({ text, to }) {
  return (
    <Link
      to={to}
      className="border-b border-neutral-800 pb-2 cursor-pointer hover:text-white transition"
    >
      {text}
    </Link>
  );
}