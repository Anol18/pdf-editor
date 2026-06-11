"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "About Me", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2a2d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold bg-gradient-to-r from-[#0a84ff] to-[#00c6ff] bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                PDFCraft
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full">
                Pro
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-[14px] font-medium transition-colors hover:text-[#0a84ff] ${
                      isActive ? "text-[#0a84ff]" : "text-[#8e8e93]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {/* Action Button */}
            <Link
              href="/pdf-editor"
              className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0a84ff] hover:bg-[#0070e3] active:scale-95 rounded-lg transition-all shadow-md shadow-[#0a84ff]/20"
            >
              Open PDF Editor
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#8e8e93] hover:text-white hover:bg-[#1c1c1e] focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#2a2a2d] bg-[#0a0a0a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-[#0a84ff] bg-[#0a84ff]/10"
                      : "text-[#8e8e93] hover:text-white hover:bg-[#1c1c1e]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-2 px-3 border-t border-[#2a2a2d] mt-2">
              <Link
                href="/pdf-editor"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#0a84ff] hover:bg-[#0070e3] rounded-lg transition-colors"
              >
                Open PDF Editor
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
