"use client";

import { useEffect, useRef } from "react";
import { triggerFireworks } from "@/lib/triggerFirework";
import Image from "next/image";
import closeIcon from "../../public/close.png";

export default function ResultModal({ url, onClose }) {
  useEffect(() => {
    triggerFireworks(2000); // 2 seconds
  }, []);

  const overlayRef = useRef();

  // Close modal on outside click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "animated-icon.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-orange-50 bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-4xl p-6 relative w-full max-w-lg mx-auto shadow-lg">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transform transition-transform duration-200 hover:scale-110"
        >
          <Image src={closeIcon} alt="Close" width={35} height={35} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-4 mt-15">
          Here's your 3D animated icon!
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-400 text-center mb-8 px-6">
          Please download it now before closing this modal to prevent losing
          access. We do not store the result as a backup at our side.
        </p>

        {/* Video */}
        <div className="w-full aspect-square rounded-4xl shadow-sm bg-gray-200 overflow-hidden mb-5">
          <video
            src={url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleDownload}
            className="
              mt-5 rounded-[10px] text-lg font-semibold flex items-center justify-center
              transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
              bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-200
              [box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%),_0_3px_3px_hsl(24,95%,70%),_0_-2px_hsl(24,90%,88%)_inset]
              hover:translate-y-[1px] hover:scale-[0.98]
              active:translate-y-[2px] active:scale-[0.97]
              h-15 px-10 mb-2 w-full min-w-72
            "
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
