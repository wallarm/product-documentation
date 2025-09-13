# API Sessionsの概要 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmの**API Sessions**は、トラフィック内のユーザーセッションの可視性を提供します。各セッションについて、Wallarmは詳細なリクエストおよび関連するレスポンスデータを収集し、セッション内のアクティビティを構造化して表示できるようにします。本記事では、API Sessionsの概要として、その目的、解決する課題、および主な機能について説明します。

API Sessionsを使用するには[NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0または[native Wallarm node](../installation/nginx-native-node-internals.md#native-node) 0.8.0が必要です。レスポンスのパースにはNGINX Wallarm node 5.3.0またはnative node 0.12.0が必要です。

![!API Sessionsセクション - 監視対象のセッション](../images/api-sessions/api-sessions.png)

## 対応する課題

API Sessionsが対処する主な課題は、Wallarmが検出した個々の攻撃だけを見ても完全なコンテキストが得られないことです。各セッション内のリクエストとレスポンスの論理的なシーケンスを捕捉することで、API Sessionsはより広範な攻撃パターンへの洞察を提供し、セキュリティ対策がビジネスロジックのどの領域に影響するかを特定するのに役立ちます。

**WallarmによりAPIセッションが正確に識別されることで、次のことが可能になります**:

* API Abuse Preventionによるボット検出を[より高精度に](#api-sessions-and-api-abuse-prevention)します。

**WallarmによりAPI Sessionsが監視されていることで、次のことができます**:

* [ユーザーアクティビティを追跡](exploring.md#full-context-of-threat-actor-activities)し、単一セッションで行われたリクエストの一覧を表示して、対応するレスポンスのパラメータも確認できるようにすることで、通常とは異なる行動パターンや典型的な使用からの逸脱を特定できます。
* 特定の[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)を調整したり、[virtual patch](../user-guides/rules/vpatch-rule.md)を適用したり、[rules](../user-guides/rules/rules.md)を追加したり、[API Abuse Prevention](../api-abuse-prevention/overview.md)のコントロールを有効化したりする前に、どのAPIフロー/ビジネスロジックのシーケンスが影響を受けるかを把握できます。
* [ユーザーセッションでリクエストされたエンドポイントを調査](exploring.md)し、その保護状況、リスクレベル、[shadowまたはzombie](../api-discovery/rogue-api.md)であるなどの検出済みの問題を迅速に評価できます。
* [パフォーマンスの問題](exploring.md#identifying-performance-issues)やボトルネックを特定し、ユーザー体験を最適化できます。
* 悪意のあるボット活動としてフラグ付けされたリクエストの全シーケンスと対応するレスポンスを併せて確認することで、[API不正検出の精度を検証](exploring.md#verifying-api-abuse-detection-accuracy)できます。

## API Sessionsの仕組み

Wallarm nodeが保護対象として有効になっているすべてのトラフィックはセッションに編成され、**API Sessions**セクションに表示されます。

アプリケーションのロジックに基づいて、リクエストをどのようにセッションへグループ化するかをカスタマイズできます。また、セッション内に表示するリクエストおよび対応するレスポンスのどのパラメータを表示するかも指定でき、セッションの内容（ユーザーが何をどの順序で行ったか）を理解しやすくできます。詳細は[API Sessionsの設定](setup.md)を参照してください。

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4awxsghrjc8u?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

なお、Wallarmはセッションを**直近1週間のみ**保存および表示します。パフォーマンスとリソース消費を最適化するため、これより古いセッションは削除されます。

## API SessionsとAPI Abuse Prevention

Wallarmの[API Abuse Prevention](../api-abuse-prevention/overview.md)は、1つまたは複数の関連するセッション内のリクエストシーケンスを解析して悪意あるボットを検出します。例えば、`SESSION-ID`ヘッダーの値が同一で、時間/日付だけで区切られているセッション同士です。

したがって、アプリケーション固有のロジックに合わせて[リクエストのグループ化方法](setup.md#session-grouping)をカスタマイズすると、API Abuse Preventionの動作に影響し、セッションの識別とボット検出の両方がより正確になります。

## API SessionsにおけるGraphQLリクエスト

API Sessionsは、[GraphQLリクエスト](../user-guides/rules/request-processing.md#gql)とその特有のリクエストポイントに対応しており、セッションの設定でGraphQLリクエストパラメータの値を抽出・表示するように構成できます。

![!API Sessionsの設定 - GraphQLリクエストパラメータ](../images/api-sessions/api-sessions-graphql.png)

NGINX Node 5.3.0以上またはnative node 0.12.0が必要です。