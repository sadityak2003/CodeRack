'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UploadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    platform: '',
    language: '',
    codeSnippet: '',
    description: '',
  });

  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  console.log( user, "user");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.platform) newErrors.platform = "Platform is required";
    if (!form.language) newErrors.language = "Language is required";
    if (!form.codeSnippet) newErrors.codeSnippet = "Code Snippet is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return; // If validation fails, don't proceed with upload

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

      const data = await res.json();

      if (res.ok) {
        alert("✅ Solution uploaded successfully!");
        setForm({
          title: '',
          platform: '',
          language: '',
          codeSnippet: '',
          description: '',
        });
        
        router.push('/profile');
      } 
    } catch (err) {
      console.error("Upload error:", err);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Your Solution</h1>

      <div className="grid gap-4 max-w-2xl">
        <input
          name="title"
          type="text"
          value={form.title}
          placeholder="Question Title"
          className={`p-3 rounded bg-gray-800 border ${errors.title ? 'border-red-500' : 'border-gray-700'}`}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <select
          name="platform"
          value={form.platform}
          className={`p-3 rounded bg-gray-800 border ${errors.platform ? 'border-red-500' : 'border-gray-700'}`}
          onChange={handleChange}
        >
          <option value="">Select Platform</option>
          <option value="LeetCode">LeetCode</option>
          <option value="GFG">GFG</option>
          <option value="Codeforces">Codeforces</option>
        </select>
        {errors.platform && <p className="text-red-500 text-sm">{errors.platform}</p>}

        <input
          name="language"
          type="text"
          value={form.language}
          placeholder="Language (e.g. Python)"
          className={`p-3 rounded bg-gray-800 border ${errors.language ? 'border-red-500' : 'border-gray-700'}`}
          onChange={handleChange}
        />
        {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}

        <textarea
          name="codeSnippet"
          value={form.codeSnippet}
          placeholder="Paste your code here..."
          className={`p-3 rounded bg-gray-800 border ${errors.codeSnippet ? 'border-red-500' : 'border-gray-700'} h-40`}
          onChange={handleChange}
        />
        {errors.codeSnippet && <p className="text-red-500 text-sm">{errors.codeSnippet}</p>}

        <textarea
          name="description"
          value={form.description}
          placeholder="Explain your solution (optional)"
          className="p-3 rounded bg-gray-800 border border-gray-700 h-24"
          onChange={handleChange}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 p-3 rounded hover:bg-blue-700 w-full mt-2"
        >
          Upload Solution
        </button>
      </div>
    </div>
  );
}
