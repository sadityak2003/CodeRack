"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2Icon, TrashIcon } from "lucide-react";
import DefaultAvatar from "../public/images/google.png";

type Props = {
  _id: string;
  title: string;
  platform: string;
  contributor: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  language: string;
  codeSnippet: string;
  description: string;
  currentUserEmail: string;
};

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

export default function SolutionCard({
  _id,
  platform,
  title,
  contributor,
  language,
  codeSnippet,
  description,
  currentUserEmail,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }, [router]);

    console.log(user?.email);
    console.log(contributor?.email);

  const handleProfileClick = () => {
    if (contributor?.email === user?.email) {
      router.push(`/profile`);
    } else {
      router.push(`/profile/${contributor?.email}`);
    }
  }; 

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/solution/${_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete solution");
      router.push("/profile"); // Redirect to profile page after deletion
      router.refresh(); // Refresh the page after deletion
    } catch (error) {
      console.error("Error deleting solution:", error);
    }
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-xl text-gray-600 shrink-0 flex flex-col justify-between hover:ring-2 ring-gray-500 transition mt-2">
        {/* Top: Avatar + Name */}
        <div className="flex items-center gap-3 mb-3">
          <img
            onClick={handleProfileClick}
            src={contributor?.avatarUrl || ""}
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-1 hover:border-amber-500  object-fill cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DefaultAvatar.src;
            }}
          />
        
          <span className="text-gray-600">
            {contributor?.name || "Anonymous"}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Code Snippet Preview */}
        <pre className="bg-gray-100 p-3 text-gray-500 text-sm rounded h-32 overflow-hidden whitespace-pre-wrap">
          {codeSnippet.length > 150
            ? codeSnippet.slice(0, 150) + "..."
            : codeSnippet}
        </pre>

        {/* Bottom Row */}
        <div className="flex justify-between items-start text-sm text-gray-400 mt-3">
          <div className="flex flex-col">
          <span className="text-xs text-gray-500">Platform: {platform}</span>
          <span className="text-xs text-gray-500 font-semibold">
            Language: {language}
          </span>
          <button
            className="text-xs text-amber-500 hover:text-blue-400 font-semibold mt-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            View full solution
          </button>
          </div>
          <div>
          <div className="flex justify-between items-center w-full mb-2">
            {currentUserEmail === user?.email && (
              <div className="flex gap-2">
                 <Edit2Icon
                onClick={() => router.push(`/edit-solution/${_id}`)}
                size={18}
                className="hover:text-green-500 cursor-pointer"
              />
              <TrashIcon
                onClick={() => setShowDeleteModal(true)}
                size={18}
                className="hover:text-red-500 cursor-pointer"
              />
                </div>
            )}
          </div>
          </div>
          
        </div>
      </div>

      {/* MODAL VIEW */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-white max-w-full w-full rounded-lg shadow-xl p-6 ml-5 mr-5 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl cursor-pointer"
            >
              ✖
            </button>

            {/* Title + Meta */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={contributor?.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-1 hover:border-amber-500 cursor-pointer"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-600">{title}</h2>
                <p className="text-sm text-gray-500 font-semibold">
                  {platform} • {language}
                </p>
              </div>
            </div>

            {/* Copy Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopy}
                className="bg-blue-500 hover:bg-green-600 px-3 py-1 rounded text-sm cursor-pointer"
              >
                {copied ? "✅ Copied!" : "Copy"}
              </button>
            </div>

             <div className="flex gap-4 ">
              {/* Full Code */}
            <div className=" w-1/2 bg-gray-100 p-4 rounded max-h-[500px] overflow-y-auto text-sm text-gray-500 whitespace-pre-wrap">
              {codeSnippet}
            </div>

            {/* Description */}
            <div className=" w-1/2 mt-4 text-sm text-gray-500">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{description}</p>
            </div>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Solution</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {title}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}