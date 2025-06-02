import * as React from "react";

export const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-2xl border border-gray-200 shadow-md ${className}`}>{children}</div>
);

export const CardContent = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);