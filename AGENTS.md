<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Tsugumi コーディング規約

このファイルは AI / コードを書く人向けの **規約と設計判断** のみを扱う。プロダクトの仕様は
[docs/kintsugi_design_agent_system_design.md](docs/kintsugi_design_agent_system_design.md)、
起動手順は [README.md](README.md) を参照。

## アーキテクチャ

`slash-mobile-app/api` に揃えた Clean Architecture / DDD 4 層構造を、Next.js App Router に載せている。

```
Route Handler (app/api/**/route.ts)     # 1 行。routeHandler で controller を呼ぶだけ
   ↓
Controller (presentation)               # Zod で wire を検証し、result → response へ整形
   ↓
UseCase (application)                   # orchestration / CustomError への変換
   ↓                                     #   ※ infra を一切 import しない
DomainService (domain/service)          # infra アダプタ(Repository/Gateway)を保有する唯一の層
   ↓
Repository / Gateway (infrastructure)   # Mock 工房 DB(JSON) / AI API アクセス
```

レイヤー間の依存方向は **必ず上から下のみ**。

### 核心ルール（依存方向）

- **UseCase(application) と Controller(presentation) は `@/infrastructure/*` を import してはいけない。**
  infra アダプタ（Repository / Gateway）を保有・呼び出してよいのは **DomainService(domain) だけ**。
- 外部 API 取得の orchestration・部分失敗のフォールバック制御も **UseCase ではなく DomainService** が担う。
- 全層を import してよいのは **`src/container.ts`（composition root）だけ**。NestJS の `*.module.ts` にあたる。

### infra アダプタの 2 系統

| アダプタ | 置き場所 | 役割 | 保有する層 |
|---|---|---|---|
| Repository | `infrastructure/repository/<feature>/` | Mock 工房 DB(JSON) / プロジェクト保存 | DomainService |
| Gateway | `infrastructure/ai/` | 外部 AI API アクセス + raw→domain 変換 | DomainService |

### DomainService は 2 種類に分けてよい

- **infra 保有サービス**（`WorkshopMatcherService` 等）: Repository/Gateway を持ち、取得 orchestration を行う。
- **純粋サービス**（`LogisticsService`）: infra 非依存。送料・修理費・完成目安の計算のみ。**infra import 0** に保つ。

### 設計の原則：4 層を守り、パターンを足さない

- デザインパターン（Strategy / Factory 等）は原則入れない。違いが **値だけ** なら表 / Map / switch で書く。
- メソッドが **空 / `return 定数` だけのクラス**は作らない。それはデータなので `constants/` の表にする。
- 種類が増えるだけなら **データ（カタログ表）で持つ**。コードは増やさない。

### DI

Next.js に DI コンテナは無いので `src/container.ts` で手配線し、Route Handler から import する。
DI トークン（`Symbol`）は使わず、具体クラスを直接 new して inject する。

## 金額の扱い（slash-mobile-app との差分）

参照元 api は金額を `string` + `bignumber.js` で扱うが、**このリポジトリでは円の整数 `number`** で持つ。

- 扱う金額が **円の整数のみ**（小数・トークン小数点なし）で、`Number.MAX_SAFE_INTEGER` から桁が十分離れており、
  float 誤差が構造的に発生しないため。
- 為替換算・小数を含む単価が入ったら、その時点で `string` + `bignumber.js` へ移行する。

## LLM とロジックの境界（設計書 4.4）

| 区分 | 内容 | 実装場所 |
|---|---|---|
| LLM に任せる | デザイン発想、物語の解釈、相性の理由、自然言語の説明 | `infrastructure/ai/*.gateway.ts` |
| コードで計算 | 送料、配送日数、修理期間、合計金額、スコア集計 | `domain/service/logistics`, `domain/service/workshop` |

**LLM にスコアや金額を生成させない。** 計算済みの値を渡して言い換えさせるだけ。

## AI Gateway は現在 MOCK

`infrastructure/ai/` の 3 つの Gateway は、`DEMO_MODE=true`（既定）の間 Mock 応答を返す。
実 API を繋ぐときは各 Gateway の `callXxxModel()` の **中だけ** を書き換える。呼び出し側は無修正で済む。

## 命名

- ファイル: kebab-case（`workshop-matcher.service.ts` / `recommendations.result.ts`）
- ディレクトリ: kebab-case + 単数（`workshop/`）
- クラス: PascalCase。サフィックスで層を明示（`*Controller` / `*UseCase` / `*Service` / `*Repository` / `*Gateway`）
- **UseCase / Controller は feature 名詞でスコープし、多メソッドにする**。action ごとにクラスを割らない
  （`GetWorkshopsUseCase` ではなく `WorkshopUseCase.recommendWorkshops()`）
- フィールド名は略さない（`repo` ではなく `workshopRepository`）

## application 入出力 DTO と response DTO

presentation が domain entity を直接受け取らないよう、**usecase は application result DTO を返し、
presentation はそれを response に変換する**。

- usecase の入力型は `application/dto/<feature>/<x>.input.ts`（インライン interface にしない）
- 出力型は `application/dto/<feature>/<x>.result.ts`
- response への変換は `toXxxResponse(result): XxxResponse` の純関数（クラスにしない）
- 複数 API が共有する wire 形（解析結果・デザイン案）は `presentation/dto/common/` に置く

## エラー

- すべて `src/error/error.config.ts` の `ErrorConfig` に定義する。code は `[1 文字 prefix][4 桁]`
  （`X`=共通 / `A`=analysis / `D`=design / `W`=workshop / `E`=estimate / `P`=project）
- throw は `throw new CustomError(ErrorConfig.XXX_YYY)` の 1 形式のみ
- **Controller / Route Handler で try-catch しない**。`routeHandler` が `ZodError` / `CustomError` /
  想定外を JSON に変換する（NestJS の `CustomErrorFilter` + `ResponseInterceptor` 相当）
- DomainService・Repository・Gateway は `logger.error` して**生エラーを再 throw**。
  UseCase で feature 固有の `CustomError` に wrap する

## ワイヤーフォーマット

- 成功: `{ data: <controller return>, meta: { timestamp } }`
- 失敗: `{ error: { code, message, issues? }, meta: { timestamp } }`

controller は素のレスポンスオブジェクトを返すだけ。`data` / `meta` を自分で組まない。

## ロギング

`@/utils/logger` の `logger.info|warn|error|debug` を使う（`console.log` 禁止）。
メッセージ先頭に発生元のクラス名を `[ClassName]` で付ける。`error` は最後の引数で渡す。

## フロントエンド

- ディレクトリは features-first（`src/features/<feature>/{screens,components,hooks,api,utils}`）
- `export const` アロー関数を使う（`export function` は使わない）。戻り値型は明示する
- default export は `src/app/**/page.tsx` のみ（Next.js の要求）
- `@/` エイリアスを必ず使う（相対パス禁止）。バレルエクスポート（`index.ts`）は使わない
- API 呼び出しは `features/<feature>/api/` の純関数（React 非依存）に置き、画面から直接 `fetch` しない
- クライアント状態は `features/project/store/project-store.ts`（Zustand + sessionStorage）に集約する

## 多言語対応（next-intl）

英語を既定、日本語を第 2 言語とする。URL は必ずロケール接頭辞付き（`/en/...` / `/ja/...`）で、
`/` は `/en` へリダイレクトする。構成は `tokipick/apps/web` に揃えた。

```
src/i18n/routing.ts     # locales / defaultLocale / localePrefix
src/i18n/request.ts     # getRequestConfig（messages の読み込み）
src/i18n/navigation.ts  # Link / useRouter / usePathname（ロケール接頭辞を自動で付ける）
src/proxy.ts            # Next.js 16 で middleware → proxy に改称された
src/messages/{en,ja}.json
```

- **画面遷移は `@/i18n/navigation` の `Link` / `useRouter` を使う**（`next/link` / `next/navigation` を直接使わない）。
  `useSearchParams` だけは next-intl に無いので `next/navigation` から取る。
- **`constants/` に表示用ラベルを置かない**。列挙値・数値表（送料・加算・重み）だけを持ち、
  ラベルは `messages/*.json` に列挙値と同じキーで並べる（`material.ceramic` など）。
- **API のレスポンスは表示文字列ではなくコードで返す**（`prefecture: "TOKYO"`, `zone: "SAME"`）。
  画面側が `t(code)` で開く。例外は工房名・紹介文とデザイン案の文章で、これらは翻訳ではなく
  「言語ごとの原稿」なので、サーバー側で 1 言語ぶんを選んで返す。
- **工房を選ぶ理由・注意点はコード + パラメータ**（`domain/entity/workshop/match-note.ts`）。
  ドメインは表示言語を知らない。文へ開くのは `features/workshop/hooks/useMatchNoteText.ts`。
- **AI が書く文章は locale をリクエストに載せて渡す**。実 API ではプロンプトの言語指定にあたる。
  Mock の語彙は `infrastructure/ai/mock/labels.ts`（`messages/*.json` とは別に持つ。
  実 API に差し替えた時点で丸ごと不要になるため）。
- 金額の表記は `features/common/utils/format.ts` の `formatMoney(value, locale)`
  （ja は「1,000円」、en は「¥1,000」）。日数は ICU の複数形で messages 側に置く。

## デザイン

`docs/design/` の「Tsugumi Design Flow」が唯一の出典。

- 色は **oklch のまま** `src/app/globals.css` の `@theme` に持つ（近似 hex に置き換えない）
- 欧文は Cormorant Garamond（見出し）/ Work Sans（本文）を `public/fonts/` から自己ホストする。
  和文はシステムフォントへフォールバックする。`next/font/google` は使わない（ビルド時のネットワーク依存を避けるため）
- ボタンは全てピル型。金＝主行動 / 藍＝標準 / 白抜き＝副次

## やってはいけないこと

- 4 層を崩さない・デザインパターンを安易に入れない
- usecase / controller から `@/infrastructure/*` を import / inject しない（必ず DomainService 経由）
- 外部 API 取得の orchestration を usecase に書かない（DomainService が担う）
- LLM に金額・スコア・日数を生成させない
- usecase を action 単位の 1 メソッドクラスにしない
- usecase の返り値に raw domain entity を使って presentation で変換しない
- controller で `try/catch` で error response を組み立てない
- `console.log` を使わない
- コメントを英語で書かない（日本語に統一。JSDoc も日本語）
- `@/*` 以外の相対パス import（`../../../`）を使わない
- 画面に日本語や英語の文字列をベタ書きしない（`messages/*.json` に置く）
