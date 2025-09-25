[rule-creation-options]:    ../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# 攻撃検知の手順

WallarmプラットフォームはAPIトラフィックを継続的に分析し、不正リクエストをリアルタイムで緩和します。本記事では、Wallarmが攻撃から保護するリソースの種類、トラフィック中の攻撃検知方法、および検知された脅威の追跡と管理方法を説明します。

## Attackとは何か、その構成要素は何か?

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.18% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/pmaofaxiwniz?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

<a name="attack"></a>**Attack**とは、以下の特性でグループ化された1つのHitまたは複数のHitsです:

* 同一の攻撃タイプ、悪意のあるペイロードを含むパラメータ、そしてHitが送信されたアドレスが同じであること。Hitは同一または異なるIPアドレスから到来してもよく、同一攻撃タイプの範囲で悪意のあるペイロードの値が異なる場合があります。新しいHitは最後のHitから1時間以内に到着したもののみ同一Attackにまとめられます。1時間を超える場合は別のAttackとして記録されます。

    このHitのグルーピング方法は基本で、すべてのHitに適用されます。

* [source IPによるHitのグルーピング](../user-guides/events/grouping-sampling.md#grouping-of-hits)が有効な場合は、送信元IPアドレスが同じであること。その他のHitのパラメータ値は異なっていて構いません。

    このグルーピング方法は、Brute force、Forced browsing、BOLA(IDOR)、Resource overlimit、Data bomb、Virtual patchの攻撃タイプを除くすべてのHitに適用されます。

    Hitがこの方法でグループ化されている場合、そのAttackに対しては[**Mark as false positive**](../user-guides/events/check-attack.md#false-positives)ボタンを使用できません。

上記のHitのグルーピング方法は相互に排他的ではありません。両方の条件を満たすHitは、1つのAttackにまとめられます。

<a name="hit"></a>**Hit**とは、シリアライズされた不正リクエスト（元の不正リクエストと、Wallarmノードが付与するメタデータ）です。1つのリクエスト内に異なるタイプの複数の悪意のあるペイロードが検出された場合、Wallarmは、それぞれが1種類のペイロードのみを含む複数のHitとして記録します。

<a name="malicious-payload"></a>**悪意のあるペイロード**とは、元のリクエストのうち次の要素を含む部分です:

* リクエストで検出された攻撃シグネチャ。同一の攻撃タイプを特徴付ける複数の攻撃シグネチャが1つのリクエストで検出された場合は、最初に検出されたシグネチャのみがペイロードに記録されます。
* 攻撃シグネチャのコンテキスト。コンテキストとは、検出された攻撃シグネチャの前後にある文字の集合です。ペイロードの長さには制限があるため、攻撃シグネチャがペイロード全体の長さを占める場合はコンテキストが省略されることがあります。

    攻撃シグネチャは[行動ベースの攻撃](../attacks-vulns-list.md#attack-types)の検知には使用しないため、行動ベースの攻撃の一部として送信されたリクエストのペイロードは空になります。

[Wallarmで攻撃を分析する方法→](../user-guides/events/check-attack.md)

## 保護対象リソースの種類

Wallarmノードは、保護対象リソースに送信されるHTTPおよびWebSocketトラフィックを分析します:

* HTTPトラフィックの分析はデフォルトで有効です。

    WallarmノードはHTTPトラフィックを[入力検証型攻撃](../attacks-vulns-list.md#attack-types)および[行動ベースの攻撃](../attacks-vulns-list.md#attack-types)について分析します。
* WebSocketトラフィックの分析は、ディレクティブ[`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket)で追加設定が必要です。

    WallarmノードはWebSocketトラフィックを[入力検証型攻撃](../attacks-vulns-list.md#attack-types)のみ対象に分析します。

保護対象のAPIは以下の技術を基盤として設計できます（WAAPの[サブスクリプションプラン](subscription-plans.md#core-subscription-plans)により制限があります）:

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

<a name="attack-handling-process"></a>
## 攻撃の処理プロセス

攻撃を検知・処理するために、Wallarmは次のプロセスを使用します:

1. [IP lists](../user-guides/ip-lists/overview.md)を確認し、そもそもリクエストを処理するかどうかを判断します。Denylistはリクエストをブロックし、allowlistは許可します。いずれも以降の解析は行いません。
1. リクエスト形式を判定し、各リクエスト要素を[解析](../user-guides/rules/request-processing.md)して[基本の検出器](#basic-set-of-detectors)を適用します。
1. リクエストの宛先エンドポイントを特定し、[カスタムルール](#custom-rules)/[Mitigation controls](#mitigation-controls)および[特定モジュールの設定](#specific-module-settings)を適用するとともに、[フィルタリングモード](../admin-en/configure-wallarm-mode.md)を把握します。
1. 基本の検出器、カスタムルール、特定モジュールの設定に基づいて、そのリクエストが攻撃の一部かどうかを判定します。
1. 判定結果とフィルタリングモードに従ってリクエストを処理します。

![攻撃処理プロセスの図](../images/about-wallarm-waf/overview/attack-handling-diagram.png)

ルール、Mitigation controls、設定、およびフィルタリングモードは、親エンドポイントまたは[アプリケーション](../user-guides/settings/applications.md)から継承される場合があります。より具体的なものが優先されます。

## 攻撃検知のためのツール

攻撃を検知するために、Wallarmは[攻撃の処理プロセス](#attack-handling-process)に従って保護対象に送信されるすべてのリクエストを次のツールで分析します:

* [基本の検出器](#basic-set-of-detectors)
* [カスタムルール](#custom-rules) / [Mitigation controls](#mitigation-controls)
* [特定モジュールの設定](#specific-module-settings)

<a name="basic-set-of-detectors"></a>
### 基本の検出器

Wallarmは、基本の検出器セット（Wallarmが開発した**libproton**ライブラリ）を用いて、攻撃タイプごとのシグネチャをトークン列として判定します。例: [SQLインジェクション攻撃タイプ](../attacks-vulns-list.md#sql-injection)に対する`union select`。リクエストに検出器のトークン列と一致するトークン列が含まれている場合、そのリクエストは対応するタイプの攻撃と見なされます。

Wallarmは、新しい攻撃タイプおよび既存の攻撃タイプに対して、この検出器（トークン列）のリストを定期的に更新します。

また、WallarmはSQLインジェクション攻撃を追加検証します（Wallarmが開発した**libdetection**ライブラリ）。[管理方法](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection)をご覧ください。

<a name="custom-rules"></a>
### カスタムルール

カスタム[ルール](../user-guides/rules/rules.md)は、基本の検出器で定義される挙動をきめ細かく調整するために使用します。ユーザーはWallarm Consoleでルールを作成し、そのルールセットがフィルタリングノードにアップロードされます。

<a name="mitigation-controls"></a>
### Mitigation controls

Mitigation controlsは、追加のセキュリティ対策によってWallarmの攻撃防御を拡張し、Wallarmの挙動をさらに微調整できるようにします。

<a name="specific-module-settings"></a>
### 特定モジュールの設定

基本の検出器やカスタムルールとの照合に加えて、リクエストは次のような各種保護ツールが提供する設定にも照らしてチェックされます:

* [API Abuse Prevention](../api-abuse-prevention/overview.md)
* [API Specification Enforcement](../api-specification-enforcement/overview.md)
* [Credential Stuffing](../about-wallarm/credential-stuffing.md)
* [Triggerに基づく保護手段](../user-guides/triggers/triggers.md#what-you-can-do-with-triggers)

これらのいずれのツールも、特定の攻撃や脆弱性の検知、ならびにリクエストのブロックを引き起こす場合があります。

## 特定の攻撃タイプを無視する

**Ignore certain attack types**ルールは、特定のリクエスト要素において特定の攻撃タイプの検知を無効化できます。

デフォルトでは、Wallarmノードは任意のリクエスト要素でいずれかの攻撃タイプのシグネチャを検出すると、そのリクエストを攻撃としてマークします。ただし、攻撃シグネチャを含む一部のリクエストが実際には正当な場合もあります（例: データベース管理者フォーラムへの投稿を公開するリクエストの本文に、[悪意のあるSQLコマンド](../attacks-vulns-list.md#sql-injection)の説明が含まれる場合）。

リクエストの標準的なペイロードをWallarmノードが悪意のあるものとしてマークすると、[誤検知](#false-positives)が発生します。誤検知を防ぐには、保護対象APIの特性に合わせて、特定タイプのカスタムルールを用い標準の攻撃検知ルールを調整する必要があります。そのためにWallarmは**Ignore certain attack types**[ルール](../user-guides/rules/rules.md)を提供しています。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Ignore certain attacks**を選択します。
1. **If request is**で、このルールを適用する対象範囲を[記述](../user-guides/rules/rules.md#configuring)します。
1. 特定の攻撃のみのシグネチャを無視するのか（対象を選択）、すべての攻撃のシグネチャを無視するのかを設定します。
1. **In this part of request**で、このルールを設定したいリクエストのポイントを指定します。

    利用可能なポイントは[こちら](../user-guides/rules/request-processing.md)に記載されています。お使いのユースケースに合致するものを選択してください。

1. [ルールのコンパイルが完了する](../user-guides/rules/rules.md#ruleset-lifecycle)まで待ちます。

**ルール例**

たとえば、ユーザーがデータベース管理者フォーラムへの投稿の公開を確認すると、クライアントはエンドポイント`https://example.com/posts/`にPOSTリクエストを送信します。このリクエストには次の特性があります:

* 投稿内容はリクエスト本文のパラメータ`postBody`に渡されます。投稿内容には、Wallarmによって悪意ありとマークされ得るSQLコマンドが含まれる場合があります。
* リクエスト本文のタイプは`application/json`です。

以下は[SQLインジェクション](../attacks-vulns-list.md#sql-injection)を含むcURLリクエストの例です:

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

したがって、`https://example.com/posts/`へのリクエストについて、パラメータ`postBody`内のSQLインジェクションを無視する必要があります。

そのためには、次のスクリーンショットのとおり**Ignore certain attack types**ルールを設定します:

![「Ignore certain attack types」ルールの例](../images/user-guides/rules/ignore-attack-types-rule-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## バイナリデータ内の特定の攻撃シグネチャを無視する

デフォルトでは、Wallarmノードは既知のすべての攻撃シグネチャについて受信リクエストを分析します。この分析の過程で、攻撃シグネチャが通常のバイナリ記号ではないと判断され、バイナリデータ内に誤って悪意のあるペイロードが検出されてしまうことがあります。

**Allow binary data**[ルール](../user-guides/rules/rules.md)を使用すると、バイナリデータを含むリクエスト要素を明示的に指定できます。指定したリクエスト要素を分析する際、Wallarmノードはバイナリデータ内に絶対に含まれない攻撃シグネチャを無視します。

* **Allow binary data**ルールは、バイナリデータ（例: 圧縮ファイルや暗号化ファイル）を含むリクエスト要素に対する攻撃検知の微調整を可能にします。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Binary data processing**を選択します。
1. **If request is**で、このルールを適用する対象範囲を[記述](../user-guides/rules/rules.md#configuring)します。
1. **In this part of request**で、このルールを設定したいリクエストのポイントを指定します。

    利用可能なポイントは[こちら](../user-guides/rules/request-processing.md)に記載されています。お使いのユースケースに合致するものを選択してください。

1. [ルールのコンパイルが完了する](../user-guides/rules/rules.md#ruleset-lifecycle)まで待ちます。

**ルール例**

例えば、ユーザーがサイト上のフォームを使って画像を含むバイナリファイルをアップロードすると、クライアントは`multipart/form-data`タイプのPOSTリクエストを`https://example.com/uploads/`に送信します。バイナリファイルは本文パラメータ`fileContents`に渡されます。これを許可する必要があります。

そのためには、次のスクリーンショットのとおり**Allow binary data**ルールを設定します:

![「Allow binary data」ルールの例](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

<a name="monitoring-and-blocking-attacks"></a>
## 攻撃の監視とブロック

**入力検証型攻撃**

Wallarmは、[入力検証型攻撃](../attacks-vulns-list.md#attack-types)を次のモードで処理できます:

* Monitoring mode: 検知はしますがブロックしません。
* Safe blocking mode: 攻撃を検知し、[graylisted IPs](../user-guides/ip-lists/overview.md)からのもののみブロックします。graylisted IPsから送信された正当なリクエストはブロックされません。
* Blocking mode: 検知し、ブロックします。

各フィルタリングモードの動作、および全体や特定のアプリケーション、ドメイン、エンドポイントに対するフィルタリングモードの設定方法の詳細は[こちら](../admin-en/configure-wallarm-mode.md)をご覧ください。

**行動ベースの攻撃**

Wallarmが[行動ベースの攻撃](../attacks-vulns-list.md#attack-types)をどのように検知し、検知時にどのように振る舞うかは、フィルタリングモードではなく、これらの攻撃タイプの[特定モジュールの設定](#specific-module-settings)によって定義されます。

<a name="false-positives"></a>
## 誤検知

**誤検知**とは、正当なリクエストに攻撃シグネチャが検出された場合、または正当なエンティティが脆弱性と判定された場合に発生します。[脆弱性スキャンにおける誤検知の詳細→](detecting-vulnerabilities.md#false-positives)

攻撃の有無を分析する際、Wallarmは誤検知率が極めて低くAPIを最適に保護する標準ルールセットを使用します。ただし、保護対象APIの特性によっては、標準ルールが正当なリクエストを誤って攻撃と認識する場合があります。例: データベース管理者フォーラムに、悪意のあるSQLクエリの説明を含む投稿を追加するリクエストで、SQLインジェクション攻撃が検知されることがあります。

このような場合は、以下の方法で標準ルールを保護対象APIの特性に合わせて調整します:

* すべての攻撃を[タグ`!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)でフィルタリングして潜在的な誤検知を分析し、誤検知だと確認できたものについては、該当するAttackまたはHitsを適切に[マーク](../user-guides/events/check-attack.md#false-positives)します。Wallarmは、同一のリクエストに対する該当攻撃シグネチャの分析を無効化するルールを自動的に作成します。
* 特定のリクエストで[特定の攻撃タイプの検知を無効化](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)します。
* バイナリデータ内の[特定の攻撃シグネチャの検知を無効化](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)します。
* リクエストに誤って適用されている[パーサーを無効化](../user-guides/rules/request-processing.md#managing-parsers)します。

誤検知の特定と対処は、APIを保護するためのWallarmのチューニングの一部です。最初のWallarmノードはMonitoring[mode](#monitoring-and-blocking-attacks)でデプロイし、検知された攻撃を分析することを推奨します。誤って攻撃と認識されているものがあれば、誤検知としてマークし、フィルタリングノードをBlocking modeに切り替えてください。

## Wallarm UIのAttacks

Wallarmは、検知されたすべての攻撃とその詳細を表示する包括的なユーザーインターフェースを提供します。迅速な可視化のために攻撃ダッシュボードを利用したり、カスタム通知を設定したりできます。

詳しくは[攻撃の分析](../user-guides/events/check-attack.md)の記事をご覧ください。

![Attacksビュー](../images/user-guides/events/check-attack.png)

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->