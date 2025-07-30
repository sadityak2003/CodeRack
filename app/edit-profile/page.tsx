"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "lucide-react";
import { BlinkBlur } from "react-loading-indicators";

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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  };

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-xs mb-2 text-gray-500">Loading...</span>
        <BlinkBlur
          size="small"
          color={["#ffb500", "#00ff36", "#004aff", "#ff00c9"]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-xl font-bold mb-6 text-gray-600">Saved Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="flex md:flex-row flex-col justify-between gap-15 space-y-5"
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
          <div className="flex flex-col gap-2 w-full md:w-2/3">
            <div className="flex md:flex-row flex-col md:gap-5 md:justify-between md:items-center">
              <label className="block capitalize mb-1 text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="md:w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex md:flex-row flex-col md:justify-between md:items-center md:gap-5">
              <label className="block mb-1 text-sm">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="md:w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex md:flex-row flex-col md:justify-between md:gap-5 md:items-center">
              <label className="block mb-1 text-sm">LeetCode Profile</label>
              <input
                type="text"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                className="md:w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex md:flex-row flex-col md:justify-between md:gap-5 md:items-center">
              <label className="block mb-1 text-sm">
                GFG Profile
              </label>
              <input
                type="text"
                value={gfg}
                onChange={(e) => setGFG(e.target.value)}
                className="md:w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex md:flex-row flex-col md:justify-between md:gap-5 md:items-center">
              <label className="block mb-1 text-sm">GitHub Profile</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGitHub(e.target.value)}
                className="md:w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <div className="flex md:flex-row flex-col md:justify-between md:gap-5 md:items-center">
              <label className="block mb-1 text-sm">LinkedIn Profile</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="md:w-100 p-2 rounded border-b-1 text-gray-600"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-50 mt-4 bg-blue-500 hover:bg-blue-700 transition py-2 rounded text-white font-semibold cursor-pointer"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
