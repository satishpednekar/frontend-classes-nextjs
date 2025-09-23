"use client";
import React, { useEffect, useState } from "react";
import type { Bookmark, Note } from "@/lib/frontendpedia/types";

export default function MyContentPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/my-content");
        const json = await res.json();
        setBookmarks(json.bookmarks || []);
        setNotes(json.notes || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold mb-3">Bookmarks</h1>
        <ul className="space-y-3">
          {bookmarks.map((b) => (
            <li key={b.id} className="p-4 border rounded-lg dark:border-gray-800">
              <h3 className="font-medium">{b.content.title}</h3>
              <p className="text-sm text-gray-500">{b.content.tags.join(", ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h1 className="text-xl font-semibold mb-3">Notes</h1>
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="p-4 border rounded-lg dark:border-gray-800">
              <p className="text-sm">{n.body}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


