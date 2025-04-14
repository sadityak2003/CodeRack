"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [description, setDescription] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [gfg, setGFG] = useState("");
  const [github, setGitHub] = useState("");
  const [linkedin, setLinkedIn] = useState("");

  // Load user data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setEmail(user.email || "");
      setName(user.name || "");
      setAvatarUrl(user.avatarUrl || "");
      setDescription(user.description || "");
      setLeetcode(user.leetcode || "");
      setGFG(user.gfg || "");
      setGitHub(user.github || "");
      setLinkedIn(user.linkedin || "");

      console.log(user, "user");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedProfile = {
      email,
      name,
      avatarUrl,
      description,
      leetcode,
      gfg,
      github,
      linkedin,
    };

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Profile update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-xl mx-auto bg-gray-900 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Profile Photo</label>
            <div className="flex items-center gap-4">
              <Image
                src={avatarUrl}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border border-gray-700"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAvatarUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-sm bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">LeetCode Profile</label>
            <input
              type="text"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">GeeksforGeeks Profile</label>
            <input
              type="text"
              value={gfg}
              onChange={(e) => setGFG(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">GitHub Profile</label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGitHub(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">LinkedIn Profile</label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition py-2 rounded text-white font-semibold"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
