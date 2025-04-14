"use client";

import SolutionCard from "./SolutionCard";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const platforms = ["LeetCode", "GFG", "Codeforces"];

export default function PlatformTabs() {
  const [selectedTab, setSelectedTab] = useState("LeetCode");
  const [allSolutions, setallSolutions] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const fetchSolutions = async () => {
    try {
      const res = await fetch("/api/solution/all");
      const data = await res.json();

      if (Array.isArray(data.solutions)) {
        setallSolutions(data.solutions);
      } else {
        console.error("Invalid response format:", data);
        setallSolutions([]);
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
      setallSolutions([]);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const groupedSolutions = platforms.reduce((acc, platform) => {
    acc[platform] = allSolutions.filter((sol) => sol.platform === platform);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="mt-8 px-6 items-center justify-center">
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mt-5 mb-10 relative">
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search a question (e.g. Two Sum)"
          className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tab Buttons */}
      <div className="flex justify-center items-center space-x-4">
        {platforms.map((name) => {
          const isSelected = selectedTab === name;

          const hoverColor = {
            LeetCode: "hover:text-amber-500",
            GFG: "hover:text-green-500",
            Codeforces: "hover:text-blue-500",
          }[name];

          const color = {
            LeetCode: "text-amber-500",
            GFG: "text-green-500",
            Codeforces: "text-blue-500",
          }[name];

          return (
            <button
              key={name}
              onClick={() => setSelectedTab(name)}
              className={`px-4 py-2 cursor-pointer rounded-full transition text-sm ${
                isSelected ? `${color}` : `text-gray-500 ${hoverColor}`
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <hr className="mb-5 mt-4 border-gray-600" />

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {(groupedSolutions[selectedTab] || [])
          .filter((sol) =>
            sol.title.toLowerCase().includes(query.toLowerCase())
          )
          .map((sol, idx) => (
            <SolutionCard key={sol._id || idx} {...sol} />
          ))}
      </div>
    </div>
  );
}
