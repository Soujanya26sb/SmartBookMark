"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function AddBookmarkForm({ userId, onAdd }: { userId: string; onAdd?: () => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const add = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url) return;

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: userId,
    });

    if (error) {
      console.error("Error adding bookmark:", error);
      return;
    }

    setTitle("");
    setUrl("");
    onAdd?.();
  };

  return (
    <form onSubmit={add} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-black">Add New Bookmark</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
          placeholder="Enter URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">
          Add Bookmark
        </button>
      </div>
    </form>
  );
}
