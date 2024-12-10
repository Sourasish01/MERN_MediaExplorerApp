import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { setContentType } = useContentStore();

  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 h-20  text-white">
      {/* Logo and Desktop Links */}
      <div className="flex items-center gap-12 z-50">
        <Link to="/">
          <img src="/mediaflix-logo.png" alt="Netflix Logo" className="w-32 sm:w-40" />
        </Link>

        {/* Desktop Navbar Items */}
        <nav className="hidden sm:flex gap-6">
          <Link
            to="/"
            className="hover:underline hover:text-red-500 transition"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline hover:text-red-500 transition"
            onClick={() => setContentType("tv")}
          >
            TV Shows
          </Link>
          <Link to="/history" className="hover:underline hover:text-red-500 transition">
            Search History
          </Link>
        </nav>
      </div>

      {/* User Section and Mobile Menu Icon */}
      <div className="flex items-center gap-6 z-50">
        <Link to="/search">
          <Search className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />
        </Link>
        <img
          src={user.image}
          alt="Avatar"
          className="w-8 h-8 rounded-full cursor-pointer border border-gray-700"
        />
        <LogOut
          className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
          onClick={logout}
        />
        <button className="sm:hidden" onClick={toggleMobileMenu}>
          <Menu className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />
        </button>
      </div>

      {/* Mobile Navbar Items */}
      {isMobileMenuOpen && (
        <nav className="absolute top-20 left-0 w-full bg-gray-800 border-t border-gray-700 sm:hidden">
          <Link
            to="/"
            className="block px-6 py-3 hover:bg-gray-700 hover:text-red-500"
            onClick={() => {
              setContentType("movie");
              toggleMobileMenu();
            }}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="block px-6 py-3 hover:bg-gray-700 hover:text-red-500"
            onClick={() => {
              setContentType("tv");
              toggleMobileMenu();
            }}
          >
            TV Shows
          </Link>
          <Link
            to="/history"
            className="block px-6 py-3 hover:bg-gray-700 hover:text-red-500"
            onClick={toggleMobileMenu}
          >
            Search History
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
