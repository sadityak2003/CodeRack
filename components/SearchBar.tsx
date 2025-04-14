'use client';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <input
        type="text"
        placeholder="Search a question (e.g. Two Sum)"
        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
