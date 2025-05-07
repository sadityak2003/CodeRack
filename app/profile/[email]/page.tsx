"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SolutionCard from "@/components/SolutionCard";
import DefaultAvatar from "../../../public/images/google.png";
import { CodeIcon } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { BlinkBlur } from "react-loading-indicators";

// Define interfaces for type safety
interface User {
  name: string;
  email: string;
  avatarUrl: string;
  description: string;
  leetcode: string;
  gfg: string;
  github: string;
  linkedin: string;
}

interface Solution {
  _id: string;
  platform: string;
  contributor: string;
  title: string;
  // Add other properties as needed
}

const platforms = ["LeetCode", "GFG", "Codeforces"];

export default function UserProfilePage() {
  const [selectedTab, setSelectedTab] = useState("LeetCode");
  const [user, setUser] = useState<User | null>(null);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const router = useRouter();
  const [userSolutions, setUserSolutions] = useState<Solution[]>([]);
  const params = useParams();
  const email = params?.email || ""; // Get email from URL param
  const [query, setQuery] = useState("");

  useEffect(() => {
    const local = localStorage.getItem("user");
    if (!local) {
      router.push("/");
      return;
    }


    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?email=${email}`);
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    console.log(email, "userData");

    const fetchSolutions = async () => {
      try {
        setLoadingSolutions(true);
        const res = await fetch(`/api/solution/usersol?email=${email}`);
        const data = await res.json();
        setUserSolutions(data.solutions);
        setLoadingSolutions(false);
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setLoadingSolutions(false);
      }
    };

    fetchUser();
    fetchSolutions();
  }, [router]);

  console.log(userSolutions, "userSolutions");

  const groupedSolutions = platforms.reduce((acc, platform) => {
    acc[platform] = userSolutions.filter((sol) => sol.platform === platform);
    return acc;
  }, {} as Record<string, Solution[]>);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-xs mb-2 text-gray-500">Loading Profile...</span>
        <BlinkBlur size="small" color={["#ffb500", "#00ff36", "#004aff", "#ff00c9"]} />
      </div>
    );
  }

  if (loadingSolutions) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-xs mb-2 text-gray-500">Loading Solutions...</span>
        <BlinkBlur size="small" color={["#ffb500", "#00ff36", "#004aff", "#ff00c9"]} />
      </div>
    );
  }

  return (
    <div className="flex gap-5 min-h-screen bg-gray-100 text-white pt-10 px-8 pb-20 justify-center">
        {/* Left: User Info */}
        <div className="md:col-span-1 shadow-xl bg-white p-6 rounded-lg w-fit h-fit">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <img
                src={user.avatarUrl || ""}
                alt="Profile"
                className="rounded-full object-cover w-20 h-20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DefaultAvatar.src;
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                {user.name}
              </h2>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-5">{user.description}</p>

          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <a
              href={`https://leetcode.com/u/${user.leetcode}`}
              target="_blank"
              className="flex gap-2 items-center"
            >
              <CodeIcon size={16} /> {user.leetcode}
            </a>
            <a
              href={user.gfg}
              target="_blank"
              className="flex gap-2 items-center"
            >
              <CodeIcon size={16} /> {user.gfg}
            </a>
            <a
              href={user.github}
              target="_blank"
              className="flex gap-2 items-center"
            >
              <CodeIcon size={16} /> {user.github}
            </a>
            <a
              href={user.linkedin}
              target="_blank"
              className="flex gap-2 items-center"
            >
              <CodeIcon size={16} /> {user.linkedin}
            </a>
          </div>
        </div>

        {/* Right: Contributions */}
        <div className="md:col-span-3 shadow-xl bg-white p-6 rounded-lg w-5xl h-fit">
          <h3 className="text-xl font-bold mb-4 text-gray-600">
            {user.name} Contributions
          </h3>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {(groupedSolutions[selectedTab] || [])
              .filter((sol) =>
                sol.title.toLowerCase().includes(query.toLowerCase())
              )
              .map((sol) => (
                <SolutionCard
                  key={sol._id}
                  {...sol}
                  currentUserEmail={user.email}
                />
              ))}
          </div>
        </div>
    </div>
  );
}
