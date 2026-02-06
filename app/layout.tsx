"use client";

import { useState } from "react";
import "./globals.css";
import IntroSplash from "@/components/IntroSplash";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <html lang="en">
      <body className="relative">
        {showIntro && (
          <IntroSplash onFinish={() => setShowIntro(false)} />
        )}

        <div className={showIntro ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
          {children}
        </div>
      </body>
    </html>
  );
}
