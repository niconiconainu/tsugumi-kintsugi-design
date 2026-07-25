/**
 * 復元画像を作るために、写真から読み取った特徴。
 *
 * 画像編集モデルへ「同じ器のまま直せ」と指示するための材料であり、
 * 見積計算には使わない。長さの上限は Vision 側のプロンプトで課している
 * （画像編集モデルのプロンプト長を超えると、末尾の禁止事項が落ちるため）。
 */
export class RestorationBrief {
  constructor(
    /** 割れ・欠けがどこをどう走っているか */
    readonly damageDescription: string,
    /** 釉薬・文様・形など、同じ器に見せるための特徴 */
    readonly designDescription: string,
    /** 画角・トリミング・背景 */
    readonly framing: string
  ) {}

  /** 画像編集に必要な記述が揃っているか。欠けていると別の器が生成されやすい。 */
  get isUsable(): boolean {
    return (
      this.damageDescription.length > 0 && this.designDescription.length > 0
    );
  }
}
