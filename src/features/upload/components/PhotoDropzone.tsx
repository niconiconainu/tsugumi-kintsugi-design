"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { cn } from "@/features/common/utils/cn";
import {
  fileToResizedDataUrl,
  isAcceptedImage,
} from "@/features/upload/utils/read-image";

interface PhotoDropzoneProps {
  imageDataUrl: string | null;
  onSelect: (imageDataUrl: string) => void;
}

export const PhotoDropzone = ({
  imageDataUrl,
  onSelect,
}: PhotoDropzoneProps): React.JSX.Element => {
  const t = useTranslations("dropzone");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined): Promise<void> => {
    if (!file) return;
    if (!isAcceptedImage(file)) {
      setError(t("errorType"));
      return;
    }
    try {
      setError(null);
      onSelect(await fileToResizedDataUrl(file));
    } catch {
      setError(t("errorRead"));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFile(event.dataTransfer.files[0]);
        }}
        className={cn(
          "rounded-lg border-2 border-dashed transition",
          isDragging ? "border-gold bg-gold-pale" : "border-gold/45 bg-paper"
        )}
      >
        {imageDataUrl ? (
          <div className="p-4">
            {/* 器の写真は毎回異なるユーザー画像なので next/image の最適化は使わない。 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt={t("photoAlt")}
              className="max-h-[380px] w-full rounded-md object-contain"
            />
          </div>
        ) : (
          <div className="px-10 py-16 text-center">
            <div className="bg-gold-pale mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(50% 0.1 85)"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M12 16V4M12 4l-5 5M12 4l5 5" />
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </div>
            <p className="text-ink-strong text-[17px] font-semibold">
              {t("title")}
            </p>
            <p className="text-ink-soft mt-1.5 text-[14px]">{t("lead")}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-ink-strong text-cream mt-6 rounded-full px-6 py-2.5 text-[14px] font-medium transition hover:brightness-125"
            >
              {t("chooseFile")}
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      {imageDataUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-ink-soft hover:text-ink mt-4 text-[13px] underline underline-offset-4"
        >
          {t("changePhoto")}
        </button>
      )}

      {error && <p className="text-alert mt-4 text-[13px]">{error}</p>}

      <p className="text-ink-soft mt-6 text-center text-[13px] leading-relaxed">
        {t("tip")}
      </p>
    </div>
  );
};
