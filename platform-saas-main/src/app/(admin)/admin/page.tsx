"use client";
import React, { useEffect, useState } from "react";
import type { AdminMetrics } from "@/lib/frontendpedia/types";
import { mockAdminMetrics } from "@/lib/frontendpedia/mock";

export default function AdminPage() {
  // Mock for now; can be fetched from /api/admin/metrics later
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);

  useEffect(() => {
    setMetrics(mockAdminMetrics);
  }, []);

  if (!metrics) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="p-4 border rounded-lg dark:border-gray-800">
          <p className="text-xs text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold">{metrics.totalUsers}</p>
        </div>
        <div className="p-4 border rounded-lg dark:border-gray-800">
          <p className="text-xs text-gray-500">Active Pro Users</p>
          <p className="text-2xl font-semibold">{metrics.activeProUsers}</p>
        </div>
        <div className="p-4 border rounded-lg dark:border-gray-800">
          <p className="text-xs text-gray-500">MRR (USD)</p>
          <p className="text-2xl font-semibold">${metrics.mrrUsd}</p>
        </div>
        <div className="p-4 border rounded-lg dark:border-gray-800">
          <p className="text-xs text-gray-500">New Signups (This Week)</p>
          <p className="text-2xl font-semibold">{metrics.newSignupsThisWeek}</p>
        </div>
      </div>

      <div className="p-4 border rounded-lg dark:border-gray-800">
        <p className="text-sm text-gray-500">Content management, users table, and subscription charts will be added here.</p>
      </div>
    </div>
  );
}


