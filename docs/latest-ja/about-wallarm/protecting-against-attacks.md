```markdown
[rule-creation-options]:    ../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# 攻撃検出プロセス

Wallarmプラットフォームは、アプリケーショントラフィックを継続的に解析し、悪意あるリクエストをリアルタイムで軽減します。本記事では、Wallarmが攻撃から保護するリソースタイプ、トラフィック内の攻撃を検出する方法、そして検出された脅威を追跡および管理する方法について学びます。

## 攻撃とは何か、また攻撃の構成要素は何か

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.18% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/pmaofaxiwniz?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

<a name="attack"></a>**攻撃**とは、以下の特徴でグループ化された単一のヒットまたは複数のヒットを意味します。

* 同一の攻撃タイプ、悪意のあるペイロードが含まれるパラメーター、およびヒットが送信されたアドレス。ヒットは同一または異なるIPアドレスから来る場合があり、1つの攻撃タイプ内で悪意のあるペイロードの値が異なる場合があります。最後のヒットから1時間以内に新たなヒットが到着する必要があります―そうでなければ別の攻撃として扱われます。

    このヒットのグループ化方法は基本的なもので、全てのヒットに適用されます。

* [ヒットのソースIPによるグループ化](../user-guides/events/grouping-sampling.md#grouping-of-hits)が有効な場合、同一の送信元IPアドレス。その他のヒットパラメーターの値は異なる可能性があります。

    このヒットのグループ化方法は、ブルートフォース、強制ブラウジング、BOLA（IDOR）、リソースの過剰使用、データボム、そしてバーチャルパッチ攻撃タイプ以外の全てのヒットに対して機能します。

    この方法でヒットがグループ化された場合、[**Mark as false positive**](../user-guides/events/check-attack.md#false-positives)ボタンは使用不可になります。

記載されたヒットのグループ化方法は互いに排他的ではありません。もしヒットが両方の方法の特徴を持つ場合、全てが1つの攻撃にグループ化されます。

<a name="hit"></a>**ヒット**とは、Wallarmノードによって追加されたメタデータと共にシリアライズされた悪意あるリクエストです。もしWallarmが1つのリクエスト内で異なるタイプの複数の悪意あるペイロードを検出した場合、それぞれのタイプごとにヒットが記録されます。

<a name="malicious-payload"></a>**悪意あるペイロード**とは、以下の要素を含む元のリクエストの一部です。

* リクエスト内で検出された攻撃の兆候。もし同一攻撃タイプを表す複数の攻撃兆候がリクエスト内で検出された場合、最初の兆候のみがペイロードに記録されます。
* 攻撃兆候のコンテキスト。コンテキストとは、検出された攻撃兆候の前後に存在する一連の記号です。ペイロードの長さに制限があるため、攻撃兆候がペイロード全体の長さである場合はコンテキストが省略される可能性があります。

    攻撃兆候は[behavioral attacks](#behavioral-attacks)の検出には使用されないため、behavioral attacksの一部として送信されるリクエストは空のペイロードとなります。

[Wallarmで攻撃を解析する方法の詳細 →](../user-guides/events/check-attack.md)

## 保護されるリソースの種類

Wallarmノードは、保護対象リソースに送信されるHTTPおよびWebSocketトラフィックを解析します。

* HTTPトラフィックの解析はデフォルトで有効です。

    Wallarmノードは、[input validation attacks](#input-validation-attacks)および[behavioral attacks](#behavioral-attacks)のためにHTTPトラフィックを解析します。
* WebSocketトラフィックの解析は、[`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket)ディレクティブを使用して追加で有効にする必要があります。

    Wallarmノードは、WebSocketトラフィックを[input validation attacks](#input-validation-attacks)のみに対して解析します。

保護対象のAPIは、以下の技術に基づいて設計することが可能です（WAAP[subscription plan](subscription-plans.md#waap-and-advanced-api-security)の制限あり）。

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## 攻撃検出プロセス

攻撃を検出するために、Wallarmは以下のプロセスを用います。

1. リクエストのフォーマットを特定し、各リクエスト部分を[parse](../user-guides/rules/request-processing.md)します。
2. リクエストが向けられているエンドポイントを特定します。
3. Wallarm Consoleで設定されたリクエスト解析用の[custom](../user-guides/rules/rules.md)ルールを適用します。
4. [default](#tools-for-attack-detection)およびカスタムルールに基づき、リクエストが悪意あるものか否か判断します。

## 攻撃タイプ

Wallarmソリューションは、API、マイクロサービス、ウェブアプリケーションを、[OWASP Top 10](https://owasp.org/www-project-top-ten/)および[OWASP API Top 10](https://owasp.org/www-project-api-security/)の脅威、APIの濫用、その他の自動化された脅威から保護します。

技術的には、Wallarmで検出可能な全ての攻撃は以下のグループに分けられます:

* Input validation attacks
* Behavioral attacks

攻撃検出方法は攻撃グループに依存します。behavioral attacksを検出するには、追加のWallarmノード設定が必要です。

### Input validation attacks

Input validation attacksには、SQLインジェクション、クロスサイトスクリプティング、リモートコード実行、パストラバーサル、その他の攻撃タイプが含まれます。各攻撃タイプは、リクエスト内で送信される特定の記号の組み合わせを特徴とします。input validation attacksを検出するためには、リクエストの構文解析―特定の記号の組み合わせを検出するための解析―を実施する必要があります。

Wallarmは、SVG、JPEG、PNG、GIF、PDFなどのバイナリファイルを含むリクエストの全ての部分に対して、記載された[tools](#tools-for-attack-detection)を用いてinput validation attacksを検出します。

input validation attacksの検出は、デフォルトで全てのクライアントに対して有効です。

### Behavioral attacks

Behavioral attacksには以下の攻撃クラスが含まれます:

* [Brute‑force attacks](../admin-en/configuration-guides/protecting-against-bruteforce.md)は、パスワードのブルートフォース、セッション識別子のブルートフォース、クレデンシャルスタッフィングを含みます。これらの攻撃は、典型的なURIに対して、限られた時間枠内でさまざまな強制パラメーター値をもつ大量のリクエストが送信されることにより特徴付けられます。

    例えば、攻撃者がパスワードを強制する場合、ユーザー認証URLに対して、`password`の異なる値を持つ多数の類似リクエストが送信される可能性があります:

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```
* [Forced browsing attacks](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)は、限られた時間枠内で異なるURIへのリクエストに対して多数の404レスポンスが返されることが特徴です。

    例えば、この攻撃の目的は隠しリソース（ディレクトリやファイルなど、アプリケーションコンポーネントに関する情報を含むもの）を列挙しアクセスすることで、他の攻撃タイプを実行するための情報として利用することです。

* [BOLA (IDOR) attacks](../admin-en/configuration-guides/protecting-against-bola-trigger.md)は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストを通じてオブジェクトの識別子を使い、認証機構を回避してデータを取得または変更することが可能です。

    例えば、攻撃者が店舗の識別子を強制して実際の識別子を見つけ、対応する店舗の財務データを取得する場合:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    もしそのようなAPIリクエストに認証が不要であれば、攻撃者は実際の財務データを取得し、自身の目的に利用することが可能です。

#### 検出

behavioral attacksを検出するためには、リクエストの構文解析とリクエスト数およびリクエスト間の時間の相関解析を実施する必要があります。

相関解析は、ユーザー認証、リソースファイルディレクトリ、または特定オブジェクトURLに対して送信されたリクエスト数がしきい値を超えた場合に実施されます。リクエスト数のしきい値は、正当なリクエストのブロックリスクを低減するよう設定する必要があります（例えば、ユーザーが自分のアカウントに対して複数回誤ったパスワードを入力した場合など）。

* 相関解析は、Wallarmのpostanalyticsモジュールによって実施されます。
* 受信したリクエスト数としきい値の比較およびリクエストのブロックは、Wallarm Cloudにおいて実施されます。

behavioral attackが検出された場合、リクエストの送信元はブロックされます。すなわち、リクエストが送信されたIPアドレスがdenylistに追加されます。

#### 保護

behavioral attacksからリソースを保護するためには、相関解析のしきい値およびbehavioral attacksに脆弱なURLを設定する必要があります。

* [ブルートフォース保護の設定方法](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [強制ブラウジング保護の設定方法](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA (IDOR)保護の設定方法](../admin-en/configuration-guides/protecting-against-bola-trigger.md)

## 攻撃検出のためのツール

悪意あるリクエストを検出するため、Wallarmノードは保護対象リソースに送信される全てのリクエストを[解析](#attack-detection-process)し、以下のツールを使用します。

* ライブラリ **libproton**
* ライブラリ **libdetection**
* リクエスト解析用のカスタムルール

### ライブラリ libproton

**libproton**ライブラリは悪意あるリクエストを検出するための主要なツールです。このライブラリは、攻撃タイプごとのトークンシーケンスとして異なる攻撃の兆候を判断する**proton.db**コンポーネントを使用します。例えば、[SQLインジェクション攻撃タイプ](../attacks-vulns-list.md#sql-injection)の場合、`union select`が該当します。もしリクエストが**proton.db**内のシーケンスと一致するトークンシーケンスを含む場合、そのリクエストは該当する攻撃タイプの攻撃と判断されます。

Wallarmは、既存の攻撃タイプおよび新しい攻撃タイプのために、トークンシーケンスを含む**proton.db**を定期的に更新します。

### ライブラリ libdetection

#### libdetectionの概要

[**libdetection**](https://github.com/wallarm/libdetection)ライブラリは、**libproton**ライブラリにより検出された攻撃を、以下の通り追加で検証します:

* もし**libdetection**が**libproton**によって検出された攻撃兆候を確認すれば、攻撃がブロックされ（フィルタリングノードが`block`モードで動作している場合）、Wallarm Cloudにアップロードされます。
* もし**libdetection**が**libproton**によって検出された攻撃兆候を確認しなければ、そのリクエストは正当なものと判断され、攻撃はWallarm Cloudにアップロードされず、ブロックもされません（フィルタリングノードが`block`モードで動作している場合）。

**libdetection**を使用することで、攻撃の二重検出が実現され、誤検出が減少します。

!!! info "libdetectionライブラリで検証される攻撃タイプ"
    現在、**libdetection**ライブラリはSQLインジェクション攻撃のみを検証します。

#### libdetectionの仕組み

**libdetection**の特徴は、攻撃タイプ固有のトークンシーケンスだけでなく、トークンシーケンスが送信されたコンテキストについてもリクエストを解析する点にあります。

このライブラリには、各攻撃タイプの構文における文字列（現時点ではSQLインジェクション）が含まれており、その文字列をコンテキストと呼びます。SQLインジェクション攻撃タイプのコンテキストの例は以下の通りです:

```curl
SELECT example FROM table WHERE id=
```

ライブラリは、コンテキストと一致するかどうか、攻撃構文の解析を実施します。もし攻撃がコンテキストと一致しない場合、そのリクエストは悪意あるものと定義されず、フィルタリングノードが`block`モードで動作している場合でもブロックされません。

#### libdetectionのテスト

**libdetection**の動作確認として、以下の正当なリクエストを保護対象リソースに送信することが可能です:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* **libproton**ライブラリは、`UNION SELECT`をSQLインジェクション攻撃の兆候として検出します。しかし、他のコマンドを伴わない`UNION SELECT`はSQLインジェクション攻撃の兆候とは言えず、**libproton**は誤検出となります。
* もし**libdetection**ライブラリによるリクエスト解析が有効であれば、リクエスト内のSQLインジェクションの兆候は確認されず、そのリクエストは正当なものと判断され、攻撃はWallarm Cloudにアップロードされず、（フィルタリングノードが`block`モードで動作している場合）ブロックされません。

#### libdetectionモードの管理

!!! info "**libdetection**のデフォルトモード"
    **libdetection**ライブラリのデフォルトモードは、全ての[deployment options](../installation/supported-deployment-options.md)に対して`on/true`（有効）です。

**libdetection**モードは、以下の方法で制御できます:

* NGINX用の[`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection)ディレクティブ。
* Envoy用の[`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)パラメーター。
* Wallarm NGINX Ingress controllerの[options](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode)のいずれか:

    * Ingressリソースに対する`nginx.ingress.kubernetes.io/server-snippet`アノテーション。
    * Helmチャートの`controller.config.server-snippet`パラメーター。

* Wallarm Sidecarソリューションの`wallarm-enable-libdetection` [pod annotation](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list)。
* AWS Terraformによるデプロイメント用の`libdetection`変数。[AWS Terraformモジュールの使用方法](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module)を参照してください。

## 特定の攻撃タイプの無視

**Ignore certain attack types**ルールは、特定のリクエスト要素において特定の攻撃タイプの検出を無効にすることを可能にします。

デフォルトでは、Wallarmノードは任意のリクエスト要素内でいずれかの攻撃タイプの兆候を検出すると、そのリクエストを攻撃と判断します。しかし、攻撃兆候を含む一部のリクエストは実際には正当なものである場合があります（例: Database Administrator Forumで投稿が公開される際のリクエスト本文は、[悪意あるSQLコマンド](../attacks-vulns-list.md#sql-injection)の記述を含む可能性があります）。

もしWallarmノードがリクエストの標準ペイロードを悪意あるものと判断した場合、[false positive](#false-positives)が発生します。false positiveを防ぐためには、保護対象アプリケーションの特性に合わせて、特定タイプのカスタムルールを用い、標準の攻撃検出ルールを調整する必要があります。Wallarmは、これを実現するために**Ignore certain attack types**[ルール](../user-guides/rules/rules.md)を提供します。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Ignore certain attacks**を選択します。
1. **If request is**において、ルールを適用するスコープを[describe](../user-guides/rules/rules.md#configuring)します。
1. 特定の攻撃兆候のみを無視するか（選択する）、全ての攻撃の兆候を無視するかを設定します。
1. **In this part of request**において、ルールを設定したいリクエストポイントを指定します。

    利用可能な全てのポイントは[こちら](../user-guides/rules/request-processing.md)に記載されており、特定のユースケースに合致するものを選択できます。

1. [ルールコンパイルの完了](../user-guides/rules/rules.md#ruleset-lifecycle)を待ちます。

**ルール例**

例えば、データベース管理者フォーラムで投稿の公開をユーザーが確認すると、クライアントはエンドポイント`https://example.com/posts/`にPOSTリクエストを送信します。このリクエストは以下の特性を持ちます:

* 投稿内容はリクエストボディパラメーター`postBody`で渡されます。投稿内容には、Wallarmが悪意あるものと判断する可能性のあるSQLコマンドが含まれる場合があります。
* リクエストボディのタイプは`application/json`です。

[SQL injection](../attacks-vulns-list.md#sql-injection)を含むcURLリクエストの例:

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

このため、`https://example.com/posts/`へのリクエストの`postBody`パラメーター内のSQL injectionを無視する必要があります。

そのため、以下のスクリーンショットに表示されているように、**Ignore certain attack types**ルールを設定します。

![Example of the rule "Ignore certain attack types"](../images/user-guides/rules/ignore-attack-types-rule-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## バイナリデータ内の特定の攻撃兆候の無視

デフォルトでは、Wallarmノードは既知の全ての攻撃兆候について送信されるリクエストを解析します。解析中、Wallarmノードは攻撃兆候を通常のバイナリ記号と認識せず、バイナリデータ内で悪意あるペイロードとして誤検出する場合があります。

**Allow binary data**[ルール](../user-guides/rules/rules.md)を使用することで、バイナリデータが含まれるリクエスト要素を明示的に指定できます。指定したリクエスト要素の解析中、Wallarmノードはバイナリデータに含まれるはずのない攻撃兆候を無視します。

* **Allow binary data**ルールは、バイナリデータ（例: 圧縮または暗号化されたファイル）を含むリクエスト要素の攻撃検出を微調整することを可能にします。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Binary data processing**を選択します。
1. **If request is**において、ルールを適用するスコープを[describe](../user-guides/rules/rules.md#configuring)します。
1. **In this part of request**において、ルールを設定するリクエストポイントを指定します。

    利用可能な全てのポイントは[こちら](../user-guides/rules/request-processing.md)に記載されており、特定のユースケースに合致するものを選択できます。

1. [ルールコンパイルの完了](../user-guides/rules/rules.md#ruleset-lifecycle)を待ちます。

**ルール例**

例えば、ユーザーがサイト上のフォームを使用して画像付きのバイナリファイルをアップロードする場合、クライアントは`multipart/form-data`タイプのPOSTリクエストを`https://example.com/uploads/`に送信します。バイナリファイルはボディパラメーター`fileContents`で渡され、これを許可する必要があります。

そのため、以下のスクリーンショットに表示されているように、**Allow binary data**ルールを設定します。

![Example of the rule "Allow binary data"](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## 攻撃のモニタリングとブロッキング

**Input validation attacks**

Wallarmは、以下のモードで[input validation attacks](#input-validation-attacks)を処理できます:

* Monitoring mode：攻撃を検出しますがブロックはしません。
* Safe blocking mode：攻撃を検出しますが、[graylisted IPs](../user-guides/ip-lists/overview.md)からのリクエストのみをブロックします。graylisted IPsからの正当なリクエストはブロックされません。
* Blocking mode：攻撃を検出しブロックします。

各種フィルタリングモードの動作および特定のアプリケーション、ドメイン、またはエンドポイント向けのフィルタリングモードの設定方法については、[こちら](../admin-en/configure-wallarm-mode.md)にて詳細をご確認ください。

**Behavioral attacks**

Wallarmが[behavioral attacks](#behavioral-attacks)を検出し、その検出時にどのような動作を行うかは、フィルタリングモードではなく、これら攻撃タイプの保護に関する[specific configuration](#protection)で定義されます。

## False positives

**False positive**とは、正当なリクエスト内で攻撃兆候が検出される場合や、正当なエンティティが脆弱性と認定される場合に発生します。[脆弱性スキャンにおけるfalse positivesの詳細 →](detecting-vulnerabilities.md#false-positives)

攻撃検出のためのリクエスト解析時、Wallarmは超低いfalse positiveを実現するための最適なアプリケーション保護を提供する標準ルールセットを使用します。しかし、保護対象アプリケーションの特性により、標準ルールが正当なリクエスト内の攻撃兆候を誤認識する場合があります。例えば、Database Administrator Forumへの投稿追加リクエストにおいて、悪意あるSQLクエリの記述によりSQLインジェクション攻撃が検出される可能性があります。

このような場合、保護対象アプリケーションの特性に合わせて標準ルールを調整するために、以下の方法でfalse positiveに対処する必要があります:

* [tag `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)で全ての攻撃をフィルタリングし、false positiveが確認された場合、個別に攻撃またはヒットを[mark](../user-guides/events/check-attack.md#false-positives)します。Wallarmは自動的に同一リクエストに対する攻撃検出を無効にするルールを作成します。
* 特定のリクエストにおいて[特定の攻撃タイプの検出を無効にする](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)。
* [バイナリデータ内の特定の攻撃兆候の検出を無効にする](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)。
* リクエストに誤って適用されたパーサーを[無効にする](../user-guides/rules/request-processing.md#managing-parsers)。

false positiveの特定と対処は、アプリケーション保護のためのWallarm微調整の一部です。最初のWallarmノードはMonitoring[mode](#monitoring-and-blocking-attacks)でデプロイし、検出された攻撃を解析することを推奨します。もし誤って攻撃と判断されたものがある場合、false positiveとしてマークし、フィルタリングノードをBlockingモードに切り替えます。

## 検出された攻撃の管理

検出された全ての攻撃は、Wallarm Consoleの→ **Attacks** セクションにて`attacks`フィルタによって表示されます。インターフェースを通じて、以下の操作が可能です:

* 攻撃の表示と解析
* 再確認キューでの攻撃の優先度の上昇
* 攻撃または個別ヒットのfalse positiveとしてのマーク
* 個別ヒットのカスタム処理のためのルール作成

![Attacks view](../images/user-guides/events/check-attack.png)

## 攻撃ダッシュボード

Wallarmは、システムのセキュリティ状況を常に把握するための包括的なダッシュボードを提供します。

Wallarmの[Threat Prevention](../user-guides/dashboards/threat-prevention.md)ダッシュボードは、システムのセキュリティ状況に関する一般的な指標を提供し、攻撃のソース、ターゲット、タイプ、プロトコルの多面的な情報を含みます。

![Threat Prevention dashboard](../images/user-guides/dashboard/threat-prevention.png)

[OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md)ダッシュボードは、OWASP API Top 10脅威に対するシステムのセキュリティ状況の詳細な可視化を提供し、攻撃情報を含みます。

![OWASP API Top 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## 検出された攻撃、ヒット、悪意あるペイロードに関する通知

Wallarmは、検出された攻撃、ヒット、および悪意あるペイロードに関する通知を送信することが可能です。これにより、システムへの攻撃試行をいち早く把握し、検出された悪意あるトラフィックを迅速に解析できます。悪意あるトラフィックの解析には、false positiveの報告、正当なリクエストを送信したIPのallowlisting、および攻撃元IPのdenylistingが含まれます。

通知を設定するには:

1. 通知送信用のシステムとの[native integrations](../user-guides/settings/integrations/integrations-intro.md)を設定します（例: PagerDuty, Opsgenie, Splunk, Slack, Telegram）。
2. 通知送信の条件を設定します:

    * 検出された各ヒットについて通知を受けるには、統合設定で適切なオプションを選択します。

        ??? info "検出されたヒットに関するJSON形式の通知例"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```
    
    * 攻撃、ヒット、または悪意あるペイロードの数のしきい値を設定し、そのしきい値を超えた場合に通知を受けるため、適切な[triggers](../user-guides/triggers/triggers.md)を設定します.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->
```