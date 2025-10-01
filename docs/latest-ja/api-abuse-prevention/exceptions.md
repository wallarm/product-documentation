[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# API Abuse Preventionの例外 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

本記事では、正当なボットを識別してマークし、特定の対象URLやリクエストタイプに対するボット保護を無効化することで、[API Abuse Prevention](../api-abuse-prevention/overview.md)を細かく調整する方法を説明します。

これらの機能は、API Abuse Preventionの[profilesによる設定](setup.md#creating-profiles)を拡張します。

## 正当な自動化向けの例外

正当なボットやクローラーに関連付けられたIPをマークしてAPI Abuse Preventionによるブロックを避けるには、**Exception list**を使用します。

exception listにIPアドレスまたは範囲を追加し、対象アプリケーションを指定します。これにより、これらのアドレスから対象アプリケーションへのあらゆるリクエストは悪意のあるボットとしてマークされず、API Abuse Preventionによって[deny-](../user-guides/ip-lists/overview.md)または[graylist](../user-guides/ip-lists/overview.md)に追加されません。

exception listにIPアドレスを追加する方法は2つあります。

* **API Abuse Prevention**セクションの**Exception list**タブで**Add exception**を使用します。ここでは、IPやサブネットに加えて、API Abuse Preventionが無視すべきロケーションやソースタイプも追加できます。

    ![API Abuse Prevention - exception list内から項目を追加](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* **Attacks**セクションから：`api_abuse`、`account_takeover`、`scraping`、`security_crawlers`の検索キーを使用するか、**Type**フィルターで該当するオプションを選択し、目的のイベントを展開して**Add to exception list**をクリックします。

    ![API Abuse Prevention - イベントからexception listに追加](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

IPアドレスをexception listに追加すると、そのアドレスがAPI Abuse Prevention自身によって追加されている場合（理由が`Bot`の場合）に限り、[deny-](../user-guides/ip-lists/overview.md)または[graylist](../user-guides/ip-lists/overview.md)から自動的に削除されます。

!!! info "IPからの他の攻撃タイプのブロック"
    exception list内のIPが総当たりや入力バリデーション攻撃などの他の[攻撃タイプ](../attacks-vulns-list.md)を発生させた場合、Wallarmはそのようなリクエストをブロックします。

デフォルトでは、IPはexception listに無期限で追加されます。これを変更して、そのアドレスをexception listから削除する時点を設定できます。また、いつでも直ちにアドレスをexception listから削除できます。

**Exception list**タブでは履歴データを提供します。過去の選択した期間にリストに存在していた項目を表示できます。

## 対象URLおよび特定リクエスト向けの例外

[exception list](#exceptions-for-legitimate-automation)で良性ボットのIPをマークすることに加えて、リクエストの宛先となるURLや、特定のヘッダーを含むリクエストなど特定のリクエストタイプについて、ボット保護を無効化できます。

これを行うために、Wallarmは**Set API Abuse Prevention mode**ルールを提供します（ノードバージョン4.8以降でサポートされます）。

**ルールの作成と適用**

特定のURLまたはリクエストタイプに対するボット保護を無効化するには、次のとおりです。

--8<-- "../include/rule-creation-initial-step.md"

1. **Fine-tuning attack detection** → **Override API abuse profiles**を選択します。 
1. **If request is**で、このルールを適用するリクエストやURLを[記述します](../user-guides/rules/rules.md#uri-constructor)。特定のbranch、hit、またはendpointからルール作成を開始した場合は、それらがスコープを定義します。必要に応じて条件を追加できます。
1. 希望するモードを選択します。

    * **Default** - 記述したスコープ（特定のURLまたはリクエスト）については、API Abuse Preventionの一般的な[profiles](setup.md#creating-profiles)で定義された通常の方法でボットからの保護が機能します。
    * **Do not check for bot activity** - 記述したURLやリクエストタイプについて、ボット活動のチェックを実行しません。

1. 必要に応じて、コメントにこのURL/リクエストタイプ向けにルールを作成する理由を記載します。

ルールを削除せずに、そのURLやリクエストタイプの例外を一時的に無効化できます。その場合は**Default**モードを選択します。後からいつでも**Do not check for bot activity**に戻すことができます。

**ルール例**

**リクエストヘッダーによる正当なボットの識別**

あなたのアプリケーションが、複数のIPからリクエストを送信するマーケティングオートメーションツールKlaviyoと連携しているとします。そこで、特定のURIに対する`Klaviyo/1.0`ユーザーエージェントからのGETリクエストについては、自動化（ボット）活動のチェックを行わないように設定します。

![特定のヘッダーを持つリクエストについてボット活動をチェックしない](../images/user-guides/rules/api-abuse-url-request.png)

**テスト用エンドポイントでのボット保護の無効化**

アプリケーションに属するエンドポイントがあるとします。アプリケーションはボット活動から保護すべきですが、そのテスト用エンドポイントは例外にしたいとします。さらに、APIインベントリは[**API Discovery**](../api-discovery/overview.md)モジュールで発見済みです。 

この場合は、**API Discovery**のエンドポイント一覧からルールを作成する方が簡単です。そこに移動し、対象のエンドポイントを見つけて、そのページからルール作成を開始します。

![API Discoveryのエンドポイントに対するSet API Abuse Prevention modeの作成](../images/user-guides/rules/api-abuse-url.png)

## profilesの無効化と削除

無効化されたprofilesは、トラフィック解析中に**API Abuse Prevention**モジュールが使用しないものの、profiles一覧には表示されます。無効化されたprofilesはいつでも再有効化できます。有効なprofilesが1つもない場合、このモジュールは悪意のあるボットをブロックしません。

削除されたprofilesは復元できず、**API Abuse Prevention**モジュールはトラフィック解析中に使用しません。

profileメニューに**Disable**と**Delete**オプションがあります。