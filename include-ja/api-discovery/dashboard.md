Review data about your API collected by the Wallarmの[**API Discovery**][apid-overview]を**API Discovery**ダッシュボードで確認してください。

このダッシュボードでは、シャドウ、オーファン、およびゾンビAPIを含む、あなたのAPIエンドポイントの全体像が提供されます。また、最も脆弱または高リスクのAPIを特定することでセキュリティ対策の優先順位付けに役立つ**risk score assessment**の結果を可視化します。

APIは時間とともに進化し、新しいエンドポイントが追加され、古いエンドポイントは非推奨となります。このダッシュボードはこれらの変更状況を把握できるようにし、非推奨のAPIが適切に廃止されるとともに、新規または変更されたAPIがセキュリティポリシーおよび標準に準拠していることを保証します。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/e1bl1st5rxkv" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

次の点にご留意ください:

* あなたのAPIエンドポイントのリスク度合いは[risk score][apid-risk-score]で示されています
* あなたのAPIの[changes][apid-track-changes]にご留意ください（直近7日間で表示）
* [Rogue API][apid-rogue]は重大なリスク要因です。仕様書をアップロードして実際のトラフィックと比較してください