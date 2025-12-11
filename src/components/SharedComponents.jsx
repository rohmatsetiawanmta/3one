// src/components/SharedComponents.jsx
import React from "react";

export const MetricItem = ({ icon, title, subtitle }) => (
  <div className="p-4 rounded-lg bg-gray-100 text-black shadow-md">
    <div className="text-4xl font-extrabold text-blue-900 mb-1">{icon}</div>
    <div className="text-lg font-semibold">{title}</div>
    <div className="text-sm text-gray-500">{subtitle}</div>
  </div>
);
