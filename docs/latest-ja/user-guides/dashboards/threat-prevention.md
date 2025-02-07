# 脅威防止ダッシュボード

**脅威防止**ダッシュボードを使用して、特定期間中の悪質なトラフィックの特徴を確認できます。攻撃タイプ、送信元、プロトコル、認証方法などで悪質なトラフィック量とその分布を明確に把握できます。

本ダッシュボードは、脅威パターンの識別に役立ちます。攻撃者がどのようにシステムを狙っているかを明確に把握できるため、脅威の迅速な検知と十分な対応が可能になり、全体的なセキュリティ体制の向上およびプロアクティブな措置の実施に寄与します。

攻撃タイプ（例：DDoS、SQLインジェクション、ブルートフォース）やプロトコル（例：HTTP、HTTPS、FTP）により異なる防御戦略が必要なため、攻撃手法およびトラフィックの分布を把握することで、セキュリティチームはさらなるインシデントを防止するために、レート制限、ファイアウォールルール、WAAP構成などの特定の対策を実装できます。

情報は以下のウィジェットで表示されます：

* リクエスト遭遇速度
* 正常トラフィックと悪質トラフィック
* 期間ごとの概要
* 攻撃送信元
* 攻撃対象
* 攻撃タイプ
* CVE
* APIプロトコルへの攻撃
* 攻撃時の認証方法
* 脆弱性スキャナー

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/atbicsvjibs7" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

以下を考慮してください：

* [Hit](../../glossary-en.md#hit)は、悪質なリクエストにノードが追加したメタデータです
* ブロックされたHitの数は、[traffic filtration mode](../../admin-en/configure-wallarm-mode.md)が一部ロケーションで単に`monitoring`の場合、検知された数より少なくなる場合があります
* 攻撃タイプの説明は[こちら](../../attacks-vulns-list.md)で読めます