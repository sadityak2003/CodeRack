"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2Icon, TrashIcon } from "lucide-react";

type Props = {
  _id: string;
  title: string;
  platform: string;
  language: string;
  contributor: {
    name: string;
    avatarUrl: string;
    email: string;
  };
  codeSnippet: string;
  description: string;
  currentUserEmail: string;
};

export default function SolutionCard({
  _id,
  platform,
  title,
  language,
  contributor,
  codeSnippet,
  description,
  currentUserEmail,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this solution?")) {
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
  }

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white shrink-0 flex flex-col justify-between hover:ring-2 ring-blue-500 transition mt-2">
        {/* Top: Avatar + Name */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={contributor?.avatarUrl}
            alt="avatar"
            className="w-12 h-12 rounded-full border-2 border-gray-500 hover:border-1 hover:border-amber-500  object-fill cursor-pointer"
          />
          <span className="text-lg text-gray-200">
            {contributor?.name || "Anonymous"}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Code Snippet Preview */}
        <pre className="bg-gray-900 p-3 text-gray-400 text-sm rounded h-32 overflow-hidden whitespace-pre-wrap">
          {codeSnippet.length > 150
            ? codeSnippet.slice(0, 150) + "..."
            : codeSnippet}
        </pre>

        {/* Bottom Row */}
        <div className="flex flex-col justify-start items-start text-sm text-gray-400 mt-3">
          <div className="flex justify-between items-center w-full mb-2">
            
            {contributor?.email && currentUserEmail === contributor.email && (
              <div className="flex gap-2">
                 <Edit2Icon
                onClick={() => router.push(`/edit-solution/${_id}`)}
                size={18}
                className="hover:text-green-500 cursor-pointer"
              />
              <TrashIcon
              onClick={handleDelete}
              size={18}
              className="hover:text-red-500 cursor-pointer"
            />
                </div>
            )}
          </div>
          <span className="text-xs">Platform: {platform}</span>
          <span className="text-xs text-gray-300 font-semibold">
            Language: {language}
          </span>
          <button
            className="text-xs text-amber-500 hover:text-blue-400 font-semibold mt-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            View full solution
          </button>
        </div>
      </div>

      {/* MODAL VIEW */}
      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white max-w-full w-full rounded-lg shadow-xl p-6 ml-5 mr-5 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
            >
              ✖
            </button>

            {/* Title + Meta */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={contributor?.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-sm text-gray-400">
                  {platform} • {language}
                </p>
              </div>
            </div>

            {/* Copy Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
              >
                {copied ? "✅ Copied!" : "Copy Code"}
              </button>
            </div>

             <div className="flex gap-4 ">
              {/* Full Code */}
            <div className=" w-1/2 bg-gray-800 p-4 rounded max-h-[500px] overflow-y-auto text-sm text-gray-400 whitespace-pre-wrap">
              {codeSnippet}
            </div>

            {/* Description */}
            <div className=" w-1/2 mt-4 text-sm text-gray-300">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{description}</p>
            </div>
             </div>
            
          </div>
        </div>
      )}
    </>
  );
}
