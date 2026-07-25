"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/features/common/components/ui/Button";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";
import { useProjectStore } from "@/features/project/store/project-store";
import { PhotoDropzone } from "@/features/upload/components/PhotoDropzone";
import { ArtifactSelector } from "@/features/upload/components/ArtifactSelector";
import { useRouter } from "@/i18n/navigation";

const HOW_STEPS = [
  { no: "01", titleKey: "how.step1Title", bodyKey: "how.step1Body" },
  { no: "02", titleKey: "how.step2Title", bodyKey: "how.step2Body" },
  { no: "03", titleKey: "how.step3Title", bodyKey: "how.step3Body" },
] as const;

export const UploadScreen = (): React.JSX.Element => {
  const router = useRouter();
  const t = useTranslations("landing");
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const artifactType = useProjectStore((state) => state.artifactType);
  const material = useProjectStore((state) => state.material);
  const setPhoto = useProjectStore((state) => state.setPhoto);
  const setArtifact = useProjectStore((state) => state.setArtifact);

  return (
    <>
      {/* ヒーロー */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="animate-rise grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel align="left">{t("eyebrow")}</SectionLabel>
            <h1 className="font-display text-ink mt-5 text-[40px] leading-[1.18] font-medium sm:text-[52px]">
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h1>
            <p className="text-ink-muted mt-7 max-w-[480px] text-[19px] leading-relaxed">
              {t("lead")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#upload">
                <Button size="lg">{t("ctaUpload")}</Button>
              </a>
              <a
                href="#what-is-kintsugi"
                className="text-ink-muted hover:text-ink text-[15px] font-medium underline underline-offset-4"
              >
                {t("ctaLearn")}
              </a>
            </div>
          </div>

          <div className="bg-hatch border-line-warm flex h-[420px] items-center justify-center rounded-md border">
            <span className="text-gold-deep px-8 text-center text-[12px] font-medium tracking-[0.05em] uppercase">
              {t("heroPlaceholder")}
            </span>
          </div>
        </div>

        <div className="mt-24 grid gap-10 sm:grid-cols-3">
          {HOW_STEPS.map((step) => (
            <div key={step.no} className="mx-auto max-w-[300px] text-center">
              <p className="font-display text-gold text-[42px] font-medium">
                {step.no}
              </p>
              <p className="text-ink mt-2 text-[18px] font-semibold">
                {t(step.titleKey)}
              </p>
              <p className="text-ink-soft mt-2.5 text-[15px] leading-relaxed">
                {t(step.bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 金継ぎとは */}
      <section
        id="what-is-kintsugi"
        className="border-line border-y py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel>{t("kintsugi.label")}</SectionLabel>
          <h2 className="font-display text-ink mt-3 text-center text-[40px] font-medium">
            {t("kintsugi.title")}
          </h2>
          <div className="mx-auto mt-11 flex max-w-[1100px] flex-col items-center gap-14 lg:flex-row">
            <div className="bg-hatch border-line-warm flex h-[340px] w-full flex-1 items-center justify-center rounded-md border">
              <span className="text-gold-deep px-6 text-center text-[12px] font-medium tracking-[0.05em] uppercase">
                {t("kintsugi.photoPlaceholder")}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-ink-muted text-[17px] leading-[1.8]">
                {t("kintsugi.body1")}
              </p>
              <p className="text-ink-muted mt-5 text-[17px] leading-[1.8]">
                {t.rich("kintsugi.body2", {
                  em: (chunks) => <em>{chunks}</em>,
                })}
              </p>
              <a href="#upload" className="mt-8 inline-block">
                <Button>{t("kintsugi.cta")}</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* アップロード */}
      <section id="upload" className="bg-shell py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel>{t("upload.label")}</SectionLabel>
          <h2 className="font-display text-ink mt-3 text-center text-[38px] font-medium">
            {t("upload.title")}
          </h2>
          <p className="text-ink-soft mt-3 mb-11 text-center text-[16px]">
            {t("upload.lead")}
          </p>

          <PhotoDropzone imageDataUrl={imageDataUrl} onSelect={setPhoto} />

          <ArtifactSelector
            artifactType={artifactType}
            material={material}
            onChange={setArtifact}
          />

          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/story")}
              disabled={!imageDataUrl}
            >
              {t("upload.cta")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
