"use client";

export default function Footer() {
  return (
    <footer className="bg-white text-white md:px-20 md:py-20 py-5 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-2">
          <h3 className="md:text-xl text-md font-bold text-gray-600">Coding Geeks</h3>
          <p className="text-gray-400 md:text-sm text-xs">Empowering coders around the world 🌍</p>
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
