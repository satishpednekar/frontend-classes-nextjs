"use client";

import { useState } from 'react';

export default function TestAdminPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Test Admin Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Simple Test
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a test page to verify the admin route is working.
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Count: {count}
          </button>
        </div>
      </div>
    </div>
  );
}
