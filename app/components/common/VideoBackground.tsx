'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlaying = () => setIsPlaying(true);
    const handlePauseOrError = () => setIsPlaying(false);

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePauseOrError);
    video.addEventListener('error', handlePauseOrError);

    // If video is already playing or ready
    if (!video.paused && video.readyState >= 3) {
      setIsPlaying(true);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePauseOrError);
      video.removeEventListener('error', handlePauseOrError);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center min-w-full min-h-full transition-opacity duration-700 brightness-[0.85]"
          style={{ opacity: isPlaying ? 1 : 0 }}
        >
          <source src="/video_background.webm" type="video/webm" />
          <source src="/video_background.mp4" type="video/mp4" />
        </video>
        {/* Subtle light dimming overlay for natural video brightness */}
        <div
          className="absolute inset-0 bg-black/15 transition-opacity duration-700 pointer-events-none"
          style={{ opacity: isPlaying ? 1 : 0 }}
        />
      </div>

      {/* Heavy Vignette + Dark Overlay (Active ONLY when video is NOT playing as fallback) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.88)_65%,rgba(0,0,0,0.98)_100%)] transition-opacity duration-700"
        style={{ opacity: isPlaying ? 0 : 1 }}
        suppressHydrationWarning
      />
    </>
  );
}
