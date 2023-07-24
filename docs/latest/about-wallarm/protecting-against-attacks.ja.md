# 攻撃の検出

Wallarmプラットフォームはアプリケーショントラフィックを継続的に分析し、不正なリクエストをリアルタイムで緩和します。この記事では、Wallarmが攻撃から保護するリソースの種類、トラフィック内の攻撃を検出する方法、検出された脅威を追跡し管理する方法を学ぶことができます。

## 攻撃と攻撃の構成要素とは？

<a name="attack"></a>**攻撃**は、以下の特徴によってグループ化された単一のヒットまたは複数のヒットです。

* 同じ攻撃タイプ、悪意のあるペイロードを含むパラメータ、および送信先のアドレス。ヒットは同じまたは異なるIPアドレスから送信され、攻撃タイプ内の悪意のあるペイロードの値が異なることがあります。

    このヒットグループ化方法は基本的なもので、すべてのヒットに適用されます。
* 適切な[トリガー](../user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack)が有効になっている場合、同じ送信元IPアドレス。他のヒットパラメータの値は異なる場合があります。

    このヒットグループ化方法は、Brute force、Forced browsing、BOLA（IDOR）、Resource overlimit、Data bomb、およびVirtual patch攻撃タイプのヒットを除外したすべてのヒットに適用されます。

    この方法でグループ化された場合、[**誤検知としてマーク**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンと[アクティブな検証](detecting-vulnerabilities.md#active-threat-verification)オプションは攻撃に対して利用できません。

リストされたヒットグループ化方法は互いに排他的ではありません。ヒットに両方の特徴がある場合は、すべてが1つの攻撃にグループ化されます。

<a name="hit"></a>**ヒット**は、Wallarmノードによって追加されたメタデータと共に一連の悪意のあるリクエスト（元の悪意のあるリクエスト）です。Wallarmが1つのリクエスト内に異なる種類の複数の悪意のあるペイロードを検出した場合、Wallarmは、それぞれの種類のペイロードを持つ複数のヒットを記録します。

<a name="malicious-payload"></a>**悪意のあるペイロード**は、以下の要素を含む元のリクエストの一部です。

* リクエストで検出された攻撃サイン。同じ攻撃タイプを特徴付ける複数の攻撃サインがリクエストで検出された場合、最初のサインのみがペイロードに記録されます。
* 攻撃サインのコンテキスト。コンテキストは、検出された攻撃サインの前後にあるシンボルの集合です。ペイロードの長さが制限されているため、攻撃サインが完全なペイロード長の場合、コンテキストが省略される場合があります。

    攻撃サインは[行動攻撃](#behavioral-attacks)を検出するために使用されないため、行動攻撃の一部として送信されるリクエストには空のペイロードがあります。

## 攻撃タイプ

Wallarmで検出可能な[すべての攻撃](../attacks-vulns-list.md)は、以下のグループに分類されます。

* 入力検証攻撃
* 行動攻撃

攻撃検出方法は、攻撃グループによって異なります。行動攻撃を検出するには、Wallarmノードの追加構成が必要です。### 入力検証攻撃

入力検証攻撃には、SQLインジェクション、クロスサイトスクリプティング、リモートコード実行、パストラバーサルなどの攻撃タイプが含まれます。各攻撃タイプは、リクエストに送信された特定の記号の組み合わせで特徴付けられます。入力検証攻撃を検出するには、リクエストの構文解析を実行して特定の記号の組み合わせを検出する必要があります。

入力検証攻撃は、[tools](#tools-for-attack-detection)でリストされたツールを使用してフィルタリングノードによって検出されます。

入力検証攻撃の検出は、すべてのクライアントでデフォルトで有効になっています。

### ビヘイビア攻撃

ビヘイビア攻撃には、以下の攻撃クラスが含まれます。

* ブルートフォース攻撃：パスワードやセッション識別子のブルートフォース、ファイルやディレクトリの強制ブラウジング、資格情報の詰め込み。 ビヘイビア攻撃は、限られた時間内に典型的なURLに異なる強制パラメータ値を持つ多数のリクエストが送信されたことによって特徴付けられます。

    たとえば、攻撃者がパスワードを強制する場合、異なる`password`値を持つ多くの類似したリクエストが、ユーザー認証URLに送信される可能性があります。

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```

* BOLA（IDOR）攻撃は、同じ名前の脆弱性を悪用した攻撃クラスです。 この脆弱性により、APIリクエストを介して識別子でオブジェクトにアクセスし、承認メカニズムをバイパスしてデータを取得または変更することができます。

    たとえば、攻撃者が店舗識別子を強制し、実際の識別子を見つけて対応する店舗の財務データを取得する場合:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    このようなAPIリクエストに承認が不要な場合、攻撃者は実際の財務データを取得し、自分の目的に使用することができます。

#### ビヘイビア攻撃の検出

ビヘイビア攻撃を検出するには、リクエストの構文解析とリクエスト番号とリクエスト間の時間の相関分析が必要です。

相関分析は、ユーザー認証またはリソースファイルディレクトリまたは特定のオブジェクトURLに送信されたリクエスト番号の閾値を超えた場合に実行されます。リクエスト番号の閾値は、合法的なリクエストのブロックリスクを減らすために設定する必要があります（たとえば、ユーザーがアカウントに数回誤ったパスワードを入力した場合）。

* 相関分析は、Wallarmのpostanalyticsモジュールによって実行されます。
* 受信したリクエスト番号とリクエスト番号の閾値の比較、およびリクエストのブロックは、Wallarm Cloudで実行されます。

ビヘイビア攻撃が検出されると、リクエスト元のIPアドレスが拒否リストに追加され、リクエスト元はブロックされます。#### 行動攻撃防御の構成

リソースを行動攻撃から保護するために、相関分析の閾値と、行動攻撃に対して脆弱な URL を設定する必要があります：

* [ブルートフォース攻撃保護の構成手順](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA（IDOR）保護の構成手順](../admin-en/configuration-guides/protecting-against-bola.md)

!!! warning "行動攻撃防御の制限事項"
    Wallarm ノードでは、行動攻撃の兆候を検索する際、他の攻撃タイプの兆候が含まれていない HTTP リクエストのみが分析されます。たとえば、以下の場合は行動攻撃の一部とは見なされません：

    * これらのリクエストには [入力検証攻撃の兆候](#input-validation-attacks) が含まれている場合。
    * これらのリクエストが、[ルール **正規表現に基づく攻撃指標作成**](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) で指定された正規表現に一致する場合。

## 保護リソースの種類

Wallarm ノードは、次のような HTTP 及び WebSocket トラフィックを保護されたリソースに対して分析します：

* HTTP トラフィックの分析は、デフォルトで有効になっています。

    Wallarm ノードは、HTTP トラフィックを [入力検証攻撃](#input-validation-attacks) 及び [行動攻撃](#behavioral-attacks) に対して分析します。
* WebSocket トラフィックの分析は、[`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket) 指令を使用して追加で有効化する必要があります。

    Wallarm ノードは、WebSocket トラフィックを [入力検証攻撃](#input-validation-attacks) のみに対して分析します。

保護されたリソース API は、以下の技術を基に設計されることができます（WAAP [サブスクリプションプラン](subscription-plans.md#subscription-plans) で制限されます）：

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## 攻撃検出プロセス

Wallarm では、次のプロセスを使用して攻撃を検出しています。

1. リクエストの形式を決定し、[リクエスト解析に関するドキュメント](../user-guides/rules/request-processing.md) で説明されている通りに、各リクエストパーツを解析します。
2. リクエストが送信されたエンドポイントを決定します。
3. Wallarm コンソールで構成された [リクエスト分析用カスタムルール](#custom-rules-for-request-analysis) を適用します。
4. [デフォルトとカスタム検出ルール](#tools-for-attack-detection)に基づき、リクエストが悪意のあるものかどうかを判断します。

## 攻撃検出ツール

Wallarm ノードは、次のツールを使用して、保護されたリソースに送信されるすべてのリクエストを分析して、悪意のあるリクエストを検出します。

* **libproton** ライブラリ
* **libdetection** ライブラリ
* リクエスト分析用カスタムルール### ライブラリlibproton

**libproton**ライブラリは、悪意のあるリクエストを検出するための主要なツールです。また、このライブラリは、異なる攻撃タイプの符号列をトークンシーケンスとして定義するコンポーネント**proton.db**を使用します。例えば、SQL Injection攻撃タイプの場合は、`union select`をトークンシーケンスとして定義しています。**proton.db**が定義するトークンシーケンスにリクエストに含まれているトークンシーケンスがマッチする場合、そのリクエストは、対応する攻撃の攻撃と見なされます。

Wallarmは、新しい攻撃タイプや既に説明されている攻撃タイプのために、**proton.db**を定期的に更新しています。

### ライブラリlibdetection

#### libdetectionの概要

[**libdetection**](https://github.com/wallarm/libdetection)ライブラリは、ライブラリ**libproton**によって検出された攻撃をさらに検証します。以下のように:

* **libdetection**が**libproton**によって検出された攻撃の符号を確認した場合、攻撃はブロックされ(フィルタリングノードが`block`モードで動作している場合)、Wallarm Cloudにアップロードされます。
* **libdetection**が**libproton**によって検出された攻撃の符号を確認しなかった場合、リクエストは正当だと見なされ、攻撃はWallarm Cloudにアップロードされず、ブロックされません(フィルタリングノードが`block`モードで動作している場合)。

**libdetection**を使用すると、攻撃の重複検出が確実になり、偽陽性の数も減ります。

!!! info "libdetectionライブラリで検証される攻撃タイプ"
    現在、**libdetection**ライブラリでは、SQLインジェクション攻撃のみを検証しています。

#### libdetectionの動作

**libdetection**の特定の特徴は、攻撃タイプに特化したトークンシーケンスのみならず、トークンシーケンスが送信されたコンテキストについてもリクエストを分析するということです。

このライブラリには、攻撃タイプの構文の複数の文字列(SQL Injectionの場合)が含まれています。文字列はコンテキスト名で、SQLインジェクション攻撃タイプのコンテキストの例を示します。

```curl
SELECT example FROM table WHERE id=
```

ライブラリは、攻撃構文分析を実行して、コンテキストに一致するかどうかを調べます。攻撃がコンテキストに一致しない場合、そのリクエストは悪意のあるものとは見なされず、ブロックされません(フィルタリングノードが`block`モードで動作している場合)。

#### libdetectionのテスト

**libdetection**の動作確認のために、以下の正当なリクエストを保護されたリソースに送信できます。

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* **libproton**ライブラリは、SQL Injection攻撃の符号として`UNION SELECT`を検出します。しかし、`UNION SELECT`は他のコマンドなしではSQL Injection攻撃の符号ではないため、**libproton**は偽陽性を検出します。
* **libdetection**ライブラリでリクエストを分析するように設定されている場合、SQL Injection攻撃の符号はこのリクエストでは認められません。リクエストは正当なものと見なされ、攻撃はWallarm Cloudにアップロードされず、ブロックされません(フィルタリングノードが`block`モードで動作している場合)。#### libdetection モードの管理

!!! info "**libdetection** デフォルト・モード"
    **libdetection** ライブラリのデフォルト・モードは `on/true`（有効）で、すべての [展開オプション](../installation/supported-deployment-options.md) に適用されます。

**libdetection** モードを制御するには、以下を使用できます:

* NGINX 用 [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) ディレクティブ
* Envoy 用 [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) パラメータ
* Wallarm NGINX Ingress controller の 1 つの [オプション](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode):

    * Ingress リソースの `nginx.ingress.kubernetes.io/server-snippet` アノテーション
    * Helm チャートの `controller.config.server-snippet` パラメータ

* Wallarm Sidecar proxy ソリューションの [pod アノテーション](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list) `wallarm-enable-libdetection`
* [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module) デプロイメントの `libdetection` 変数

### リクエスト分析のためのカスタム規則

Wallarm クライアントは、次のタイプのカスタム規則を使用して、Wallarm 規定のリクエスト分析を保護されたアプリケーションの特異性に合わせて調整できます:

* [仮想パッチの作成](../user-guides/rules/vpatch-rule.md)
* [正規表現ベースの攻撃指標の作成](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)
* [正規表現ベースの攻撃検出の無効化](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule)
* [特定の攻撃タイプを無視](../user-guides/rules/ignore-attack-types.md)
* [バイナリデータとファイルタイプを許可](../user-guides/rules/ignore-attacks-in-binary-data.md)
* [パーサーの無効化/有効化](../user-guides/rules/disable-request-parsers.md)
* [overlimit_res 攻撃検出の微調整](../user-guides/rules/configure-overlimit-res-detection.md)

[コンパイル済み](../user-guides/rules/compiling.md) のカスタム規則セットは、リクエストの分析時に **proton.db** の標準規則とともに適用されます。## 攻撃の監視とブロック

Wallarmは、次のモードで攻撃を処理できます。

* 監視モード：攻撃を検出しますが、ブロックしません。
* 安全なブロックモード：攻撃を検出しますが、[グレーリストされたIP](../user-guides/ip-lists/graylist.md)からだけ発生した攻撃のみをブロックします。グレーリストされたIPからの正当なリクエストはブロックされません。
* ブロックモード：攻撃を検出してブロックします。

Wallarmは、高品質なリクエスト解析と低レベルの誤検知を保証します。ただし、保護されたアプリケーションには固有の仕様がありますので、ブロックモードを有効にする前に監視モードでWallarmの動作を分析することをお勧めします。

フィルタリングモードを制御するには、ディレクティブ `wallarm_mode` を使用します。フィルタリングモード構成の詳細情報は、[リンク](../admin-en/configure-wallarm-mode.md)で確認できます。

行動攻撃のフィルタリングモードは、特定の[トリガー](../admin-en/configuration-guides/protecting-against-bruteforce.md)を介して個別に構成します。

## 誤検知

**誤検知**とは、正当なリクエストに攻撃の兆候が検出されるか、正当なエンティティが脆弱性として認定される場合に発生します。[脆弱性スキャンにおける誤検知の詳細についてはこちらを参照→](detecting-vulnerabilities.md#false-positives)

攻撃リクエストの分析にあたり、Wallarmは、超低誤検知率で最適なアプリケーション保護を提供する標準ルールセットを使用します。ただし、保護されたアプリケーションの仕様により、標準ルールが正当なリクエストで攻撃の兆候を誤検知する場合があります。たとえば、SQLインジェクション攻撃は、悪意のあるSQLクエリ記述を含むリクエストをデータベース管理者フォーラムに投稿することで検出される場合があります。

そのような場合は、次の方法を使用して、保護されたアプリケーションの仕様に合わせて標準ルールを調整する必要があります。

* [タグ `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)ですべての攻撃をフィルタリングして潜在的な誤検知を分析し、誤検知を確認した場合は、[特定の攻撃やヒットを適切にマーク](../user-guides/events/false-attack.md)します。これにより、同じリクエストに対し、攻撃の兆候を検出する分析を無効にするルールが自動的に作成されます。
* 特定のリクエストでの[特定の攻撃タイプの検出を無効化](../user-guides/rules/ignore-attack-types.md)します。
* バイナリデータでの[特定の攻撃兆候の検出無効化](../user-guides/rules/ignore-attacks-in-binary-data.md)。
* [リクエストに誤って適用されたパーサーを無効化](../user-guides/rules/disable-request-parsers.md)します。

誤検知の特定と処理は、Wallarmをファインチューニングしてアプリケーションを保護するための一部です。最初のWallarmノードを監視[モード](#monitoring-and-blocking-attacks)で展開し、検出された攻撃を分析することをお勧めします。攻撃が誤検知として認識された場合は、それらを誤検知としてマークし、フィルタリングノードをブロックモードに切り替えます。## 検出された攻撃の管理

検出されたすべての攻撃は、`attacks` フィルターによって、Wallarmコンソールの → **Events** セクションに表示されます。次のように、インターフェースを介して攻撃を管理できます。

* 攻撃を表示して分析する
* 再確認キューで攻撃の優先度を上げる
* 攻撃を誤検知としてマークするか、分離されたヒットを誤検知としてマークする
* 分離されたヒットのカスタム処理のためのルールを作成する

攻撃の管理について詳しくは、[working with attacks](../user-guides/events/analyze-attack.md)の説明を参照してください。

![!Attacks view](../images/user-guides/events/check-attack.png)## 検知された攻撃、ヒット、および悪意のあるペイロードに関する通知

Wallarmは、検知された攻撃、ヒット、および悪意のあるペイロードに関する通知を送信できます。これにより、システムへの攻撃の試みを把握し、検知された悪意のあるトラフィックを迅速に分析することが可能となります。悪意のあるトラフィックの分析には、誤検知の報告、正当なリクエストを起源とするIPのホワイトリスト入り、および攻撃元のIPをブラックリスト入りすることが含まれます。

通知の設定方法：

1. 通知を送信するシステムとの[native integrations](../user-guides/settings/integrations/integrations-intro.md)を構成します（例：PagerDuty、Opsgenie、Splunk、Slack、Telegram）。
2. 通知を送信する条件を設定します。

    * 検出されたヒットごとに通知を受信するには、連携設定で適切なオプションを選択します。

        ??? info "JSON形式の検出されたヒットに関する通知の例を参照"
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
    
    * 攻撃、ヒット、または悪意のあるペイロード数のしきい値を設定し、しきい値を超えた場合に通知を受信するには、適切な[トリガー](../user-guides/triggers/triggers.md)を構成します。

        [構成されたトリガーと通知の例を参照 →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)## デモ動画

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>