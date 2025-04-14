"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSolutionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState({
    title: "",
    platform: "",
    language: "",
    codeSnippet: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  useEffect(() => {
    if (!id) return;

    const fetchSolution = async () => {
      try {
        const res = await fetch(`/api/solution/${id}`);
        const data = await res.json();
        setForm({
          title: data.title || "",
          platform: data.platform || "",
          language: data.language || "",
          codeSnippet: data.codeSnippet || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error("Error fetching solution:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.platform) newErrors.platform = "Platform is required";
    if (!form.language) newErrors.language = "Language is required";
    if (!form.codeSnippet) newErrors.codeSnippet = "Code is required";
    if (!form.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch(`/api/solution/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ Solution updated successfully!");
        router.push("/profile");
      } else {
        alert("❌ Failed to update.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("⚠️ Something went wrong.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4 mt-8 mb-20">
      <h1 className="text-2xl font-bold mb-6 text-center text-amber-500">
        Edit Solution
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Column: Title, Platform, Language, Button, Description */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block capitalize mb-1 text-gray-400">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-400 border-amber-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Platform */}
          <div>
            <label className="block capitalize mb-1 text-gray-400">Platform</label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-400 border-amber-500 bg-black"
            >
              <option value="">Select Platform</option>
              <option value="LeetCode">LeetCode</option>
              <option value="GFG">GFG</option>
              <option value="Codeforces">Codeforces</option>
            </select>
            {errors.platform && (
              <p className="text-red-500 text-sm">{errors.platform}</p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block capitalize mb-1 text-gray-400">Language</label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-400 border-amber-500"
            />
            {errors.language && (
              <p className="text-red-500 text-sm">{errors.language}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block capitalize mb-1 text-gray-400">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full text-gray-400 p-2 border rounded border-amber-500"
              rows={10}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Second Column: Code Snippet + Button */}
        <div>
          <label className="block capitalize mb-1 text-gray-400">
            Code Snippet
          </label>
          <textarea
            name="codeSnippet"
            value={form.codeSnippet}
            onChange={handleChange}
            className="w-full h-full text-gray-400 p-2 border rounded border-amber-500"
            rows={10}
          />
          {errors.codeSnippet && (
            <p className="text-red-500 text-sm">{errors.codeSnippet}</p>
          )}
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Update Solution
          </button>
        </div>
      </div>
    </div>
  );
}
