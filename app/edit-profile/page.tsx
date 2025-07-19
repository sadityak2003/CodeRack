"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "lucide-react";

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
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const { email } = JSON.parse(stored);
        try {
          const res = await fetch(`/api/user?email=${email}`);
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();
          const user = data.user;

          setEmail(user.email || "");
          setName(user.name || "");
          setAvatarUrl(user.avatarUrl || "");
          setDescription(user.description || "");
          setLeetcode(user.leetcode || "");
          setGFG(user.gfg || "");
          setGitHub(user.github || "");
          setLinkedIn(user.linkedin || "");
        } catch (err) {
          console.error("Error fetching user from DB:", err);
        }
      }
    };

    fetchUserData();
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

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Profile update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="flex justify-between gap-15 space-y-5"
        >
          <div className="flex flex-col items-center gap-4">
            <label
              htmlFor="avatar-upload"
              className="relative w-50 h-50 rounded-xl border border-gray-300 cursor-pointer overflow-hidden
                         flex items-center justify-center bg-gray-100 group" // Added 'group' for hover effects
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              {avatarUrl ? (
                <>
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    // On hover, this image becomes slightly transparent and blurred via the overlay
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  {/* Overlay for blur and camera icon */}
                  <div
                    // The magic happens here: a semi-transparent background with backdrop-filter blur
                    className={`absolute inset-0 flex items-center justify-center
                                 bg-white/30 text-gray-800 transition-opacity duration-300
                                 ${
                                   isHoveringImage
                                     ? "opacity-100 backdrop-blur-sm"
                                     : "opacity-0 backdrop-blur-0"
                                 }`}
                    // Ensure the icon is always visible when there's no avatar
                    style={{ opacity: isHoveringImage ? 1 : avatarUrl ? 0 : 1 }}
                  >
                    <CameraIcon size={48} />
                  </div>
                </>
              ) : (
                // No image selected - show camera icon on white background
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <CameraIcon size={64} />
                  <span className="mt-2 text-sm">Upload Photo</span>
                </div>
              )}
            </label>

            <input
              id="avatar-upload"
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
              className="hidden"
            />
            <p className="text-gray-400 text-xs">
              Hover over the image to change it
            </p>
          </div>

          <div className="flex flex-col gap-2 w-3xl">
            <div className="flex gap-5 justify-between items-center">
              <label className="block capitalize mb-1 text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex justify-between gap-5 items-center">
              <label className="block mb-1 text-sm">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex justify-between gap-5 items-center">
              <label className="block mb-1 text-sm">LeetCode Profile</label>
              <input
                type="text"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                className="w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex justify-between gap-5 items-center">
              <label className="block mb-1 text-sm">
                GeeksforGeeks Profile
              </label>
              <input
                type="text"
                value={gfg}
                onChange={(e) => setGFG(e.target.value)}
                className="w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex justify-between gap-5 items-center">
              <label className="block mb-1 text-sm">GitHub Profile</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGitHub(e.target.value)}
                className="w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex justify-between gap-5 items-center">
              <label className="block mb-1 text-sm">LinkedIn Profile</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-50 mt-4 bg-blue-500 hover:bg-blue-700 transition py-2 rounded text-white font-semibold cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
