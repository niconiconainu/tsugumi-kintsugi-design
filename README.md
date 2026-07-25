# Tsugumi — KINTSUGI Design Agent

> 壊れた品の物語から、金継ぎデザインと修復先を提案する

割れた器の写真とその品にまつわる思い出を入力すると、**金継ぎデザイン案 3 件・相性の良い工房・往復送料込みの概算・完成までの期間**を 1 つの流れで提示する Web アプリです。

- 仕様: [docs/kintsugi_design_agent_system_design.md](docs/kintsugi_design_agent_system_design.md)
- コーディング規約 / アーキテクチャ: [AGENTS.md](AGENTS.md)
- デザイン原本: [docs/design/](docs/design/)

## ⚠️ AI エージェント部分は現在 MOCK

Qwen Cloud（画像理解）と GMI Cloud（デザイン生成 / 説明文）への接続は**まだ実装していません**。
`DEMO_MODE=true`（既定）の間、`src/infrastructure/ai/` の Gateway が決定論的な Mock 応答を返し、
UI 上は本番と同じ形で結果が表示されます。画面右上に `AI MOCK` バッジが出ます。

実 API に差し替えるときは、各 Gateway の `callXxxModel()` の**中だけ**を書き換えれば済みます
（呼び出し側は無修正）。

一方で **送料・修理費・総額・完成目安・工房スコアは Mock ではなく実際の計算**です
（`domain/service/logistics` と `domain/service/workshop`）。設計書 4.4 の
「LLM に任せる範囲／コードで計算する範囲」の境界をそのまま実装しています。

## セットアップ

```bash
npm install
cp .env.example .env.local   # 既定の DEMO_MODE=true のままで動きます
npm run dev                  # http://localhost:3000
```

Node.js 20 以上。フォントは `public/fonts/` に同梱しているので、ビルド時に外部ネットワークは不要です。

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド（型チェック込み） |
| `npm start` | ビルド済みアプリの起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## 環境変数

すべてサーバー側でのみ読みます（ブラウザへは露出しません）。項目の説明は [.env.example](.env.example)、
スキーマは `src/config/env.schema.ts` にあります。

| 変数 | 既定 | 用途 |
|---|---|---|
| `DEMO_MODE` | `true` | `true` の間、AI Gateway が Mock 応答を返す |
| `QWEN_*` | — | Qwen Cloud（画像理解）。`DEMO_MODE=false` のときのみ必要 |
| `GMI_*` | — | GMI Cloud（デザイン / 比較 / 説明文）。同上 |

## 対応言語

英語（既定）と日本語。URL にロケールを含む形で、`/` は `/en` へリダイレクトする。
ヘッダーの切り替えは同じ画面のまま言語だけ差し替える。

| URL | 言語 |
|---|---|
| `/en`, `/en/story`, … | English |
| `/ja`, `/ja/story`, … | 日本語 |

AI が書く文章（デザイン案・工房の説明文・まとめ）も選んだ言語で生成されます。
金額・日数・スコアはコード側の計算なので言語によって変わりません。

## 画面の流れ

```
/{locale}            写真をアップロード（ランディング兼用）
/{locale}/story      思い出・希望テイスト・都道府県・優先条件を入力
/{locale}/analyzing  解析 → デザイン生成を段階表示
/{locale}/designs    金継ぎデザイン 3 案（写真に継ぎ線を重ねたプレビュー付き）
/{locale}/workshops  工房 3 件を比較。優先条件を切り替えると順位が入れ替わる
/{locale}/result     まとめ・共有 URL
```

## API

| Method | Endpoint | 責務 |
|---|---|---|
| POST | `/api/analyze` | 画像を解析し、素材・色・破損状態を構造化 JSON にする |
| POST | `/api/designs` | 解析結果とストーリーからデザイン案を 3 件生成する |
| POST | `/api/recommendations` | 工房をスコアリングし、優先条件の順に並べる |
| POST | `/api/estimate` | 指定工房の往復送料・修理費・総額・完成目安を計算する |
| POST | `/api/projects` | 結果を保存し、共有用の id を返す |
| GET | `/api/projects/[id]` | 保存済みプロジェクトを取得する |

レスポンスは成功 `{ data, meta }` / 失敗 `{ error: { code, message, issues? }, meta }` で統一しています。

## アーキテクチャ

Clean Architecture / DDD の 4 層を Next.js App Router に載せています。詳細は [AGENTS.md](AGENTS.md)。

```
src/
├── app/                  # App Router。画面と Route Handler（Route Handler は 1 行）
├── presentation/         # Controller + request/response DTO + routeHandler
├── application/          # UseCase + input/result DTO
├── domain/               # Entity / DomainService（純粋サービスと infra 保有サービス）
├── infrastructure/       # Repository（Mock 工房 DB）/ AI Gateway（現在 MOCK）
├── features/             # 画面側。features-first（screens / components / hooks / api）
├── i18n/                 # next-intl の routing / request / navigation
├── messages/             # en.json / ja.json（画面の文言）
├── proxy.ts              # ロケール解決（Next.js 16 では middleware → proxy）
├── constants/            # 送料表・破損度加算・スコア重みなどのカタログ
├── config/ error/ utils/
├── data/workshops.json   # Mock 工房データ（架空）
└── container.ts          # DI 合成点。全層を import してよい唯一のファイル
```

## 既知の制約

- プロジェクトの保存（`/api/projects`）は**プロセス内メモリ**のみ。サーバー再起動や別インスタンスでは
  共有 URL が解決できません。永続化する場合は `ProjectRepository` の中だけを差し替えます。
- 写真はサーバーに保存しません。共有 URL から開いた場合は継ぎ線のプレビューのみが表示されます。
- 継ぎ線プレビューは画像生成ではなく、破損の本数と線のスタイルからコードで描いた SVG の見立てです。

## 免責

AI によるデザインと費用・期間は参考情報です。実際の修理可否、食品利用の安全性、料金、納期は工房による
現物確認後に確定します。掲載している工房は**デモ用の架空データ**であり、実在の事業者ではありません。
