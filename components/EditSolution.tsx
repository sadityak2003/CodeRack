"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlinkBlur } from "react-loading-indicators";

interface FormData {
  title: string;
  platform: string;
  language: string;
  codeSnippet: string;
  description: string;
}

export default function EditSolutionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState<FormData>({
    title: "",
    platform: "",
    language: "",
    codeSnippet: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-xs mb-2 text-gray-500">Loading Solution...</span>
        <BlinkBlur
          size="small"
          color={["#ffb500", "#00ff36", "#004aff", "#ff00c9"]}
        />
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col min-h-screen bg-gray-200 pt-10 md:px-20 px-5 gap-5 justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 w-full max-w-xl h-fit">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          A Good Description Helps Others Understand Your Code 🧠✨
        </h2>
        <p className="text-gray-500">
          🛠️ Your code solves the problem, but your explanation solves the
          *confusion*! <br />
          <br />
          📚 Adding clear descriptions makes it easier for others to learn from
          your solution and apply the logic themselves. <br />
          <br />
          👩‍💻 Think about the beginner who might be seeing this concept for the
          first time — your explanation can be their lightbulb moment! 💡
          <br />
          <br />
          🔍 A well-documented solution also reflects your professionalism and
          communication skills — a big plus in your coding journey. 🚀
          <br />
          <br />
          🖋️ So take a moment to explain your approach, your thinking, and any
          tricky parts — you are building not just solutions, but understanding!
          🤝
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 w-full h-full">
        <h1 className="text-xl font-bold mb-6 text-gray-600">Edit Solution</h1>

        {/* First Column: Title, Platform, Language, Button, Description */}
        <div className="grid gap-4 md:w-4xl">
          {/* Title */}
          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
            <label className="block capitalize mb-1 text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="md:w-2xl text-sm p-2 border rounded bg-gray-100 border-gray-700"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Platform */}
          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
            <label className="block capitalize mb-1 text-gray-600">
              Platform
            </label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="md:w-2xl text-sm p-2 border rounded bg-gray-100 border-gray-700"
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
          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
            <label className="block capitalize mb-1 text-gray-600">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="md:w-2xl text-sm p-2 border rounded bg-gray-100 border-gray-700"
            />
            {errors.language && (
              <p className="text-red-500 text-sm">{errors.language}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
            <label className="block capitalize mb-1 text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="md:w-2xl text-sm p-2 border rounded bg-gray-100 border-gray-700"
              rows={12}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Second Column: Code Snippet + Button */}
          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
            <label className="block capitalize mb-1 text-gray-600">Code</label>
            <textarea
              name="codeSnippet"
              value={form.codeSnippet}
              onChange={handleChange}
              className="md:w-2xl text-sm h-full p-2 border rounded bg-gray-100 border-gray-700"
              rows={12}
            />
            {errors.codeSnippet && (
              <p className="text-red-500 text-sm">{errors.codeSnippet}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="bg-amber-500 text-white w-fit px-4 py-2 rounded hover:bg-amber-600 mt-5 cursor-pointer"
        >
          Update Solution
        </button>
      </div>
    </div>
  );
}
