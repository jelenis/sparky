import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type FullscreenWrapperProps = {
  isFull: boolean;
  onExit: () => void;
  children: React.ReactNode;
};

export default function FullScreenWrapper({ isFull, onExit, children }: FullscreenWrapperProps) {
  const [el] = useState(() => document.createElement("div"));


  // if fullscreen mode, mount to body
  useEffect(() => {
    if (!isFull) return;

    // mount overlay root into body
    document.body.appendChild(el);
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.body.removeChild(el);
    };
  }, [isFull, el]);

  if (!isFull) {
    // normal, inline layout
    return (
      <div className="relative h-72 w-full rounded-xl overflow-hidden bg-base-200">
        {children}
      </div>
    );
  }

  // fullscreen overlay via portal
  return createPortal(
    <div className="fixed inset-0 z-50 bg-base-200">
      {/* close button on top */}
      <button
        type="button"
        onClick={onExit}
        className="btn btn-map text-gray-700 btn-lg btn-white absolute right-3 top-3 z-50"
      >
       ✕ {/*   TODO replace with react icon */}
      </button>

      <div className="w-full h-full">{children}</div>
    </div>,
    el
  );
}