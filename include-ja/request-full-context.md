Wallarmによって悪質なリクエストが検出され、攻撃の一部として[**Attacks**][link-attacks]または[**Incidents**][link-incidents]セクションに表示されると、そのリクエストの完全なコンテキストを把握することができます。具体的には、どのユーザーセッションに属しているか、およびそのセッション内のリクエストの完全なシーケンスが何であるかを追跡できます。これにより、脅威アクターのすべてのアクティビティを調査し、攻撃ベクトルや侵害される可能性のあるリソースを把握することができます。

この分析を実施するには、Wallarm Console → **Attacks**または**Incidents**で攻撃にアクセスし、特定のリクエスト詳細を表示してください。リクエスト詳細内で**Explore in API Sessions**をクリックしてください。Wallarmは、セッションのフィルタが適用された[**API Session**][link-sessions]セクションを開き、初期リクエストが属するセッションが表示され、このセッション内では初期リクエストのみが表示されます。

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(58.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/psopwjk9vfas?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

リクエストIDによるフィルタを解除することで、セッション内の他のすべてのリクエストを表示できます。これにより、悪質なリクエストが属するセッション内で何が起こっていたのかを完全に把握することができます。