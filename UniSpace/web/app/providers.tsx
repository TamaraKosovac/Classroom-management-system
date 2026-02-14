"use client";

import { Toaster } from "react-hot-toast";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />
    </>
  );
}