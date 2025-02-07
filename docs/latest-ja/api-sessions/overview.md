# APIセッション概要 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmの**APIセッション**はトラフィック内のユーザーセッションに対する可視性を提供します。各セッションにおいて、Wallarmは詳細なリクエストおよび関連するレスポンスデータを収集し、セッション活動の体系的な把握を可能にします。本記事では、APIセッションの概要、解決される課題、その目的および主な機能について説明します。

APIセッションを利用するには[NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0または[native Wallarm node](../installation/nginx-native-node-internals.md#native-node) 0.8.0が必要です。レスポンス解析はNGINX Wallarm node 5.3.0でサポートされており、現時点ではnative nodeではサポートされておりません。

![!APIセッションセクション - 監視されたセッション](../images/api-sessions/api-sessions.png)

## 解決される課題

APIセッションが解決する主要な課題は、Wallarmで検出された個々の攻撃のみを確認する場合に完全なコンテキストが欠如している点です。各セッション内のリクエストとレスポンスの論理的な順序をキャプチャすることで、APIセッションはより広範な攻撃パターンへの洞察を提供し、セキュリティ対策によって影響を受けるビジネスロジックの領域を特定するのに役立ちます。

**Wallarmにより正確に識別されたAPIセッションがあるため、これにより**:

* API Abuse Preventionによるボット検出が[より正確になります](#api-sessions-and-api-abuse-prevention)。

**Wallarmによって監視されたAPIセッションを利用することで、以下が可能になります**:

* [ユーザー活動を追跡](exploring.md#full-context-of-threat-actor-activities)できます。1つのセッション内で行われたリクエスト一覧を表示し、対応するレスポンスのパラメータを確認できるため、異常な挙動や通常とは異なるパターンを識別できます。
* 特定の[false positive](../about-wallarm/protecting-against-attacks.md#false-positives)の調整、[virtual patch](../user-guides/rules/vpatch-rule.md)の適用、[rules](../user-guides/rules/rules.md)の追加、または[API Abuse Prevention](../api-abuse-prevention/overview.md)コントロールの有効化の前に、どのAPIフロー/ビジネスロジックシーケンスが影響を受けるかを把握できます。
* [ユーザーセッションでリクエストされたエンドポイントを確認](exploring.md)することで、その保護状況、リスクレベルおよび[shadowまたはzombie](../api-discovery/rogue-api.md)といった検出された問題を迅速に評価できます。
* [パフォーマンスの問題](exploring.md#identifying-performance-issues)やボトルネックを特定して、ユーザー体験の最適化が可能です。
* 悪意のあるボット活動としてフラグ付けされたリクエストの全シーケンスと対応するレスポンスを確認することで、[API abuse検出の精度](exploring.md#verifying-api-abuse-detection-accuracy)を検証できます。

## APIセッションの仕組み

Wallarm nodeにより保護されるすべてのトラフィックはセッションに整理され、**APIセッション**セクションに表示されます。

アプリケーションのロジックに基づいてリクエストをセッションにどのようにグループ化するかをカスタマイズできます。また、リクエストおよび対応するレスポンスのどのパラメータをセッション内に表示するかを指定して、ユーザーが何をどの順序で実行したか（コンテキストパラメータ）を理解するための助けになります。詳細は[APIセッションセットアップ](setup.md)をご参照ください。

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4awxsghrjc8u?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarmはセッションを**過去1週間分のみ**保存および表示します。最適なパフォーマンスとリソース使用率を確保するため、以前のセッションは削除されます。

## APIセッションとAPI Abuse Prevention

Wallarmの[API Abuse Prevention](../api-abuse-prevention/overview.md)は、例えば`SESSION-ID`ヘッダーが同一で時間／日付によってのみ分割されたセッションなど、1つまたは複数の関連セッション内のリクエストシーケンスを分析し、悪質なボットを検出します。

したがって、特定のアプリケーションロジックに従い[リクエストがセッションにグループ化される方法](setup.md#session-grouping)をカスタマイズすると、API Abuse Preventionの動作に影響を与え、セッションの識別とボット検出のいずれもより正確になります。

## APIセッションにおけるGraphQLリクエスト

APIセッションは[GraphQLリクエスト](../user-guides/rules/request-processing.md#gql)およびその特定のリクエストポイントへの対応をサポートしており、GraphQLリクエストパラメータの値を抽出して表示するようにセッションを設定できます。

![!APIセッションの構成 - GraphQLリクエストパラメータ](../images/api-sessions/api-sessions-graphql.png)

NGINX Node 5.3.0以降を必要とし、現時点ではNative Nodeではサポートされておりません。