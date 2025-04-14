"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SolutionCard from "@/components/SolutionCard";
import { CodeIcon, LogOut } from "lucide-react";

const platforms = ["LeetCode", "GFG", "Codeforces"];

export default function MyProfilePage() {
  const [selectedTab, setSelectedTab] = useState("LeetCode");
  const [user, setUser] = useState<any>(null);
  const [loadingSolutions, setLoadingSolutions] = useState(true); // Loading state for solutions
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userSolutions, setUserSolutions] = useState<any[]>([]);
  
  useEffect(() => {
    const local = localStorage.getItem("user");
    if (!local) {
      router.push("/");
      return;
    }

    const userData = JSON.parse(local);

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?email=${userData.email}`);
        const data = await res.json();
        setUser(data.user);
        setIsSignedIn(true);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    console.log(userData, "userData");

    const fetchSolutions = async () => {
      
      try {
        setLoadingSolutions(true);
        const res = await fetch(`/api/solution/usersol?email=${userData.email}`);
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
  }, []);

  console.log(userSolutions, "userSolutions");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsSignedIn(false);
    window.location.reload();
  };

  const groupedSolutions = platforms.reduce((acc, platform) => {
    acc[platform] = userSolutions.filter((sol) => sol.platform === platform);
    return acc;
  }, {} as Record<string, any[]>);

  if (!user) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (loadingSolutions) {
    return <div className="text-white p-10">Loading solutions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-15 px-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        {/* Left: User Info */}
        <div className="md:col-span-1 bg-gray-900 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt="User"
              className="w-20 h-20 rounded object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-5">{user.description}</p>

          <button
            onClick={() => router.push("/edit-profile")}
            className="mt-4 bg-green-400 text-sm text-white py-1 px-4 rounded hover:bg-green-700 transition w-full"
          >
            Edit Profile
          </button>

          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <a href={`https://leetcode.com/u/${user.leetcode}`} target="_blank" className="flex gap-2 items-center">
              <CodeIcon size={16} /> {user.leetcode}
            </a>
            <a href={user.gfg} target="_blank" className="flex gap-2 items-center">
              <CodeIcon size={16} /> {user.gfg}
            </a>
            <a href={user.github} target="_blank" className="flex gap-2 items-center">
              <CodeIcon size={16} /> {user.github}
            </a>
            <a href={user.linkedin} target="_blank" className="flex gap-2 items-center">
              <CodeIcon size={16} /> {user.linkedin}
            </a>
          </div>

          <hr className="my-4 border-gray-600" />

          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 text-sm text-red-400 hover:text-red-600">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Right: Contributions */}
        <div className="md:col-span-3 bg-gray-900 p-6 rounded-lg w-full">
          <h3 className="text-xl font-bold mb-4">My Contributions</h3>

          <div className="flex gap-4 mb-6">
            {platforms.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedTab(name)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedTab === name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {(groupedSolutions[selectedTab] || []).map((sol, idx) => (
              <SolutionCard key={sol._id || idx} {...sol} currentUserEmail={user.email}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
