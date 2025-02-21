[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# API Abuse Prevention例外 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

本記事では、正当なボットを指定し、特定のターゲットURLおよびリクエスト種別に対してボット保護を無効化することで、[API Abuse Prevention](../api-abuse-prevention/overview.md)を微調整する方法について説明します。

これらの機能は、基本的なAPI Abuse Prevention [プロファイルによる構成](setup.md#creating-profiles)を拡張します。

## 正当な自動化の例外

API Abuse Preventionによるブロックを回避するために、正当なボットまたはクローラーに関連するIPアドレスを指定する場合は、**Exception list**を使用します。

例外リストにIPアドレスまたは範囲を追加し、対象アプリケーションを指定します。これにより、対象アプリケーションへのこれらのアドレスからのリクエストは悪意あるボットと判定されず、API Abuse Preventionによって[deny-](../user-guides/ip-lists/overview.md)または[graylist](../user-guides/ip-lists/overview.md)に追加されません。

例外リストにIPアドレスを追加する方法は2通りあります：

* **API Abuse Prevention**セクション→**Exception list**タブにある**Add exception**から追加します。ここでは、IPやサブネットに加えて、API Abuse Preventionで無視すべきロケーションやソースタイプも追加できます。

    ![API Abuse Prevention - 例外リスト内から項目を追加](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* **Attacks**セクションから：`api_abuse`、`account_takeover`、`scraping`および`security_crawlers`検索キーを利用するか、**Type**フィルタから適切なオプションを選択し、必要なイベントを展開して**Add to exception list**をクリックします。

    ![API Abuse Prevention - 例外リストに項目を追加（イベント内から）](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

IPアドレスが例外リストに追加されると、そのアドレスは自動的に[deny-](../user-guides/ip-lists/overview.md)または[graylist](../user-guides/ip-lists/overview.md)から削除されます。ただし、これはAPI Abuse Prevention自身により追加された場合（`Bot`理由が付与されている場合）に限ります。

!!! info "IPによるその他の攻撃タイプのブロック"
    例外リストに登録されたIPアドレスがブルートフォース攻撃や入力検証攻撃など他の[attack types](../attacks-vulns-list.md)を発生させた場合、Wallarmはそのリクエストをブロックします。

デフォルトでは、IPアドレスは永久に例外リストに追加されます。必要に応じて、例外リストから削除されるタイミングを設定することも可能です。また、いつでも即座に例外からIPアドレスを削除できます。

**Exception list**タブでは履歴データが提供され、過去の特定の期間内にリストに表示された項目を確認できます。

## ターゲットURLおよび特定リクエストに対する例外

[exception list](#exceptions-for-legitimate-automation)による優良ボットIPの指定に加え、要求先URLや特定のリクエスト種別、例えば特定のヘッダーを含むリクエストに対してボット保護を無効にすることができます。

これを実現するために、Wallarmは**Set API Abuse Prevention mode**ルールを提供します（ノードバージョン4.8以上に対応）。

**ルールの作成と適用**

特定のURLまたはリクエスト種別に対してボット保護を無効にするには：

--8<-- "../include/rule-creation-initial-step.md"

1. **Fine-tuning attack detection** → **Override API abuse profiles**を選択します。 
2. **If request is**で、ルールを適用するリクエストやURLを[describe](../user-guides/rules/rules.md#uri-constructor)してください。特定のブランチ、ヒットまたはエンドポイントに対してルールを開始した場合、それらがスコープを定義します。必要に応じて、条件を追加できます。
3. 希望のモードを選択します:
    * **Default** - 記述されたスコープ（特定のURLまたはリクエスト）に対して、一般的なAPI Abuse Prevention [profiles](setup.md#creating-profiles)で定義された通常のボット保護が適用されます。
    * **Do not check for bot activity** - 記述されたURLやリクエスト種別に対しては、ボットの活動チェックが行われません。
4. 必要に応じて、コメント欄にこのURL/リクエスト種別に対してルールを作成した理由を記載します。

なお、ルールを削除することなく、URLやリクエスト種別に対する例外を一時的に無効化することができます。その場合、**Default**モードを選択してください。後でいつでも**Do not check for bot activity**に戻すことが可能です。

**ルールの例**

**リクエストヘッダーによる正当なボットの指定**

例えば、アプリケーションが複数のIPからリクエストを送信するKlaviyoマーケティングオートメーションツールと統合されているとします。そのため、特定のURIに対する`Klaviyo/1.0`ユーザーエージェントからのGETリクエストにおいて自動化（ボット）活動のチェックを行わないように設定します。

![特定のヘッダーを含むリクエストに対してボット活動をチェックしない](../images/user-guides/rules/api-abuse-url-request.png)

**テスト用エンドポイントに対するボット保護の無効化**

例えば、アプリケーションに属するエンドポイントがあり、アプリケーション全体はボット活動から保護されるべきですが、テスト用エンドポイントは例外とする必要があるとします。また、API在庫が[**API Discovery**](../api-discovery/overview.md)モジュールによって発見されています。 

この場合、**API Discovery**のエンドポイント一覧からルールを作成する方が簡単です。該当エンドポイントを探し、そのページからルール作成を開始してください。

![API Discoveryエンドポイント用Set API Abuse Prevention modeの作成](../images/user-guides/rules/api-abuse-url.png)

## プロファイルの無効化と削除

無効化されたプロファイルは、**API Abuse Prevention**モジュールがトラフィック分析中に使用しないものの、プロファイル一覧には表示されるものを指します。無効化されたプロファイルはいつでも再度有効化できます。有効なプロファイルが存在しない場合、モジュールは悪意のあるボットをブロックしません。

削除されたプロファイルは、復元不可能であり、**API Abuse Prevention**モジュールがトラフィック分析中に使用しないものです。

プロファイルメニュー内に**Disable**および**Delete**オプションが用意されています。