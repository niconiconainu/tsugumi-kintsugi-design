"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/features/common/components/ui/Button";

interface ShareButtonProps {
  projectId: string;
}

export const ShareButton = ({
  projectId,
}: ShareButtonProps): React.JSX.Element => {
  const t = useTranslations("result");
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    // 現在のパスをそのまま使うので、共有先も同じ言語で開く。
    const url = `${window.location.origin}${window.location.pathname}?id=${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt(t("sharePrompt"), url);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="ink" onClick={() => void copy()}>
        {t("share")}
      </Button>
      {copied && (
        <span className="text-gold-deep text-[13px]">{t("copied")}</span>
      )}
    </div>
  );
};
