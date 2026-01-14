"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest("nav")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/about", label: "About", icon: "ℹ️" },
    { href: "/Programmes", label: "Programmes", icon: "📋" },
    { href: "/gallery", label: "Gallery", icon: "🖼️" },
    { href: "/contact", label: "Contact", icon: "📞" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/90 py-2 sm:py-3 shadow-2xl shadow-yellow-500/10"
          : "backdrop-blur-lg bg-black/80 py-3 sm:py-4"
      } border-b border-yellow-600/30`}
      aria-label="Main navigation"
    >
      {/* Main Container - Responsive Layout */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          
          {/* Logo Section - Left aligned on all screens */}
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 rounded-xl group flex-shrink-0"
            aria-label="Home"
          >
            <div className="relative">
              <img
                src="/logo.png"
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl group-hover:shadow-yellow-400/30 border-2 border-yellow-600/30"
                alt="Sri Venkateswara Kolata Samithi Logo"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="">
              <span className="text-md sm:text-base lg:text-2xl xl:text-2xl font-black bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap truncate max-w-[160px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[380px] transition-all duration-300 group-hover:from-yellow-200 group-hover:to-yellow-300">
                Sri Venkateswara Kolata Samithi
              </span>
            </div>
          </Link>

          {/* 🔥 DESKTOP NAVIGATION (1080px+) - UNCHANGED */}
          <div className="hidden xl:flex items-center justify-center flex-1 ml-150">
            <div className="flex items-center space-x-2 xl:space-x-1  rounded-2xl p-1.5 ">
              {navItems.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group relative px-5 py-3 font-bold text-base xl:text-lg rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 min-w-[100px] text-center ${
                    isActive(href)
                      ? "text-yellow-100 bg-gradient-to-r from-yellow-600/40 to-yellow-500/30 shadow-lg shadow-yellow-500/20 transform scale-105"
                      : "text-yellow-300/90 hover:text-yellow-100 hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-yellow-500/15 hover:shadow-lg hover:shadow-yellow-500/10 hover:scale-105"
                  }`}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <span className={`text-xl transition-all duration-300 ${isActive(href) ? "scale-110" : "group-hover:scale-110"}`}>
                      {icon}
                    </span>
                    <span className="font-bold tracking-wide">{label}</span>
                  </span>
                  {isActive(href) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* 🔥 HAMBURGER BUTTON - Mobile + Tablet (up to 1080px) */}
          <div className="lg:flex items-center hidden xl:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-yellow-600/20 to-yellow-500/15 hover:from-yellow-600/30 hover:to-yellow-500/25 text-yellow-300 hover:text-yellow-100 transition-all duration-300 border-2 border-yellow-600/40 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-md group"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7">
                <svg
                  className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/0 via-yellow-400/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:via-yellow-400/5 group-hover:to-yellow-500/10 transition-all duration-500" />
            </button>
          </div>

          {/* 🔥 EXISTING MOBILE HAMBURGER (below 1024px) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-yellow-600/20 to-yellow-500/15 hover:from-yellow-600/30 hover:to-yellow-500/25 text-yellow-300 hover:text-yellow-100 transition-all duration-300 border-2 border-yellow-600/40 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-md group"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7">
                <svg
                  className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/0 via-yellow-400/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:via-yellow-400/5 group-hover:to-yellow-500/10 transition-all duration-500" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 TABLET + MOBILE MENU (768px to 1080px + below 1024px) */}
      <div
        className={`${
          mobileMenuOpen ? "xl:hidden" : "hidden"
        } fixed inset-x-0 transition-all duration-300 ease-out top-full opacity-100 visible translate-y-0`}
        style={{ height: "calc(100vh - 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-2xl shadow-2xl border-t border-yellow-600/30">
          <div className="h-full overflow-y-auto py-6 sm:py-8 px-4 sm:px-6 md:px-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent mb-2">
                  Navigation Menu
                </h3>
                <p className="text-yellow-500/70 text-sm sm:text-base">
                  Explore our website
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {navItems.map(({ href, label, icon }, index) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-4 sm:py-5 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      isActive(href)
                        ? "bg-gradient-to-r from-yellow-600/40 to-yellow-500/30 shadow-xl shadow-yellow-500/20 border-2 border-yellow-400/50"
                        : "bg-gradient-to-r from-yellow-600/10 to-yellow-500/5 hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-yellow-500/15 border-2 border-transparent hover:border-yellow-500/30"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className={`relative ${isActive(href) ? "text-yellow-300" : "text-yellow-500/80 group-hover:text-yellow-300"}`}>
                      <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                        {icon}
                      </span>
                      {isActive(href) && (
                        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                        isActive(href) ? "text-yellow-100" : "text-yellow-300/90 group-hover:text-yellow-100"
                      }`}>
                        {label}
                      </span>
                    </div>
                    
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                        isActive(href) ? "text-yellow-300 translate-x-0" : "text-yellow-500/50 group-hover:text-yellow-300 group-hover:translate-x-1"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    
                    {isActive(href) && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
