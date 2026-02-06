"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function IntroSplash({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Stay visible for 2.2s, then fade
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    // Remove AFTER fade completes
    const removeTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative h-[290px] w-[290px]">
        <Image
          src="/logo.png"
          alt="Keystone FX"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
