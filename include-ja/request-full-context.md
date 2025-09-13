Wallarmによって不正リクエストが検知され、[**Attacks**][link-attacks]または[**Incidents**][link-incidents]セクションで攻撃の一部として表示されると、そのリクエストの完全なコンテキストを把握できます。どのユーザーセッションに属しているか、またそのセッション内のリクエストの完全なシーケンスを確認できます。これにより、脅威アクターのすべての活動を調査して、攻撃ベクターや侵害され得るリソースを理解できます。

この分析を行うには、Wallarm Console→**Attacks**または**Incidents**で該当の攻撃を開き、続いて対象のリクエスト詳細を表示します。リクエスト詳細で**Explore in API Sessions**をクリックします。Wallarmはフィルターが適用された[**API Session**][link-sessions]セクションを開きます。当該リクエストが属するセッションが表示され、このセッション内では当該リクエストのみが表示されます。

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(58.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/psopwjk9vfas?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Request IDによるフィルターを解除すると、セッション内の他のすべてのリクエストを確認できます。これで、不正リクエストが属していたセッション内で何が起きていたのかの全体像を把握できます。