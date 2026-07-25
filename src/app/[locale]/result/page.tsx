import { Suspense } from "react";
import { ResultScreen } from "@/features/result/screens/ResultScreen";

const Page = (): React.JSX.Element => (
  // useSearchParams（共有 URL の ?id=）を使うため Suspense で囲う。
  <Suspense
    fallback={
      <p className="text-ink-soft mx-auto max-w-3xl px-6 py-24 text-[15px]">
        読み込んでいます…
      </p>
    }
  >
    <ResultScreen />
  </Suspense>
);

export default Page;
