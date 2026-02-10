"use client";

import { useEffect } from "react";

export default function HeroVideoController() {
  useEffect(() => {
    console.log("HeroVideoController mounted");

    const videoA = document.getElementById(
      "hero-video-a"
    ) as HTMLVideoElement | null;
    const videoB = document.getElementById(
      "hero-video-b"
    ) as HTMLVideoElement | null;

    if (!videoA || !videoB) {
      console.warn("Hero videos not found");
      return;
    }

    let started = false;
    const fallbackDuration = 10;

    const startVideos = () => {
      if (started) return;
      started = true;

      const duration = videoA.duration || fallbackDuration;

      videoA.currentTime = 0;
      videoB.currentTime = duration / 2;

      videoA.play().catch(() => {});
      videoB.play().catch(() => {});
    };

    const restartA = () => {
      videoA.currentTime = 0;
      videoA.play().catch(() => {});
    };

    const restartB = () => {
      videoB.currentTime = 0;
      videoB.play().catch(() => {});
    };

    // Restart videos manually (NO loop attribute)
    videoA.addEventListener("ended", restartA);
    videoB.addEventListener("ended", restartB);

    // Wait for metadata on BOTH videos
    let metaCount = 0;
    const onMeta = () => {
      metaCount += 1;
      if (metaCount === 2) {
        startVideos();
      }
    };

    videoA.addEventListener("loadedmetadata", onMeta);
    videoB.addEventListener("loadedmetadata", onMeta);

    return () => {
      videoA.removeEventListener("ended", restartA);
      videoB.removeEventListener("ended", restartB);
      videoA.removeEventListener("loadedmetadata", onMeta);
      videoB.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  return null;
}
