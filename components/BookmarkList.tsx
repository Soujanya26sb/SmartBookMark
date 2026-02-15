"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function BookmarkList({ userId }: { userId: string }) {
  const [items, setItems] = useState<Bookmark[]>([]);
  const supabase = createClient();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error);
    }
    setItems(data || []);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
        },
        fetchData
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        fetchData
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
        },
        fetchData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const remove = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setItems(items.filter(item => item.id !== id));
  };

  if (!items.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-black">No bookmarks yet</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by adding a new bookmark above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div
          key={b.id}
          className="group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <a 
                href={b.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="font-semibold text-black group-hover:text-blue-600 transition-colors truncate">
                  {b.title}
                </h3>
                <p className="text-sm text-black mt-1 truncate">{b.url}</p>
              </a>
            </div>
            <button
              onClick={() => remove(b.id)}
              className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
              title="Delete bookmark"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
