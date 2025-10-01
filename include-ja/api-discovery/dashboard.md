Wallarmの[**API Discovery**][apid-overview]で収集されたAPIに関するデータは、**API Discovery**ダッシュボードで確認できます。

このダッシュボードは、シャドウAPI、オーファンAPI、ゾンビAPIを含むAPIエンドポイントの全体像を提供します。**リスクスコア評価**の結果を可視化し、最も脆弱または高リスクなAPIを特定してセキュリティ対策の優先順位付けを支援します。

APIは時間の経過とともに進化し、新しいエンドポイントが追加され、古いものは非推奨になります。このダッシュボードはこれらの変更の可視性を提供し、非推奨APIが適切に退役し、新規または変更されたAPIがセキュリティポリシーや標準に準拠していることを確実にします。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/e1bl1st5rxkv" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

次の点をご確認ください：

* APIエンドポイントがどの程度リスクにさらされているかは[リスクスコア][apid-risk-score]で示されます
* APIの[変更][apid-track-changes]に注意してください（過去7日間が表示されます）
* [ローグAPI][apid-rogue]は重大なリスク要因です - 実際のトラフィックと比較するために仕様書をアップロードしてください