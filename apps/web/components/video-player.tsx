"use client";

import { Language } from "@/lib/translations";

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
