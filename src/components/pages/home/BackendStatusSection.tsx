"use client";

import { getBackendHealth } from "@/service/api";
import { useEffect, useState } from "react";

type THealth = {
  success: boolean;
  message: string;
};

export function BackendStatusSection() {
  const [health, setHealth] = useState<THealth>({
    success: false,
    message: "Checking backend connection...",
  });

  useEffect(() => {
    const checkHealth = async () => {
      const result = await getBackendHealth();
      setHealth(result);
    };

    checkHealth();
  }, []);

  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl border p-5 ${
            health.success
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              health.success ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            Backend status
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            {health.message}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {health.success
              ? "Frontend is connected to the Express server and MongoDB."
              : "Start the Express server to connect the frontend."}
          </p>
        </div>
      </div>
    </section>
  );
}
