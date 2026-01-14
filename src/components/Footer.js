"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black/80 text-white p-6 sm:p-8 md:p-10 mt-10 border-t-2 border-yellow-600/30">
      <div className="max-w-8xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
           {/* Social Media */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 p-4 sm:p-6 rounded-xl border border-yellow-600/20">
  <h3 className="text-xl text-center md:text-2xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
    Connect With Us
  </h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 sm:gap-4">
    
    {/* Facebook */}
    <a
      href="https://facebook.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center p-3 sm:p-4 rounded-lg hover:bg-blue-600/10 transition-all duration-300 border border-transparent hover:border-blue-600/30"
      aria-label="Facebook"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-yellow-300/90 group-hover:text-yellow-200">
        Facebook
      </span>
    </a>

    {/* YouTube */}
    <a
      href="https://youtube.com/@srivenkateswarakolatam-bk5dh?si=kfswJsFlTPqZKieG"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center p-3 sm:p-4 rounded-lg hover:bg-red-600/10 transition-all duration-300 border border-transparent hover:border-red-600/30"
      aria-label="YouTube"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-yellow-300/90 group-hover:text-yellow-200">
        YouTube
      </span>
    </a>
  </div>
</div>
         

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 p-4 sm:p-6 rounded-xl border border-yellow-600/20">
            <h3 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-yellow-200 hover:text-yellow-100 transition-colors flex items-center gap-2">
                  <span>🏠</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-yellow-200 hover:text-yellow-100 transition-colors flex items-center gap-2">
                  <span>ℹ️</span> About
                </Link>
              </li>
              <li>
                <Link href="/Programmes" className="text-yellow-200 hover:text-yellow-100 transition-colors flex items-center gap-2">
                  <span>📋</span> Programmes
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-yellow-200 hover:text-yellow-100 transition-colors flex items-center gap-2">
                  <span>🖼️</span> Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-yellow-200 hover:text-yellow-100 transition-colors flex items-center gap-2">
                  <span>📞</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 p-4 sm:p-6 rounded-xl border border-yellow-600/20">
            <h3 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              About Us
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
              Sri Venkateswara Kolata Samithi is dedicated to preserving traditional devotional music and dance through kolata performances.
            </p>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 p-4 sm:p-6 rounded-xl border border-yellow-600/20">
            <h3 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Location
            </h3>
            <iframe
              title="Guntur Address"
              src="https://www.google.com/maps?q=D.NO.%204-12-22,%20Naidupet%201st%20Line,%20Amaravathi%20Rd,%20Guntur,%20Andhra%20Pradesh%20522007&output=embed"
              width="100%"
              height="200"
              className="border-2 border-yellow-600/40 rounded-lg"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 md:mt-10 border-t border-yellow-600/20 pt-4">
          <p className="text-xs sm:text-sm text-yellow-200">
            Copyright © 2025 Sri Venkateswara Kolata Bajana Mandali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
