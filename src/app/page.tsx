"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [uniqueVisitors, setUniqueVisitors] = useState<number>(0);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const res = await fetch("/api/visitors", {
          method: "POST",
        });
        const data = await res.json();
        setUniqueVisitors(data.uniqueVisitors);
        setTotalVisits(data.totalVisits);
      } catch (err) {
        console.error("Error fetching visitor stats:", err);
      } finally {
        setLoading(false);
      }
    };

    trackVisitor();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🚀 Visitor Analytics</h1>

      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <div className="bg-white shadow-md rounded-2xl p-6 text-center space-y-4">
          <p className="text-xl font-semibold">
            Unique Visitors: <span className="text-blue-600">{uniqueVisitors}</span>
          </p>
          <p className="text-xl font-semibold">
            Total Visits: <span className="text-green-600">{totalVisits}</span>
          </p>
        </div>
      )}
    </main>
  );
}
