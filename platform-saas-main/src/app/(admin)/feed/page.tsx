"use client";
import React, { useEffect, useState } from "react";
import type { ContentItem } from "@/lib/frontendpedia/types";

export default function FeedPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/feed");
        const json = await res.json();
        setItems(json.items || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Trending Feed</h1>
      {items.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{item.title}</h3>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/10 uppercase">
              {item.type}
            </span>
          </div>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="text-xs text-gray-400">{item.tags.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}


