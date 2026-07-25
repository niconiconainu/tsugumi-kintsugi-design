"use client";

import { useState } from "react";
import { Button } from "@/features/common/components/ui/Button";

interface ShareButtonProps {
  projectId: string;
}

export const ShareButton = ({
  projectId,
}: ShareButtonProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    const url = `${window.location.origin}/result?id=${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("この URL をコピーしてください", url);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="ink" onClick={() => void copy()}>
        共有 URL をコピー
      </Button>
      {copied && (
        <span className="text-gold-deep text-[13px]">コピーしました</span>
      )}
    </div>
  );
};
