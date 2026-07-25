"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DESIGN_TASTES,
  DESIGN_TASTE_DESCRIPTION,
  DESIGN_TASTE_LABEL,
  type DesignTaste,
} from "@/constants/design/taste";
import {
  MATCH_PRIORITIES,
  MATCH_PRIORITY_DESCRIPTION,
  MATCH_PRIORITY_LABEL,
  type MatchPriority,
} from "@/constants/project/priority";
import {
  PREFECTURES,
  PREFECTURE_CATALOG,
  type Prefecture,
} from "@/constants/region/prefecture";
import { Button } from "@/features/common/components/ui/Button";
import { cn } from "@/features/common/utils/cn";
import { useProjectStore } from "@/features/project/store/project-store";

const STORY_PLACEHOLDER =
  "例）祖母から受け継いだ青い茶碗です。毎朝これでお茶を飲んでいた姿を覚えています。思い出は残しつつ、派手すぎない桜の枝のような線にできたら。";

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
          思い出・残したい意味
          <span className="text-ink-faint ml-2 text-[13px] font-normal">
            任意
          </span>
        </label>
        <textarea
          id="story"
          value={story}
          onChange={(event) => setStory(event.target.value)}
          rows={6}
          maxLength={2000}
          placeholder={STORY_PLACEHOLDER}
          className={cn(FIELD_CLASS, "mt-3 leading-[1.8]")}
        />
      </section>

      <section>
        <p className="text-ink text-[15px] font-semibold">
          希望のテイスト
          <span className="text-ink-faint ml-2 text-[13px] font-normal">
            複数可・任意
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
                  {DESIGN_TASTE_LABEL[taste]}
                </span>
                <span className="text-ink-soft mt-1 block text-[13px] leading-relaxed">
                  {DESIGN_TASTE_DESCRIPTION[taste]}
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
          お住まいの都道府県
        </label>
        <select
          id="prefecture"
          value={prefecture}
          onChange={(event) => setPrefecture(event.target.value as Prefecture)}
          className={cn(FIELD_CLASS, "mt-3")}
        >
          <option value="">選択してください</option>
          {PREFECTURES.map((code) => (
            <option key={code} value={code}>
              {PREFECTURE_CATALOG[code].label}
            </option>
          ))}
        </select>
        <p className="text-ink-soft mt-2 text-[13px]">
          往復送料と配送日数の概算にのみ使用します。市区町村以降は受け取りません。
        </p>
      </section>

      <section>
        <p className="text-ink text-[15px] font-semibold">優先したいこと</p>
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
                  {MATCH_PRIORITY_LABEL[item]}
                </span>
                <span className="text-ink-soft mt-1 block text-[13px] leading-relaxed">
                  {MATCH_PRIORITY_DESCRIPTION[item]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={submit} disabled={!prefecture}>
          AI に相談する →
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          写真を選び直す
        </Button>
      </div>
    </div>
  );
};
