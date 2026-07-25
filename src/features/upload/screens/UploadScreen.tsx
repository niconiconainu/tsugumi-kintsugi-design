"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/features/common/components/ui/Button";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";
import { useProjectStore } from "@/features/project/store/project-store";
import { PhotoDropzone } from "@/features/upload/components/PhotoDropzone";

const HOW_IT_WORKS = [
  {
    no: "01",
    title: "写真を送る",
    body: "捨てられずにいる、割れたり欠けたりした器の写真を 1 枚。",
  },
  {
    no: "02",
    title: "継ぎ方を見る",
    body: "思い出をふまえた金継ぎのデザイン案を 3 つ、線まで描いて示します。",
  },
  {
    no: "03",
    title: "工房と出会う",
    body: "相性・価格・納期で比べて、任せられる工房までつなぎます。",
  },
];

export const UploadScreen = (): React.JSX.Element => {
  const router = useRouter();
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const setPhoto = useProjectStore((state) => state.setPhoto);

  return (
    <>
      {/* ヒーロー */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="animate-rise grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel align="left">The art of golden repair</SectionLabel>
            <h1 className="font-display text-ink mt-5 text-[40px] leading-[1.18] font-medium sm:text-[52px]">
              大切な器に、
              <br />
              金でもう一度の生を。
            </h1>
            <p className="text-ink-muted mt-7 max-w-[460px] text-[19px] leading-relaxed">
              壊れてしまった品の写真と思い出をお預かりします。金継ぎで生まれ変わった姿を示し、
              それを実現できる工房と、往復送料込みの概算・完成までの目安までまとめてお届けします。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#upload">
                <Button size="lg">写真をアップロードする →</Button>
              </a>
              <a
                href="#what-is-kintsugi"
                className="text-ink-muted hover:text-ink text-[15px] font-medium underline underline-offset-4"
              >
                金継ぎとは
              </a>
            </div>
          </div>

          <div className="bg-hatch border-line-warm flex h-[420px] items-center justify-center rounded-md border">
            <span className="text-gold-deep px-8 text-center text-[12px] font-medium tracking-[0.05em] uppercase">
              hero photo: repaired kintsugi bowl
            </span>
          </div>
        </div>

        <div className="mt-24 grid gap-10 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.no} className="mx-auto max-w-[300px] text-center">
              <p className="font-display text-gold text-[42px] font-medium">
                {step.no}
              </p>
              <p className="text-ink mt-2 text-[18px] font-semibold">
                {step.title}
              </p>
              <p className="text-ink-soft mt-2.5 text-[15px] leading-relaxed">
                {step.body}
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
          <SectionLabel>What is Kintsugi</SectionLabel>
          <h2 className="font-display text-ink mt-3 text-center text-[40px] font-medium">
            割れた跡を、景色として。
          </h2>
          <div className="mx-auto mt-11 flex max-w-[1100px] flex-col items-center gap-14 lg:flex-row">
            <div className="bg-hatch border-line-warm flex h-[340px] w-full flex-1 items-center justify-center rounded-md border">
              <span className="text-gold-deep px-6 text-center text-[12px] font-medium tracking-[0.05em] uppercase">
                photo: kintsugi bowl detail, gold seams
              </span>
            </div>
            <div className="flex-1">
              <p className="text-ink-muted text-[17px] leading-[1.8]">
                金継ぎは、割れた器を漆で接ぎ、継ぎ目に金粉を蒔いて仕上げる日本の手仕事です。
                破損を隠すのではなく、その器が経てきた時間の一部として残します。
              </p>
              <p className="text-ink-muted mt-5 text-[17px] leading-[1.8]">
                欠けや傷を含めて美しいとする
                <em>侘び寂び</em>
                の考え方に連なるもの。Tsugumi
                は、その技を受け継ぐ工房へ、あなたの器をつなぎます。
              </p>
              <a href="#upload" className="mt-8 inline-block">
                <Button>はじめる</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* アップロード */}
      <section id="upload" className="bg-shell py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel>Step 1 · Upload</SectionLabel>
          <h2 className="font-display text-ink mt-3 text-center text-[38px] font-medium">
            直したい器を見せてください。
          </h2>
          <p className="text-ink-soft mt-3 mb-11 text-center text-[16px]">
            明るい場所で撮った写真がいちばん読み取れます。写真はサーバーに保存しません。
          </p>

          <PhotoDropzone imageDataUrl={imageDataUrl} onSelect={setPhoto} />

          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/story")}
              disabled={!imageDataUrl}
            >
              物語を書く →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
