"use client";

import { useState } from "react";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkList from "./BookmarkList";

export default function BookmarkManager({ userId }: { userId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <AddBookmarkForm userId={userId} onAdd={() => setRefreshKey(prev => prev + 1)} />
      <BookmarkList userId={userId} key={refreshKey} />
    </>
  );
}
