"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BlinkBlur } from "react-loading-indicators";

interface FormData {
  title: string;
  platform: string;
  language: string;
  codeSnippet: string;
  description: string;
}

interface FormErrors {
  title?: string;
  platform?: string;
  language?: string;
  codeSnippet?: string;
  description?: string;
}

interface User {
  email: string;
  name?: string;
}

export default function UploadPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    title: "",
    platform: "",
    language: "",
    codeSnippet: "",
    description: "",
  });

  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  console.log(user, "user");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.platform) newErrors.platform = "Platform is required";
    if (!form.language) newErrors.language = "Language is required";
    if (!form.codeSnippet) newErrors.codeSnippet = "Code Snippet is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return; // If validation fails, don't proceed with upload
    if (!user) {
      alert("Please login to upload a solution");
      return;
    }

    try {
      const res = await fetch("/api/solution/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          title: form.title,
          platform: form.platform,
          language: form.language,
          codeSnippet: form.codeSnippet,
          description: form.description,
        }),
      });

      if (res.ok) {
        alert("✅ Solution uploaded successfully!");
        setForm({
          title: "",
          platform: "",
          language: "",
          codeSnippet: "",
          description: "",
        });

        router.push("/profile");
      } else {
        const errorData = await res.json();
        alert(`⚠️ Upload failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BlinkBlur size="small" color={["#ffb500", "#00ff36", "#004aff", "#ff00c9"]} />{" "}
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col min-h-screen bg-gray-100 pt-10 md:px-20 px-5 gap-5 justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 w-full max-w-xl h-fit">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          Why Contribute to Us? 🚀
        </h2>
        <p className="text-gray-500">
          🌟 Be a part of a growing community passionate about learning and
          helping others! <br />
          <br />
          ✍️ Share your solutions, and tips to make it easier for
          students worldwide to find the help they need. <br />
          <br />
          🤝 By contributing, you’re not just helping others — you’re also
          reinforcing your own knowledge and building a strong portfolio of
          work. <br />
          <br />
          🌱 Lets grow together, inspire others, and make education accessible
          for everyone! <br />
          <br />
          🔥 Every contribution you make brings someone closer to success — and
          thats a legacy worth building.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 w-full h-full">
        <h1 className="text-xl font-bold mb-4 text-gray-600">Your Solution</h1>

        <div className="grid gap-4 md:w-4xl">
          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
          <label className="block capitalize mb-1 text-gray-600">Title</label>
            <input
              name="title"
              type="text"
              value={form.title}
              placeholder="Question Title"
              className={`p-2 text-sm rounded bg-gray-100 md:w-2xl border ${
                errors.title ? "border-red-500" : "border-gray-700"
              }`}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
          <label className="block capitalize mb-1 text-gray-600">Platform</label>
          <select
              name="platform"
              value={form.platform}
              className={`p-2 text-sm rounded bg-gray-100 md:w-2xl border cursor-pointer ${
                errors.platform ? "border-red-500" : "border-gray-700"
              }`}
              onChange={handleChange}
            >
              <option value="" className="text-gray-600">
                Select Platform
              </option>
              <option value="LeetCode" className="text-gray-600">
                LeetCode
              </option>
              <option value="GFG" className="text-gray-600">
                GFG
              </option>
              <option value="Codeforces" className="text-gray-600">
                Codeforces
              </option>
            </select>
            {errors.platform && (
              <p className="text-red-500 text-sm">{errors.platform}</p>
            )}
          </div>

          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
          <label className="block capitalize mb-1 text-gray-600">Language</label>
          <input
              name="language"
              type="text"
              value={form.language}
              placeholder="Language (e.g. Python)"
              className={`p-2 text-sm rounded bg-gray-100 md:w-2xl border ${
                errors.language ? "border-red-500" : "border-gray-700"
              }`}
              onChange={handleChange}
            />
            {errors.language && (
              <p className="text-red-500 text-sm">{errors.language}</p>
            )}
          </div>

          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
          <label className="block capitalize mb-1 text-gray-600">
            Code 
          </label>
            <textarea
              name="codeSnippet"
              value={form.codeSnippet}
              placeholder="Paste your code here..."
              className={`p-2 text-sm rounded bg-gray-100 md:w-2xl border ${
                errors.codeSnippet ? "border-red-500" : "border-gray-700"
              } h-40`}
              onChange={handleChange}
            />
            {errors.codeSnippet && (
              <p className="text-red-500 text-sm">{errors.codeSnippet}</p>
            )}
          </div>

          <div className="flex md:flex-row flex-col md:gap-5 justify-between">
          <label className="block capitalize mb-1 text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              placeholder="Explain your solution (optional)"
              className="p-2 text-sm rounded bg-gray-100 md:w-2xl border border-gray-700 h-45"
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleUpload}
            className="bg-amber-500 text-white w-fit px-4 py-2 rounded hover:bg-amber-600 mt-5 cursor-pointer"
          >
            Upload Solution
          </button>
        </div>
      </div>
    </div>
  );
}
