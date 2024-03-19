# 攻撃を検出する

Wallarmプラットフォームは、アプリケーションのトラフィックを連続的に分析し、リアルタイムで悪意のあるリクエストを軽減します。この記事では、Wallarmが攻撃から保護するリソースの種類、トラフィック内で攻撃を検出する方法、検出された脅威の追跡および管理方法について学びます。

## 攻撃とは何か、攻撃の構成要素とは何か？

<a name="attack"></a>**攻撃**は、以下の特性に基づいてグループ化された単一のヒットまたは複数のヒットです：

* 同じ攻撃タイプ、不正なペイロードを持つパラメータ、ヒットが送られたアドレス。ヒットは同じIPアドレスまたは異なるIPアドレスから来る可能性があり、一つの攻撃タイプ内で不正なペイロードの値が異なることもあります。

    このヒットのグルーピング方法は基本であり、すべてのヒットに適用されます。
* 同じソースIPアドレス（適切な[トリガー](../user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack)が有効化されている場合）。他のヒットパラメータの値は異なることがあります。

    このヒットのグルーピング方法は、ブルートフォース、強制的なブラウジング、BOLA（IDOR）、リソース過剰、データボム、仮想パッチ攻撃タイプを除くすべてのヒットに対して機能します。

    この方法でヒットがグループ化されると、攻撃に対する[**偽陽性としてマークする**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンと[アクティブ検証](detecting-vulnerabilities.md#active-threat-verification)オプションは利用できません。

上記のヒットグルーピング方法は互いに排他的ではありません。ヒットが両方の方法の特性を持っている場合、それらはすべて1つの攻撃にグループ化されます。

<a name="hit"></a>**ヒット**は、シリアル化された不正なリクエストです（元の不正なリクエストとWallarmノードによって追加されたメタデータ）。Wallarmが1つのリクエストに異なる種類のいくつかの不正なペイロードを検出した場合、Wallarmはそれぞれ1つの種類のペイロードを持ついくつかのヒットを記録します。

<a name="malicious-payload"></a>**不正なペイロード**は、以下の要素を含む元のリクエストの一部です：

* リクエストで検出された攻撃の兆候。同じ攻撃タイプを特徴づけるいくつかの攻撃の兆候がリクエストで検出された場合、最初の兆候のみがペイロードに記録されます。
* 攻撃兆候の文脈。コンテキストは、検出された攻撃兆候の前と後を締める記号のセットです。ペイロードの長さは制限されているため、攻撃兆候が全体のペイロードの長さを持つ場合、コンテキストは省略されることがあります。

    攻撃の兆候は、[行動攻撃](#behavioral-attacks)を検出するために使用されませんので、行動攻撃の一部として送信されたリクエストには空のペイロードが含まれます。

## 攻撃の種類

Wallarmソリューションは、OWASP API Top 10の脅威、APIの乱用、および他の自動化された脅威からAPI、マイクロサービス、Webアプリケーションを保護します。

技術的には、Wallarmが検出できる[すべての攻撃](../attacks-vulns-list.md)がグループ分けされます：

* 入力検証攻撃
* 行動攻撃

攻撃検出方法は、攻撃グループによって異なります。行動攻撃を検出するためには、追加のWallarmノードの設定が必要です。

### 入力検証攻撃

入力検証攻撃には、SQLインジェクション、クロスサイトスクリプティング、リモートコード実行、パストラバーサルおよび他の攻撃タイプが含まれます。各攻撃タイプは、リクエストで送信される特定の記号組み合わせによって特徴付けられます。入力検証攻撃を検出するには、リクエストの構文分析を行い、特定の記号組み合わせを検出する必要があります。

Wallarmは、SVG、JPEG、PNG、GIF、PDFなどのバイナリーファイルを含む任意のリクエストの一部で入力検証攻撃を検出します。これらは、リストされた[ツール](#tools-for-attack-detection)を使用します。

入力検証攻撃の検出は、すべてのクライアントに対してデフォルトで有効になっています。

### 行動攻撃

行動攻撃には、以下の攻撃クラスが含まれます：

* ブルートフォース攻撃：パスワードとセッション識別子の強制探索、ファイルおよびディレクトリの強制ブラウジング、資格情報の詰め込み。行動的な攻撃は、限られた時間枠で典型的なURLに異なる強制的なパラメータ値を持つ大量のリクエストによって特徴付けられます。

    例えば、攻撃者がパスワードを強制する場合、ユーザー認証URLに異なる`パスワード`値を持つ多くの類似したリクエストを送信することができます：

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```

* 同じ名前の脆弱性を利用するBOLA（IDOR）攻撃。この脆弱性では、攻撃者がAPIリクエストを介してオブジェクトにアクセスし、その識別子をバイパスしてそのデータを取得または変更することができます。

    例えば、攻撃者が店の識別子を強制する場合、実際の識別子を見つけて該当する店の財務データを取得するために以下のコマンドを実行します：

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    このようなAPIリクエストに認証が必要でない場合、攻撃者は実際の財務データを取得し、自分の目的のために使用することができます。

#### 行動攻撃の検出

行動攻撃を検出するには、リクエストの構文分析とリクエスト数とリクエスト間の時間に関する相関分析を行う必要があります。

ユーザー認証、リソースファイルディレクトリ、特定のオブジェクトURLへのリクエスト数の閾値が超えた場合に相関分析が行われます。リクエスト数の閾値を設定することで、正当なリクエストのブロッキングのリスクを減らすことができます（例：ユーザーが何度も間違ったパスワードを入力した場合）。

* 相関分析は、Wallarmの後処理モジュールによって行われます。
* 受け取ったリクエスト数とリクエスト数の閾値の比較、およびリクエストのブロッキングは、Wallarmクラウドで行われます。

行動攻撃が検出された場合、リクエストの送信元がブロックされるため、リクエストが送信されたIPアドレスが拒否リストに追加されます。

#### 行動的攻撃防御の設定

リソースを行動攻撃から保護するためには、相関分析の閾値を設定し、行動攻撃に対して脆弱なURLを設定する必要があります：

* [ブルートフォース保護の設定に関する指示](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA（IDOR）保護の設定に関する指示](../admin-en/configuration-guides/protecting-against-bola.md)

!!! warning "行動攻撃防御の制限"
    行動攻撃の兆候を探す際には、Wallarmノードは他の攻撃タイプの兆候を含まないHTTPリクエストのみを解析します。以下の場合、これらのリクエストは行動攻撃の一部とは考えられません：

    * これらのリクエストには、[入力検証攻撃](#input-validation-attacks)の兆候が含まれています。
    * これらのリクエストは、[ルール **正規表現に基づく攻撃指標の作成**](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)で指定された正規表現に一致します。

## 保護されたリソースの種類

Wallarmノードは、保護されたリソースに送信されるHTTPおよびWebSocketトラフィックを解析します：

* HTTPトラフィックの解析はデフォルトで有効になっています。

    WallarmノードはHTTPトラフィックを[入力検証攻撃](#input-validation-attacks)と[行動攻撃](#behavioral-attacks)のために解析します。
* WebSocketトラフィックの分析は、追加的にディレクティブ[`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket)を通じて有効化する必要があります。

    WallarmノードはWebSocketトラフィックを[入力検証攻撃](#input-validation-attacks)のためにのみ解析します。

保護されたリソースAPIは、以下の技術を基に設計することができます（WAAP[サブスクリプションプラン](subscription-plans.md#subscription-plans)の下に制限されます）：

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## 攻撃検出プロセス

攻撃を検出するために、Wallarmは以下のプロセスを使用します：

1. リクエストの形式を決定し、[リクエストの解析](../user-guides/rules/request-processing.md)について説明されているとおり、すべてのリクエストの一部を解析します。
2. リクエストが向けられているエンドポイントを決定します。
3. Wallarmコンソールで設定された[カスタムルールのリクエスト解析](#custom-rules-for-request-analysis)を適用します。
4. [デフォルトの検出ルールおよびカスタム検出ルール](#tools-for-attack-detection)に基づいて、リクエストが不正かどうかを判断します。

## 攻撃検出のツール

悪意のあるリクエストを検出するために、Wallarmノードは、保護されたリソースに送信されたすべてのリクエストを以下のツールを使用して解析します：

* ライブラリ **libproton**
* ライブラリ **libdetection**
* カスタムリクエスト解析ルール

### ライブラリ libproton

**libproton**ライブラリは、悪意のあるリクエストを検出するための主要なツールです。このライブラリは、さまざまな攻撃タイプの兆候をトークンシーケンスとして特定するコンポーネント**proton.db**を使用します。例えば、[SQLインジェクション攻撃タイプ](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)に対しては`union select`です。リクエストが**proton.db**からのシーケンスに一致するトークンシーケンスを含む場合、このリクエストは対応するタイプの攻撃と見なされます。

Wallarmは定期的に**proton.db**を新規攻撃タイプおよび既述の攻撃タイプのトークンシーケンスで更新します。

### ライブラリ libdetection

#### libdetection の概要

[**libdetection**](https://github.com/wallarm/libdetection)ライブラリは、ライブラリ**libproton**によって検出された攻撃を追加で検証します：

* **libdetection**が**libproton**によって検出された攻撃の兆候を確認すれば、攻撃はブロックされ（フィルタリングノードが`block`モードで動作している場合）し、Wallarm Cloudにアップロードされます。
* **libdetection**が**libproton**によって検出された攻撃の兆候を確認しなければ、リクエストは正当と見なされ、攻撃はWallarm Cloudにアップロードされず、ブロックされません（フィルタリングノードが`block`モードで動作している場合）。

**libdetection**を使用すると、攻撃の2重検出が可能となり、偽陽性の数が減少します。

!!! info "libdetection ライブラリで検証された攻撃のタイプ"
    現在、**libdetection**ライブラリはSQLインジェクション攻撃のみを検証しています。

#### libdetection の動作方法

**libdetection**の特徴は、攻撃タイプ固有のトークンシーケンスだけでなく、トークンシーケンスが送信された文脈もリクエストを解析することにあります。

このライブラリには、異なる攻撃タイプの構文（現在はSQLインジェクション）の文字列が含まれています。この文字列はコンテキストと呼ばれます。SQLインジェクション攻撃タイプのコンテキストの例は以下の通りです：

```curl
SELECT example FROM table WHERE id=
```

ライブラリは、コンテキストと一致する攻撃の構文分析を行います。攻撃がコンテキストと一致しない場合、そのリクエストは不正なものとは認識されず、ブロックされません（フィルタリングノードが`block`モードで動作している場合）。

#### libdetection のテスト

**libdetection**の動作を確認するために、以下の正当なリクエストを保護されたリソースに送信することができます：

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* ライブラリ**libproton**は`UNION SELECT`を SQLインジェクションの攻撃記号として検出します。`UNION SELECT`は他のコマンドなしではSQLインジェクションの攻撃記号ではないため、**libproton**は偽陽性を検出します。
* **libdetection**ライブラリでリクエストの解析が有効化されていれば、リクエストでのSQLインジェクションの攻撃記号は確認されません。リクエストは正当とみなされ、攻撃はWallarm Cloudにアップロードされず、ブロックされません（フィルタリングノードが`block`モードで動作している場合）。

#### libdetection モードの管理

!!! info "libdetection のデフォルトモード"
    **libdetection**ライブラリのデフォルトモードは`on/true`（有効）で、すべての[デプロイメントオプション](../installation/supported-deployment-options.md)に適用されます。

**libdetection**モードを制御する方法は次の通りです：

* `wallarm_enable_libdetection`ディレクティブ（NGINX）
* [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)パラメータ（Envoy）
* Wallarm NGINX Ingressコントローラの[オプション](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode)の1つ：

    * Ingressリソースに対する`nginx.ingress.kubernetes.io/server-snippet`注釈。
    * Helmチャートの`controller.config.server-snippet`パラメータ。

* Wallarm Sidecarプロキシソリューションの`wallarm-enable-libdetection` [pod注釈](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list)
* [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module)のデプロイメントの`libdetection` 変数。

### カスタムリクエスト解析ルール

Wallarmのデフォルトのリクエスト分析を保護されたアプリケーションの特性に合わせて調整するために、Wallarmクライアントは次のタイプのカスタムルールを使用できます：

* [仮想パッチを作成](../user-guides/rules/vpatch-rule.md)
* [正規表現に基づいた攻撃指標を作成](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)
* [正規表現に基づいた攻撃の検出を無効化](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule)
* [特定の攻撃タイプを無視](../user-guides/rules/ignore-attack-types.md)
* [特定のバイナリーデータとファイルタイプを許可](../user-guides/rules/ignore-attacks-in-binary-data.md)
* [パーサを無効化／有効化](../user-guides/rules/disable-request-parsers.md)
* [overlimit_res攻撃検出の微調整](../user-guides/rules/configure-overlimit-res-detection.md)

## 攻撃の監視とブロック

Wallarmは、次のモードで攻撃を処理できます：

* 監視モード：攻撃を検出しますがブロックしません。
* 安全なブロックモード：攻撃を検出しますが、[グレーリストに登録されたIP](../user-guides/ip-lists/graylist.md)からの攻撃のみをブロックします。グレーリストに登録されたIPからの正当なリクエストはブロックされません。
* ブロックモード：攻撃を検出し、ブロックします。

Wallarmは優秀なリクエスト分析と偽陽性の少なさを保証します。しかし、保護された各アプリケーションは独自の特性を持っているため、ブロッキングモードを有効化する前に監視モードでWallarmの動作を分析することをお勧めします。

フィルタリングモードを制御するためには、ディレクティブ`wallarm_mode`を使用します。フィルタリングモードの設定に関する詳細な情報は、[リンク](../admin-en/configure-wallarm-mode.md)からご覧いただけます。

行動攻撃のフィルタリングモードは、特定の[トリガー](../admin-en/configuration-guides/protecting-against-bruteforce.md)を通じて個別に設定します。

## 偽陽性

**偽陽性**とは、正当なリクエストで攻撃の兆候が検出された場合や、正当なエンティティが脆弱性と認定された場合の出来事です。[脆弱性スキャンでの偽陽性の詳細→](detecting-vulnerabilities.md#false-positives)

リクエストの攻撃に対する解析時には、Wallarmは超低偽陽性率で最適なアプリケーション保護を提供する標準的なルールセットを使用します。保護されたアプリケーションの特性により、標準的なルールは正当なリクエストの攻撃の兆候を間違えて認識することがあります。例えば、データベース管理者フォーラムに悪意のあるSQLクエリーの説明を追加するリクエストでは、SQLインジェクション攻撃が検出される可能性があります。

このような場合、保護されたアプリケーションの特性に合わせて標準的なルールを調整する必要があります。以下の方法を使用します：

* 有潜在的な偽陽性を分析する（すべての攻撃を[タグ`!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks)でフィルタリング）し、偽陽性が確認された場合、特定の攻撃またはヒットを[マーク](../user-guides/events/false-attack.md)します。Wallarmは自動的に、検出された攻撃記号の同じリクエストの分析を無効化するルールを作成します。
* 特定のリクエストの[特定の攻撃タイプの検出を無効化](../user-guides/rules/ignore-attack-types.md)します。
* [バイナリーデータの特定の攻撃記号の検出を無効化](../user-guides/rules/ignore-attacks-in-binary-data.md)します。
* [誤って適用されたパーサを無効化](../user-guides/rules/disable-request-parsers.md)します。

偽陽性の識別と処理は、アプリケーションを保護するためのWallarmの微調整の一部です。フィルタリングノードを監視[モード](#monitoring-and-blocking-attacks)で初めてデプロイし、検出された攻撃を分析することをお勧めします。いくつかの攻撃が誤って攻撃と認識されている場合、それらを偽陽性としてマークし、フィルタリングノードをブロックモードに切り替えてください。

## 検出された攻撃の管理

すべての検出された攻撃は、Wallarmコンソール→ **イベント**セクションのフィルタ `attacks`に表示されます。インターフェイスから次のように攻撃を管理できます：

* 攻撃を表示して分析する
* 再チェックキューの攻撃の優先度を上げる
* 攻撃または別のヒットを偽陽性としてマークする
* 個々のヒットのカスタム処理のためのルールを作成する

攻撃の管理についての詳細な情報は、[攻撃の操作についての指示](../user-guides/events/analyze-attack.md)を参照してください。

![Attacks view](../images/user-guides/events/check-attack.png)

さらに、Wallarmは包括的なダッシュボードを提供して、システムのセキュリティ状態を常に把握することができます。Wallarmの[脅威防止](../user-guides/dashboards/threat-prevention.md)ダッシュボードは、システムのセキュリティ状態に関する一般的なメトリクスを提供し、[OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md)ダッシュボードは、システムのセキュリティ状態に対してOWASP API Top 10の脅威に対する詳細な可視性を提供します。

![OWASP API Top 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## 検出された攻撃、ヒット、不正なペイロードに関する通知

Wallarmは、検出された攻撃、ヒット、不正なペイロードに関する通知を送信できます。これにより、システムへの攻撃の試みを認識し、検出された不正なトラフィックをすみやかに分析することが可能となります。不正なトラフィックの分析は、偽陽性のレポート、正当なリクエストを発行したIPのホワイトリスト登録、攻撃源のIPのブラックリスト登録を含みます。

通知を設定するには：

1. 通知を送信するシステムとの[ネイティブ統合](../user-guides/settings/integrations/integrations-intro.md)を設定します（例：PagerDuty、Opsgenie、Splunk、Slack、Telegram）。
2. 通知を送信する条件を設定します：

    * 各ヒットごとに通知を受けるためには、統合設定で適切なオプションを選択します。

        ??? info "JSON形式での検出されたヒットに関する通知の例を見る"
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
            ]
            ```

    * 攻撃、ヒット、または不正なペイロード数の閾値を設定し、その閾値が超えたときに通知を受け取るためには、適切な[トリガー](../user-guides/triggers/triggers.md)を設定します。

        [設定されたトリガーと通知の例を参照→](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)進行状況

## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>