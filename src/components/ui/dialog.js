// src/components/ui/dialog.jsx
import React from "react";

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle };
