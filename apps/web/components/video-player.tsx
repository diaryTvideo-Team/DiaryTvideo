"use client";

import { useState } from "react";
import { Language } from "@repo/types";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  subtitleUrl?: string;
  language: Language;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  subtitleUrl,
  language,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white/70 px-4">
          <p className="text-lg font-medium">
            {language === "ko"
              ? "영상을 불러올 수 없습니다"
              : "Failed to load video"}
          </p>
          <button
            onClick={() => setHasError(false)}
            className="mt-3 text-sm text-primary hover:underline"
          >
            {language === "ko" ? "다시 시도" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
      <style jsx>{`
        video::cue {
          bottom: 80px;
          font-size: 1.2em;
          line-height: 1.4;
          background-color: rgba(0, 0, 0, 0.8);
        }
      `}</style>
      <video
        controls
        crossOrigin="anonymous"
        className="w-full h-full"
        poster={thumbnailUrl}
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onError={() => setHasError(true)}
      >
        <source src={videoUrl} type="video/mp4" />
        {subtitleUrl && (
          <track
            kind="subtitles"
            src={subtitleUrl}
            srcLang={language}
            label={language === "ko" ? "한국어" : "English"}
            default
          />
        )}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
