/**
 * 金継ぎが成り立たない写真だったときの判定結果。
 *
 * 通信失敗などの「異常」ではなくユーザーへ返す答えなので、Mock へフォールバックせず
 * そのまま上まで運ぶ。文面は Vision が表示言語で書いたものをそのまま使う。
 */
export class ImageRejectedError extends Error {
  constructor(readonly userMessage: string) {
    super(`Image rejected: ${userMessage}`);
    this.name = "ImageRejectedError";
  }
}
