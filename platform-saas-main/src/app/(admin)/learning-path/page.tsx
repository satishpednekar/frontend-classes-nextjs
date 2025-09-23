"use client";
import React, { useEffect, useState } from "react";
import type { LearningPath } from "@/lib/frontendpedia/types";

export default function LearningPathPage() {
  const [data, setData] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/learning-path");
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!data) return <div className="p-4">No learning path available.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{data.title}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.progressPercent}% complete
        </span>
      </div>

      <ul className="space-y-3">
        {data.items.map((item) => (
          <li key={item.id} className="p-4 border rounded-lg dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Step {item.order}</p>
                <h3 className="font-medium">{item.content.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.content.type.toUpperCase()} · {item.content.tags.join(", ")}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/10">
                {item.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


