import React from "react";

export function Card({ children }) {
  return <div className="shadow-lg p-4 rounded bg-white">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}
