"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DefaultAvatar from "../public/images/google.png";
import Image from "next/image";
import {
  Menu,
  X,
  UploadIcon,
  UserCircle,
  LogOut,
  HomeIcon,
  Info,
  Code2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { googleLogin } from "@/lib/auth";

interface User {
  displayName: string;
  email: string;
  photoURL: string;
  uid?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const libraryMenuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = async () => {
    const user = await googleLogin();

    if (user) {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          avatarUrl: user.photoURL,
          description: "No description",
          leetcode: "leetcode",
          gfg: "geeksforgeeks",
          github: "github",
          linkedin: "linkedin",
        }),
      });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user as User);
      setIsSignedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsSignedIn(false);
    window.location.reload();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsSignedIn(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        libraryMenuRef.current &&
        !libraryMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
        setIsOpen(false);
      }
    }

    if (isProfileOpen || isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isOpen]);

  
  /*const imageURL = "https://img.freepik.com/premium-vector/vector-colorful-logo-design_1002026-45.jpg";
  */
  return (
    <nav className="flex items-center justify-between px-8 py-2 bg-white text-gray-900 border-b border-gray-500">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-between items-center gap-2">
          <Code2Icon size={20}></Code2Icon>
          <span className="text-xl text-gray-900 font-bold">Coding Geeks</span>
        </div>

        <ul className="hidden md:flex space-x-6 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-amber-500 transition-all duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link href="/solutions" className="hover:text-amber-500 transition-all duration-200">
              Solutions
            </Link>
          </li>
          <li>
            <Link href="/about-us" className="hover:text-amber-500 transition-all duration-200">
              About Us
            </Link>
          </li>
        </ul>

        {isSignedIn && user ? (
          <div className="hidden md:block relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="relative w-10 h-10">
                <img
                  src={user.photoURL || ""}
                  alt="Profile"
                  className="rounded-full object-cover cursor-pointer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DefaultAvatar.src;
                  }}
                />
              </div>
            </button>
            <div className="relative" ref={libraryMenuRef}>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 mt-4 w-60 border-gray-500 border-1 bg-white shadow-lg rounded-lg p-4 z-50"
                >
                  <div className="flex items-center space-x-3 border-b border-gray-400 mb-2 pb-2">
                    <div className="relative w-10 h-10">
                    <img
                  src={user.photoURL || ""}
                  alt="Profile"
                  className="rounded-full object-cover cursor-pointer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DefaultAvatar.src;
                  }}
                />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray font-bold">
                        {user.displayName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center text-sm space-x-2 hover:text-amber-500 hover:transition-all duration-200 cursor-pointer">
                      <UserCircle size={18} />
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li className="flex items-center text-sm space-x-2 border-b border-gray-400 pb-2 hover:text-amber-500 hover:transition-all duration-200 cursor-pointer">
                      <UploadIcon size={18} />
                      <Link href="/upload">Upload Solution</Link>
                    </li>
                  </ul>

                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full text-sm items-center space-x-2 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-blue-600 px-4 py-2 rounded-full text-sm text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>

      {isSignedIn && user ? (
        <div>
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 right-6 top-14 w-60 border-gray-500 border-1 bg-white shadow-lg rounded-lg p-4"
            >
              <div className="flex items-center space-x-3 border-b border-gray-400 mb-2 pb-2">
                <div className="relative w-10 h-10">
                <img
                  src={user.photoURL || ""}
                  alt="Profile"
                  className="rounded-full object-cover cursor-pointer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DefaultAvatar.src;
                  }}
                />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray font-bold">
                    {user.displayName}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>

              <ul className="mt-2 space-y-2">
                <li className="flex items-center text-sm space-x-2 hover:text-amber-500 hover:transition-all duration-200 cursor-pointer">
                  <HomeIcon size={18} />
                  <Link href="/">Home</Link>
                </li>
                <li className="flex items-center text-sm space-x-2 hover:text-amber-500 hover:transition-all duration-200 cursor-pointer">
                  <Info size={18} />
                  <Link href="/about-us">About Us</Link>
                </li>
                <li className="flex items-center text-sm space-x-2 hover:text-amber-500 hover:transition-all duration-200 cursor-pointer">
                  <UserCircle size={18} />
                  <Link href="/profile">Profile</Link>
                </li>
                <li className="flex items-center text-sm space-x-2 border-b border-gray-400 pb-2 hover:text-amber-500 hover:transition-all duration-200 cursor-pointer">
                  <UploadIcon size={18} />
                  <Link href="/upload">Upload Solution</Link>
                </li>
              </ul>

              <button
                onClick={handleLogout}
                className="mt-2 flex w-full text-sm items-center space-x-2 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
}