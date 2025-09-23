import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Frontendpedia | Dashboard",
  description: "Learning dashboard",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-8">
        <div className="p-4 border rounded-lg dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Welcome back</h2>
            <span className="text-xs text-gray-500">Pro Status: Inactive</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Your personalized learning overview</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg dark:border-gray-800">
            <h3 className="font-medium mb-1">JS Skill Progress</h3>
            <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded">
              <div className="h-2 bg-brand-500 rounded" style={{ width: "55%" }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">55% based on completed items</p>
          </div>
          <div className="p-4 border rounded-lg dark:border-gray-800">
            <h3 className="font-medium mb-1">Growth (Last 7 days)</h3>
            <div className="h-24 bg-gray-50 dark:bg-white/5 rounded" />
            <p className="text-xs text-gray-500 mt-2">Learning momentum chart</p>
          </div>
        </div>
      </div>

      <aside className="col-span-12 xl:col-span-4 space-y-4">
        <div className="p-4 border rounded-lg dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10">
          <h3 className="font-semibold">Upgrade to Pro</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Unlock AI-driven paths, unlimited feed, and premium resources.</p>
          <button className="mt-3 inline-flex items-center px-3 py-2 text-sm rounded bg-brand-500 text-white">Upgrade</button>
        </div>

        <div className="p-4 border rounded-lg dark:border-gray-800">
          <h3 className="font-medium">Key Metrics</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Items completed this week: 4</li>
            <li>Time spent (7d): 2h 35m</li>
            <li>Bookmarks: 12</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
