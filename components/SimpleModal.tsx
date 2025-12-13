"use client";

import React from "react";

const SimpleModal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title || ""}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal;
