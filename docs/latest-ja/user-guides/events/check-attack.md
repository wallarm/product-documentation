```markdown
[link-using-search]:    ../search-and-filters/use-search.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload
[link-attacks]:         ../../user-guides/events/check-attack.md
[link-incidents]:       ../../user-guides/events/check-incident.md
[link-sessions]:        ../../api-sessions/overview.md

# 攻撃解析

この記事では、Wallarmノードが検出した攻撃をどのように解析し、適切な対応を実施できるかについて説明します。

### 攻撃解析

Wallarmプラットフォームが検出したすべての[攻撃](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)は、Wallarm Consoleの**Attacks**セクションに表示されます。攻撃日時、種類、その他の条件で[フィルタ](../../user-guides/search-and-filters/use-search.md)をかけ、任意の攻撃やそのリクエスト群を展開して詳細な解析を行うことが可能です。

もし検出された攻撃が[false positive](#false-positives)であると判明した場合、将来同様のfalse positiveを防止するために直ちにfalse positiveとしてマークできます。また、検出された攻撃に基づいてルールを作成したり、その他のWallarmの設定を実施してさらなる同様の脅威を軽減できます。

さらに、[active verification](../../vulnerability-detection/threat-replay-testing/overview.md)が有効な場合は、攻撃リスト上でその[状態](../../vulnerability-detection/threat-replay-testing/exploring.md#possible-statuses)を確認できます。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarmでは、以下のように定義されています：

* **Attack** は[ヒットのグループ](grouping-sampling.md#grouping-of-hits)です
* **Hit** は、Wallarmノードによって追加されたメタデータ付きの悪意あるリクエストです
* **Malicious payload** は、攻撃の兆候を含むリクエストの一部です

詳細については[こちら](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)をご覧ください。

各攻撃の詳細には、攻撃のヒットと悪意あるペイロードの概要など、解析に必要なすべての情報が含まれます。解析を簡素化するため、攻撃の詳細には一意のヒットのみが保存されます。同じ悪意あるリクエストが繰り返しアップロードされることはなく、Wallarm Cloudに送信も表示もされません。この処理は[ヒットサンプリング](grouping-sampling.md#sampling-of-hits)と呼ばれます。

ヒットサンプリングは攻撃検出の品質に影響せず、Wallarmノードはヒットサンプリングが有効な状態でもアプリケーションやAPIの保護を継続します。

## 脅威アクターの活動の全体像

--8<-- "../include/request-full-context.md"

## false positives

false positiveは、正当なリクエストに[攻撃の兆候](../../about-wallarm/protecting-against-attacks.md#library-libproton)が検出された場合に発生します。

将来、このようなリクエストが攻撃と認識されないようにするために、**攻撃のすべてまたは特定のリクエストをfalse positiveとしてマークできます**。これにより、類似のリクエストに対して同様の攻撃の兆候検出をスキップするルールが自動的に作成されますが、Wallarm Consoleには表示されません。

false positiveのマークは、適用後数秒以内であれば取り消すことができます。後で取り消す場合は、[Wallarm technical support](mailto: support@wallarm.com)へリクエストを送信する必要があります。

攻撃リストのデフォルト表示は、実際の攻撃（false positiveを除く）のみを表示します。表示内容を変更するには、**All attacks**内の**Default view**を**With false positives**または**Only false positives**に切り替えます。

![False positive filter](../../images/user-guides/events/filter-for-falsepositive.png)

## 攻撃への対応

アプリケーションやAPIが攻撃から十分に保護されているかを理解することは重要であり、必要に応じて保護対策を調整するための手段を講じる必要があります。**Attacks**セクションの情報を利用して、状況を把握し、適切に対応してください。

この作業を進める際には、どのタイプの攻撃が発生したかを特定する必要があります。そうすることで、Wallarmの保護メカニズムがどのような保護を提供しているかを把握し、必要に応じてこれらのメカニズムを調整できます。

1. **識別** - **Payload**フィールドのコンテキストメニューから**Show only**を選択し、**Type**フィルタと検索フィールドの内容に注目してください。
1. 保護がどのように実施されているか確認 - **Status**列をご確認ください：

    * `Blocked` - 攻撃のすべてのヒットがフィルタリングノードによりブロックされています。
    * `Partially blocked` - 攻撃の一部のヒットがブロックされ、他は登録のみされています。
    * `Monitoring` - 攻撃のすべてのヒットが登録されていますが、ブロックはされていません。
    * `Bot detected` - これはボットであり、攻撃内のアクションを確認してください。

1. 必要に応じて（推奨）、攻撃に関連する悪意あるリクエストの[全体の文脈](#full-context-of-threat-actor-activities)（どの[user session](../../api-sessions/overview.md)に属しているか、またそのセッション内のリクエストの全体的なシーケンス）を調査してください。

    これにより、脅威アクターのあらゆる活動やロジック、攻撃ベクターおよび危険にさらされるリソースを理解できます。

1. 実際の攻撃でないと考えられる場合は、[false positive](#false-positives)としてマークしてください。
1. **理解** - 攻撃を検出し、対応したWallarmメカニズムを把握してください。
1. **調整** - Wallarmの動作を調整してください（「方法」はメカニズムに依存します）。

| 識別 | 理解 | 調整 | 
| -- | -- | -- |
| `sqli`、`xss`、`rce`、`ptrav`、`crlf`、`nosqli`、`ssi` [等](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | [標準の攻撃検出ツール](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection)（libproton、libdetectionおよびルール） | 攻撃を展開し、攻撃および各リクエストのCVE概要を確認。ノードモード（`final_wallarm_mode`タグ）に注目し、**Rules**（[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)）を訪問、必要に応じてルールをアプリケーション名ごとに調整してください。 |
| [`custom_rule`](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | [カスタム攻撃検出器](../../user-guides/rules/regex-rule.md) | 攻撃を展開し、**Detected by custom rules**リンクをたどって、必要に応じてルールを[部分無効化](../../user-guides/rules/regex-rule.md#partial-disabling)してください。 |
| `vpatch` | [バーチャルパッチ](../../user-guides/rules/vpatch-rule.md) | **Rules**セクション（[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)）を訪問し、「Create virtual patch」のルールを検索、必要に応じて攻撃に関連するルールを調整してください。バーチャルパッチはフィルタリングモードに関係なく機能します。 |
| `brute`、<br>`dirbust`、<br>`bola`、<br>`multiple_payloads` | [Trigger](../../user-guides/triggers/triggers.md)およびIPリスト：[requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | 攻撃を展開し、リクエストを解析後、表示されるtrigger名をクリックしてパラメータを変更。triggerタグにも注意し、必要に応じて**Triggers**（[US](https://us1.my.wallarm.com/triggers)または[EU](https://my.wallarm.com/triggers)）でtriggerを見つけて調整する。<br>アクションが[`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)の場合はdenylistを通じて実施されるため、[US](https://us1.my.wallarm.com/ip-lists)または[EU](https://my.wallarm.com/ip-lists)の**IP Lists**を訪問し、IPを検索、必要に応じてIPのdenylist滞在期間を調整する。 |
| `blocked_source` | IPリスト：[requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | 攻撃を展開し、denylistに載っているIPからのリクエストを解析後、表示されるtrigger名をクリックし、必要に応じてtrigger設定を変更。手動でdenylistに登録されたIP（`blocked_source`）の場合、[US](https://us1.my.wallarm.com/ip-lists)または[EU](https://my.wallarm.com/ip-lists)の**IP Lists**を訪問し、IPを検索、必要に応じてIPのdenylist滞在期間を調整する。 |
| **特定のモジュールまたは機能：** |
| `api_abuse`、`account_takeover`、`security_crawlers`、`scraping`（[詳細](../../attacks-vulns-list.md#api-abuse)）<br> - すべての場合、**Bot detected**ステータスに注意 | [API Abuse Prevention](../../api-abuse-prevention/overview.md)およびIPリスト：[requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | 攻撃を展開し、[heatmaps](../../api-abuse-prevention/exploring-bots.md#attacks)でボットであることの[信頼性](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を確認、攻撃日時および送信元IPに注意。<br>アクションが[`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)の場合、denylistを通じて実施されるため、**IP Lists**にて日時とIPでフィルタし、**Reason**列をクリックしてIPアドレスの詳細を確認、その詳細をもとに**Triggered profile**を確認し、必要に応じて[変更](../../api-abuse-prevention/setup.md#creating-profiles)してください。<br><br>**また、以下の操作も可能です：**<br><ul><li>[Add source IP to exception list](../../api-abuse-prevention/exceptions.md)により、このIPを決してブロックしないように設定できます。例外リストからの削除も可能です（**API Abuse Prevention** → **Exception list**を参照）。</li><li>API abuse構成で自動的にブロックされる設定でなくても、送信元IPをdenylistに追加できます。</li></ul>**さらに、** **IP Lists**でIPアドレス自体をクリックすると、**Events**に戻り、関連する攻撃すべてを確認できます。 |
| `bola` | [API Discovery](../../api-discovery/overview.md)による[BOLA autoprotection](../../api-discovery/bola-protection.md) | 攻撃を展開し、triggerへのリンクが含まれていない場合（手動によるBOLA保護の兆候）には、これは[API Discovery](https://us1.my.wallarm.com/api-discovery)または[EU](https://my.wallarm.com/api-discovery)モジュールによる自動保護となります。必要に応じて、**BOLA Protection**セクション（[US](https://us1.my.wallarm.com/bola-protection)または[EU](https://my.wallarm.com/bola-protection)）を訪問し、自動保護の無効化または設定のテンプレート調整を行ってください。 |
| `undefined_endpoint`、`undefined_parameter`、`invalid_parameter_value`、`missing_parameter`、`missing_auth`、`invalid_request`（これらすべてを検索するには`api_specification`を使用、[詳細](../../attacks-vulns-list.md#api-specification)） | [API Specification Enforcement](../../api-specification-enforcement/overview.md) | 攻撃を展開し、違反した仕様へのリンクをたどってください。仕様ダイアログで**API specification enforcement**タブを使用して設定を調整し、**Specification upload**タブを使用して最新の仕様書をアップロードすることも検討してください。 |
| `gql_doc_size`、`gql_value_size`、`gql_depth`、`gql_aliases`、`gql_docs_per_batch`、`gql_introspection`、`gql_debug`（すべてを検索するには`graphql_attacks`を使用、[詳細](../../attacks-vulns-list.md#graphql-attacks)） | [GraphQL API Protection](../../api-protection/graphql-rule.md) | 攻撃を展開し、**GraphQL security policies**リンクをたどってください。必要に応じて、既存の**Detect GraphQL attacks**ルールを変更するか、特定のブランチ用に追加ルールを作成してください。 |

## API呼び出しによる攻撃の取得

攻撃の詳細を取得するために、Wallarm Console UIの利用に加えて、[Wallarm API](../../api/overview.md)を直接呼び出すことも可能です。以下は、**直近24時間に検出された最初の50件の攻撃を取得する**ためのAPI呼び出し例です。

`TIMESTAMP`は、直近24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください。

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "100件以上の攻撃を取得する場合"
    攻撃およびヒットセットに100件以上のレコードが含まれる場合、パフォーマンス最適化のため、膨大なデータセットを一度に取得するのではなく、小分けにデータを取得することが望ましいです。[該当するリクエスト例を確認してください](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)
```