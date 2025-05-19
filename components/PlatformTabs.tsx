"use client";

import SolutionCard from "./SolutionCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { BlinkBlur } from "react-loading-indicators";

const platforms = ["LeetCode", "GFG", "Codeforces"];

interface Solution {
  _id: string;
  platform: string;
  contributor: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  title: string;
  language: string;
  codeSnippet: string;
  description: string;
  // Add other properties as needed
}

export default function PlatformTabs() {
  const [selectedTab, setSelectedTab] = useState("LeetCode");
  const [allSolutions, setallSolutions] = useState<Solution[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fetchSolutions = async () => {
    setLoadingSolutions(true);
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
    } finally {
      setLoadingSolutions(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const groupedSolutions = platforms.reduce<Record<string, Solution[]>>(
    (acc, platform) => {
      acc[platform] = allSolutions.filter((sol) => sol.platform === platform);
      return acc;
    },
    {}
  );

  if (loadingSolutions) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-xs mb-2 text-gray-500">Loading...</span>
        <BlinkBlur
          size="small"
          color={["#ffb500", "#00ff36", "#004aff", "#ff00c9"]}
        />{" "}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 mt-8 mb-10 px-6 items-center justify-center">
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mt-5 mb-10 relative">
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-sm text-gray-500" />
        <input
          type="text"
          placeholder="Search a question (e.g. Two Sum)"
          className="w-full p-2 pl-10 rounded-lg bg-gray-100 text-gray-600 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
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
            LeetCode: "text-white",
            GFG: "text-white",
            Codeforces: "text-white",
          }[name];

          const backgroundColor = {
            LeetCode: "bg-amber-500",
            GFG: "bg-green-500",
            Codeforces: "bg-blue-500",
          }[name];

          return (
            <button
              key={name}
              onClick={() => setSelectedTab(name)}
              className={`px-4 py-2 cursor-pointer rounded-full transition text-sm ${
                isSelected
                  ? `${color} ${backgroundColor}`
                  : `text-gray-500 ${hoverColor}`
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <hr className="mb-5 mt-4 border-gray-500" />

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {(groupedSolutions[selectedTab] || [])
                    .filter((sol) =>
                      sol.title.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((sol) => (
                      <SolutionCard
                        key={sol._id}
                        _id={sol._id}
                        platform={sol.platform}
                        contributor={sol.contributor}
                        title={sol.title}
                        language={sol.language}
                        codeSnippet={sol.codeSnippet}
                        description={sol.description}
                        currentUserEmail={""}
                      />
                    ))}
                </div>
    </div>
  );
}
