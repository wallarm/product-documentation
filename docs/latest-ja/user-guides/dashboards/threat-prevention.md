# Threat Preventionダッシュボード

指定期間の悪意のあるトラフィックの特性を**Threat Prevention**ダッシュボードで確認します。攻撃タイプ、ソース、プロトコル、認証方式などによる分布と悪意のあるトラフィック量を明確に把握できます。

このダッシュボードは脅威パターンの特定に役立ちます。攻撃者がどのようにシステムを悪用しようとしているかを明確に把握することで、脅威の迅速な検知とより的確な対応が可能になります。これは全体的なセキュリティ体制の向上に寄与し、プロアクティブな対策の実施に役立ちます。

攻撃タイプ（例：DDoS、SQLインジェクション、ブルートフォース）やプロトコル（例：HTTP、HTTPS、FTP）によっては必要な防御戦略が異なるため、攻撃手法やトラフィックの分布を把握することで、セキュリティチームはレート制限、ファイアウォールルール、WAAPの設定などの特定の対策を実装し、さらなるインシデントを防止できます。

情報は次のウィジェットで表示されます:

* Speed of request encountering
* Normal and malicious traffic
* Summary for a period
* Attack sources
* Attack targets
* Attack types
* CVEs
* Attacks on API protocols
* Authentication in attacks

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/atbicsvjibs7" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

次の点をご確認ください:

* [Hit](../../glossary-en.md#hit)は、悪意のあるリクエストにノードが付加したメタデータを加えたものです
* 一部のロケーションでは[トラフィックフィルタリングモード](../../admin-en/configure-wallarm-mode.md)が`monitoring`の場合があるため、ブロックされたhitsの数が検出されたhitsより少ない場合があります
* 攻撃タイプの説明は[こちら](../../attacks-vulns-list.md)で参照できます