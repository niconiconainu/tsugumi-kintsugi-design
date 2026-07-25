"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DESIGN_TASTES, type DesignTaste } from "@/constants/design/expression";
import {
  MATCH_PRIORITIES,
  type MatchPriority,
} from "@/constants/project/priority";
import { PREFECTURES, type Prefecture } from "@/constants/region/prefecture";
import { Button } from "@/features/common/components/ui/Button";
import { cn } from "@/features/common/utils/cn";
import { useProjectStore } from "@/features/project/store/project-store";
import { useRouter } from "@/i18n/navigation";

const FIELD_CLASS =
  "border-line-cool bg-paper text-ink placeholder:text-ink-faint focus:border-gold w-full rounded-md border px-4 py-3 text-[15px] focus:outline-none";

const optionClass = (selected: boolean): string =>
  cn(
    "rounded-lg border px-5 py-4 text-left transition",
    selected
      ? "border-gold bg-gold-pale"
      : "border-line bg-paper hover:border-line-warm"
  );

/**
 * 入力フォーム本体。
 * 復元済みの状態でのみマウントされるので、初期値は store からそのまま読める。
 */
export const StoryForm = (): React.JSX.Element => {
  const router = useRouter();
  const t = useTranslations("story");
  const tTaste = useTranslations("taste");
  const tTasteDesc = useTranslations("tasteDescription");
  const tPriority = useTranslations("priority");
  const tPriorityDesc = useTranslations("priorityDescription");
  const tPrefecture = useTranslations("prefecture");
  const setPreference = useProjectStore((state) => state.setPreference);

  const [story, setStory] = useState(() => useProjectStore.getState().story);
  const [tastes, setTastes] = useState<DesignTaste[]>(
    () => useProjectStore.getState().tastes
  );
  const [prefecture, setPrefecture] = useState<Prefecture | "">(
    () => useProjectStore.getState().prefecture ?? ""
  );
  const [priority, setPriority] = useState<MatchPriority>(
    () => useProjectStore.getState().priority
  );

  const toggleTaste = (taste: DesignTaste): void =>
    setTastes((current) =>
      current.includes(taste)
        ? current.filter((item) => item !== taste)
        : [...current, taste]
    );

  const submit = (): void => {
    if (!prefecture) return;
    setPreference({ story, tastes, prefecture, priority });
    router.push("/analyzing");
  };

  return (
    <div className="space-y-10">
      <section>
        <label
          htmlFor="story"
          className="text-ink block text-[15px] font-semibold"
        >
          {t("storyLabel")}
          <span className="text-ink-faint ml-2 text-[13px] font-normal">
            {t("optional")}
          </span>
        </label>
        <textarea
          id="story"
          value={story}
          onChange={(event) => setStory(event.target.value)}
          rows={6}
          maxLength={2000}
          placeholder={t("storyPlaceholder")}
          className={cn(FIELD_CLASS, "mt-3 leading-[1.8]")}
        />
      </section>

      <section>
        <p className="text-ink text-[15px] font-semibold">
          {t("tasteLabel")}
          <span className="text-ink-faint ml-2 text-[13px] font-normal">
            {t("tasteHint")}
          </span>
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {DESIGN_TASTES.map((taste) => {
            const selected = tastes.includes(taste);
            return (
              <button
                key={taste}
                type="button"
                onClick={() => toggleTaste(taste)}
                aria-pressed={selected}
                className={optionClass(selected)}
              >
                <span className="text-ink block text-[15px] font-semibold">
                  {tTaste(taste)}
                </span>
                <span className="text-ink-soft mt-1 block text-[13px] leading-relaxed">
                  {tTasteDesc(taste)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <label
          htmlFor="prefecture"
          className="text-ink block text-[15px] font-semibold"
        >
          {t("prefectureLabel")}
        </label>
        <select
          id="prefecture"
          value={prefecture}
          onChange={(event) => setPrefecture(event.target.value as Prefecture)}
          className={cn(FIELD_CLASS, "mt-3")}
        >
          <option value="">{t("prefecturePlaceholder")}</option>
          {PREFECTURES.map((code) => (
            <option key={code} value={code}>
              {tPrefecture(code)}
            </option>
          ))}
        </select>
        <p className="text-ink-soft mt-2 text-[13px]">{t("prefectureNote")}</p>
      </section>

      <section>
        <p className="text-ink text-[15px] font-semibold">
          {t("priorityLabel")}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MATCH_PRIORITIES.map((item) => {
            const selected = priority === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setPriority(item)}
                aria-pressed={selected}
                className={optionClass(selected)}
              >
                <span className="text-ink block text-[15px] font-semibold">
                  {tPriority(item)}
                </span>
                <span className="text-ink-soft mt-1 block text-[13px] leading-relaxed">
                  {tPriorityDesc(item)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={submit} disabled={!prefecture}>
          {t("submit")}
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          {t("back")}
        </Button>
      </div>
    </div>
  );
};
