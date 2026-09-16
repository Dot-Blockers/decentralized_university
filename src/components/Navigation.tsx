import React, { useState } from "react";
import {
  Menu,
  X,
  GraduationCap,
  Video,
  BookOpen,
  UserCheck,
  Rss,
  Key,
  Shield,
  LogIn,
  LogOut,
  User as UserIcon,
  Database,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { openAuthModal, logoutUser } from "../store/slices/authSlice";
import { Link, useRouter } from "../router";
import { Du9 } from '../assets/images';


interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showAdminTab?: boolean;
}

export default function Navigation({ activeTab, setActiveTab, showAdminTab }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { path } = useRouter();

  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isAdminUser =
    user?.role === "admin" ||
    user?.email === "umair@dotblockers.com" ||
    user?.email === "admin@decuniversity.com" ||
    showAdminTab;

  const baseNavItems = [
    { id: "courses", path: "/courses", label: "Courses", icon: GraduationCap },
    // { id: "bootcamps", path: "/bootcamps", label: "Bootcamps", icon: BookOpen },
    // { id: "video-lessons", path: "/video-lessons", label: "Interactive Lessons", icon: Video },
    { id: "instructor", path: "/instructor", label: "Instructor Details", icon: UserCheck },
    { id: "blogs", path: "/blogs", label: "Tech Deep-Dives", icon: Rss },
    { id: "check-access", path: "/access-status", label: "Access Status", icon: Key },
    { id: "admin-portal", path: "/admin", label: "Instructor Admin", icon: Shield },
  ];

  const navItems = showAdminTab
    ? baseNavItems
    : baseNavItems.filter((item) => item.id !== "admin-portal");

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={() => setActiveTab("courses")}
              className="flex items-center space-x-3 cursor-pointer group"
              id="logo-btn"
            >
              {/* <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-display font-bold text-lg">DU</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-bold text-lg text-slate-900 leading-tight">
                  Decentralized
                </span>
                <span className="font-sans font-medium text-xs text-blue-600 tracking-wider uppercase leading-none">
                  University
                </span>
              </div> */}
              <img
                src={Du9}
                alt="logo"
                className="object-cover transition duration-700"
                width={150} height={150}
              // referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.path === "/courses" && (path === "/" || path.startsWith("/courses"))) ||
                (item.path !== "/courses" && path.startsWith(item.path)) ||
                activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setActiveTab(item.id)}
                  id={`nav-item-${item.id}`}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions: Auth & Apply */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                  id="user-profile-menu-btn"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user.name ? user.name.slice(0, 2) : "DU"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight flex items-center space-x-1">
                      <span>{user.name.split(" ")[0]}</span>
                      {user.role === "admin" ? (
                        <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                          Admin
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                          Student
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none truncate max-w-[110px]">
                      {user.email}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    id="user-profile-dropdown"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1 text-[10px] text-emerald-600">
                        <Database className="h-3 w-3" />
                        <span>{user.github}</span>
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => {
                          setActiveTab("admin-portal");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Instructor Portal</span>
                      </Link>
                    )}

                    <Link
                      href="/access-status"
                      onClick={() => {
                        setActiveTab("check-access");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Key className="h-4 w-4 text-slate-400" />
                      <span>Check Access & Keys</span>
                    </Link>

                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  style={{ background: "#5B9BD5" }}
                  className=" text-white hover:text-black hover:bg-slate-50 hover:shadow-lg hover:shadow-blue-500/20 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  id="header-sign-in-btn"
                >
                  {/* <LogIn className="h-4 w-4" /> */}
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  style={{ background: "#5B9BD5" }}
                  className=" text-white hover:text-black hover:bg-slate-50 hover:shadow-lg hover:shadow-blue-500/20 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer"
                  id="header-register-btn"
                >
                  {/* <UserIcon className="h-4 w-4" /> */}
                  <span>Register</span>
                </Link>
              </div>
            )}

            <Link
              href="/bootcamps"
              onClick={() => setActiveTab("bootcamps")}
              id="nav-cta-btn"
              className="bg-slate-950 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer"
            >
              Apply to Bootcamp
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel, sliding drawer style */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-in slide-in-from-top duration-200" id="mobile-menu">
          {/* Mobile Auth Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-100">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.slice(0, 2) : "DU"}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    dispatch(logoutUser());
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-800 cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-blue-600 text-white cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="px-3 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.path === "/courses" && (path === "/" || path.startsWith("/courses"))) ||
                (item.path !== "/courses" && path.startsWith(item.path)) ||
                activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  id={`mobile-nav-item-${item.id}`}
                  className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 pb-1 px-2">
              <Link
                href="/bootcamps"
                onClick={() => {
                  setActiveTab("bootcamps");
                  setMobileMenuOpen(false);
                }}
                id="mobile-nav-cta-btn"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer text-sm"
              >
                Apply to Bootcamp
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
