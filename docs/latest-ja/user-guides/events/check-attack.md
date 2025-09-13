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

# 攻撃の分析

本記事では、Wallarmノードが検知した攻撃をどのように分析し、それらに対してどのような対応を取れるかを説明します。

### 攻撃の分析

Wallarmプラットフォームが検知した[攻撃](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)は、Wallarm Consoleの**Attacks**セクションにすべて表示されます。攻撃日時、種類などの条件でリストを[フィルタ](../../user-guides/search-and-filters/use-search.md)し、任意の攻撃およびその含まれるリクエストを展開して詳細に分析できます。

検知された攻撃が[誤検知](#false-positives)であると判明した場合は、将来の同様の誤検知を防ぐために直ちに誤検知としてマークできます。また、検知された攻撃に基づいてルールを作成するなど、Wallarmの設定を実施して今後の同様の脅威を軽減できます。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarmにおいて：
* **Attack**は、Hitの[グループ](grouping-sampling.md#grouping-of-hits)です
* **Hit**は、ノードが付与したメタデータを含む悪意あるリクエストです
* **Malicious payload**は、攻撃の兆候を含むリクエストの一部です

詳細は[こちら](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)をご覧ください。

各攻撃の詳細には、攻撃のHitやMalicious payloadの概要など、分析に必要な情報がすべて含まれています。分析を容易にするため、攻撃の詳細には一意のHitのみが保存されます。繰り返しの悪意あるリクエストはWallarm Cloudへのアップロードから除外され、表示されません。この処理は[ヒットのサンプリング](grouping-sampling.md#sampling-of-hits)と呼ばれます。

ヒットのサンプリングは攻撃検知の品質に影響せず、有効化されていてもWallarmノードは引き続きアプリケーションやAPIを保護します。

## 脅威アクター活動の全コンテキスト

--8<-- "../include/request-full-context.md"

## 誤検知

誤検知とは、正当なリクエスト内に[攻撃の兆候](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)が検出される場合を指します。

将来的にフィルタリングノードがそのようなリクエストを攻撃として認識しないようにするため、**攻撃に含まれるすべて、または特定のリクエストを誤検知としてマークできます**。これにより、類似のリクエストで類似の攻撃兆候の検出をスキップするルールが自動的に作成されますが、Wallarm Consoleには表示されません。

誤検知としてのマークは、適用後数秒以内のみ取り消せます。後で取り消したい場合は、[Wallarmテクニカルサポート](mailto: support@wallarm.com)への依頼でのみ対応できます。

攻撃リストのデフォルトビューでは、実際の攻撃（誤検知を除く）のみが表示されます。変更するには、**All attacks**で**Default view**から**With false positives**または**Only false positives**に切り替えます。

![誤検知フィルタ](../../images/user-guides/events/filter-for-falsepositive.png)

## 攻撃への対応

必要に応じて防御策を調整できるよう、アプリケーションやAPIが攻撃から適切に保護されているかを把握することは重要です。**Attacks**セクションの情報を用いて状況を把握し、適切に対応できます。

この作業にあたっては、どのタイプの攻撃が発生したのかを特定する必要があります。そうすることで、どのWallarmのメカニズムが防御に寄与したかを理解し、必要に応じてそれらを調整できます。

1. **Identify** - **Payload**フィールドのコンテキストメニューで**Show only**を選択し、**Type**フィルタと検索フィールドの内容に注意します。
1. 何が防御として行われたかを確認します - **Status**列を確認します:

    * `Blocked` - 攻撃のすべてのHitがフィルタリングノードによりブロックされました。
    * `Partially blocked` - 一部のHitはブロックされ、他は記録のみされました。
    * `Monitoring` - すべてのHitが記録されましたが、ブロックはされていません。
    * `Bot detected` - これはボットです。攻撃内のactionを確認します。

1. 任意（推奨）で、攻撃の悪意あるリクエストの[全コンテキストを調査](#full-context-of-threat-actor-activities)します: それらがどの[ユーザーセッション](../../api-sessions/overview.md)に属するか、そのセッションにおけるリクエストの完全なシーケンスは何かを確認します。

    これにより、脅威アクターの全活動とロジックを把握し、攻撃ベクトルや侵害されうるリソースを理解できます。

1. 実際の攻撃ではないと判断した場合は、[誤検知](#false-positives)としてマークします。
1. **Understand** - 攻撃を検知し反応したWallarmのメカニズムを把握します。
1. **Adjust** - Wallarmの振る舞いを調整します（具体的な方法はメカニズムに依存します）。

| 特定 | 理解 | 調整 |
| -- | -- | -- |
| `sqli`, `xss`, `rce`, `ptrav`, `crlf`, `nosqli`, `ssi` [など](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | [攻撃検知の標準ツール](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection)（libproton、libdetection、rules） | 攻撃を展開し、攻撃全体の[CVE](../../demo-videos/events-inspection.md)サマリーや各リクエストのCVEを確認します。ノードモード（`final_wallarm_mode`タグ）に注意し、**Rules**（[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)）を開いて、攻撃に紐づくアプリケーション名で分析します。必要に応じて、アプリケーションや特定のホスト・エンドポイント単位でルールや[フィルタリングモード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を調整します。 |
| [`custom_rule`](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | [カスタム攻撃検知器](../../user-guides/rules/regex-rule.md) | 攻撃を展開し、**Detected by custom rules**リンクをたどります。必要に応じて、ルールを[変更](../../user-guides/rules/regex-rule.md)したり、特定のブランチに対して[部分的に無効化](../../user-guides/rules/regex-rule.md#partial-disabling)したりします。 |
| `vpatch` | [Virtual patch](../../user-guides/rules/vpatch-rule.md) | **Rules**セクション（[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)）を開き、「Create virtual patch」ルールを検索します。必要に応じて、該当攻撃に関連するルールを調整します。なお、Virtual patchはフィルタリングモードに関係なく動作します。 |
| `brute`,<br>`dirbust`,<br>`bola`,<br>`multiple_payloads` | [Trigger](../../user-guides/triggers/triggers.md)とIP lists: [requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | 攻撃を展開し、リクエストを分析した後、表示されているトリガー名（表示がある場合）をクリックして、そのパラメータを変更します。トリガーのタグにも留意し、**Triggers**（[US](https://us1.my.wallarm.com/triggers)または[EU](https://my.wallarm.com/triggers)）に移動して名前で検索し、必要に応じて調整します。<br>actionが[`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)の場合はdenylistによるものです。**IP Lists**（[US](https://us1.my.wallarm.com/ip-lists)または[EU](https://my.wallarm.com/ip-lists)）に移動してIPで検索し、必要に応じてdenylistに留めておく期間を調整します。 |
| `blocked_source` | IP lists: [requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | 攻撃を展開し、denylistに入っているIPからのリクエストを分析します。その後、表示されているトリガー名をクリックし、必要に応じてトリガー設定を変更します。手動でdenylistに入れたIP（`blocked_source`）の場合は、**IP Lists**（[US](https://us1.my.wallarm.com/ip-lists)または[EU](https://my.wallarm.com/ip-lists)）に移動してIPで検索し、必要に応じてdenylistに留めておく期間を調整します。 |
| **特定のモジュールまたは機能:** |
| `api_abuse`, `account_takeover`, `security_crawlers`, `scraping`, `resource_consumption`（[詳細](../../attacks-vulns-list.md#api-abuse)）<br> - すべてで**Bot detected**ステータスに留意 | [API Abuse Prevention](../../api-abuse-prevention/overview.md)とIP lists: [requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | 攻撃を展開し、ボットであることの[確信度](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を示す[ヒートマップ](../../api-abuse-prevention/exploring-bots.md#attacks)を分析し、攻撃日時と送信元IPに留意します。<br>actionが[`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)の場合はdenylistによるものです。**IP lists**に移動し、日付とIPでフィルタし、**Reason**列をクリックしてIPアドレスの詳細を確認・精査し、**Triggered profile**をクリックして内容を確認し、必要に応じて[変更](../../api-abuse-prevention/setup.md#creating-profiles)します。<br><br>**さらに可能な対応:**<br><ul><li>送信元IPを[exception listに追加](../../api-abuse-prevention/exceptions.md)して、このIPがブロックされないようにします。逆に、**API Abuse Prevention** → **Exception list**から除外することもできます。</li><li>API Abuseの設定で自動denylist化されない場合でも、送信元IPをdenylistに追加します。</li></ul>**加えて**、**IP Lists**でIPアドレス自体をクリックすると**Events**に戻り、関連するすべての攻撃を確認できます。 |
| `bola` | [API Discovery](../../api-discovery/overview.md)による[BOLAの自動防御](../../api-discovery/bola-protection.md) | 攻撃を展開し、トリガーへのリンクが含まれていない場合（BOLAに対する手動防御のサインがない場合）は、**API Discovery**（[US](https://us1.my.wallarm.com/api-discovery)または[EU](https://my.wallarm.com/api-discovery)）モジュールによる自動防御です。必要に応じて、**BOLA Protection**（[US](https://us1.my.wallarm.com/bola-protection)または[EU](https://my.wallarm.com/bola-protection)）に移動し、この防御を無効化するか、その設定テンプレートを調整します。 |
| `undefined_endpoint`, `undefined_parameter`, `invalid_parameter_value`, `missing_parameter`, `missing_auth`, `invalid_request`（すべてを検索するには`api_specification`、[詳細](../../attacks-vulns-list.md#api-specification)） | [API Specification Enforcement](../../api-specification-enforcement/overview.md) | 攻撃を展開し、違反した仕様へのリンクをたどります。仕様のダイアログで、**API specification enforcement**タブを使用して設定を調整し、**Specification upload**タブから最新の仕様バージョンのアップロードを検討します。 |
| `gql_doc_size`, `gql_value_size`, `gql_depth`, `gql_aliases`, `gql_docs_per_batch`, `gql_introspection`, `gql_debug`（すべてを検索するには`graphql_attacks`、[詳細](../../attacks-vulns-list.md#graphql-attacks)） | [GraphQL API Protection](../../api-protection/graphql-rule.md) | 攻撃を展開し、**GraphQL security policies**リンクをたどります。必要に応じて、既存の**Detect GraphQL attacks**ルールを変更するか、特定のブランチ向けに追加のルールを作成します。 |
| `credential_stuffing` | [Credential Stuffing Detection](../../about-wallarm/credential-stuffing.md) | 攻撃を展開し、試行された漏えい認証情報の一覧を確認します。Credential Stuffing（[US](https://wallarm.us1.wallarm.com/credential-stuffing)、[EU](https://my.wallarm.com/credential-stuffing) Cloud）セクションに移動し、[設定](../../about-wallarm/credential-stuffing.md#configuring)、特に監視対象の認証エンドポイントのリストとその推奨、漏えい認証情報に関する通知設定を確認します。 |

## ダッシュボード

Wallarmは、検知された攻撃の分析に役立つ包括的なダッシュボードを提供します。

Wallarmの[Threat Prevention](../../user-guides/dashboards/threat-prevention.md)ダッシュボードは、攻撃の送信元、対象、タイプ、プロトコルなど、多面的な情報を含むシステムのセキュリティ状況に関する一般的な指標を提供します。

![Threat Preventionダッシュボード](../../images/user-guides/dashboard/threat-prevention.png)

[OWASP API Security Top 10](../../user-guides/dashboards/owasp-api-top-ten.md)ダッシュボードは、攻撃情報を含むOWASP API Top 10の脅威に対するシステムのセキュリティ状況を詳細に可視化します。

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## 通知

Wallarmは、検知された攻撃、Hit、Malicious payloadに関する通知を送信できます。これにより、システムへの攻撃試行を把握し、検知された悪意あるトラフィックを迅速に分析できます。悪意あるトラフィックの分析には、誤検知の報告、正当なリクエストの送信元IPのallowlist追加、攻撃送信元IPのdenylist追加が含まれます。

通知を設定するには:

1. 通知送信先となるシステムとの[ネイティブ連携](../../user-guides/settings/integrations/integrations-intro.md)を設定します（例: PagerDuty、Opsgenie、Splunk、Slack、Telegram）。
2. 通知送信の条件を設定します:

    * 検知された各Hitについて通知を受け取るには、連携設定で該当オプションを選択します。

        ??? info "Hit検知通知のJSON形式の例"
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
    
    * 攻撃・Hit・Malicious payloadの件数にしきい値を設定し、それを超過したときに通知を受け取るには、適切な[トリガー](../../user-guides/triggers/triggers.md)を構成します。

## API呼び出し

攻撃の詳細を取得するには、Wallarm ConsoleのUIを使用する以外に、[Wallarm APIを直接呼び出す](../../api/overview.md)こともできます。以下は、過去24時間に検知された攻撃のうち最初の50件を取得するAPI呼び出しの例です。

`TIMESTAMP`は、24時間前の日付を[Unixタイムスタンプ](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください。

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "100件以上の攻撃の取得"
    攻撃やHitのレコードが100件以上になる場合は、パフォーマンス最適化のため、一度に大きなデータセットを取得するのではなく小分けに取得するのが最適です。[該当するリクエスト例をご確認ください](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)