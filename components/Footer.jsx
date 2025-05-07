"use client";

export default function Footer() {
  return (
    <footer className="bg-white text-white py-8 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-gray-600">Coding Geeks</h3>
          <p className="text-gray-400 text-sm">Empowering coders around the world 🌍</p>
        </div>

        <div className="flex space-x-6">
          <a href="/contact" className="text-gray-400 hover:text-amber-500 transition">
            Contact
          </a>
          <a href="/privacy" className="text-gray-400 hover:text-amber-500 transition">
            Privacy Policy
          </a>
        </div>

        <div className="mt-4 md:mt-0">
          <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} Coding Geeks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
