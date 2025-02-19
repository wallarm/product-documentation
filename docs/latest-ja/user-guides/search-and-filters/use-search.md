[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]:         ../../attacks-vulns-list.md#brute-force-attack
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]:          ../../attacks-vulns-list.md#data-bomb
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]:       ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]:     ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]:        ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]:           ../../attacks-vulns-list.md#resource-overlimit
[email-injection]:        ../../attacks-vulns-list.md#email-injection
[ssi-injection]:          ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]:            ../../attacks-vulns-list.md#invalid-xml
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]:          ../../attacks-vulns-list.md#resource-overlimit

# イベント検索とフィルタ

Wallarmは検出されたイベント（attacksおよびincidents）を検索するための便利な方法を提供します。Wallarm Consoleの**Attacks**および**Incidents**セクションでは、以下の検索方法が利用可能です：

* **Filters**：フィルタ条件を選択するため
* **Search field**：人間の言語に近い属性や修飾子を使用した検索クエリを入力するため

フィルタに設定された値は自動的にSearch fieldに複製され、逆も同様です。

任意の検索クエリまたはフィルタの組み合わせは、**Save a query**をクリックすることで保存できます。

## フィルタ

利用可能なフィルタはWallarm Consoleで複数の形式で表示されます：

* **Filter**ボタンを使用して展開および折りたたみ可能なフィルタパネル
* 特定のパラメータ値を持つイベントのみを除外または表示するためのクイックフィルタ

![Filters in the UI](../../images/user-guides/search-and-filters/filters.png)

異なるフィルタの値が選択された場合、結果はそれらすべての条件を満たします。  
同一フィルタで複数の値が指定された場合、結果はそれらの条件のいずれかを満たします。

## Search field

Search fieldは、人間の言語に近い属性や修飾子を使用した検索クエリの入力を受け付け、クエリの提出を直感的に行えます。たとえば：

* `attacks xss`：すべての [XSS攻撃][al-xss] を検索するためです。  
* `attacks today`：本日に発生したすべての攻撃を検索するためです。  
* `xss 12/14/2020`：2020年12月14日における[クロスサイトスクリプティング][al-xss]の疑い、攻撃およびincidentsを検索するためです。  
* `p:xss 12/14/2020`：2020年12月14日時点で、xss HTTPリクエストパラメータ内（例：`http://localhost/?xss=attack-here`）の全タイプにおける疑い、攻撃およびincidentsを検索するためです。  
* `attacks 9-12/2020`：2020年9月から12月までのすべての攻撃を検索するためです。  
* `rce /catalog/import.php`：昨日以降の`/catalog/import.php`パスにおける[OSコマンド実行][al-rce]攻撃およびincidentsを検索するためです。

異なるパラメータの値が指定された場合、結果はすべての条件を満たします。  
同一パラメータで複数の値が指定された場合、結果はそれらの条件のいずれかを満たします。

!!! info "属性値をNOTに設定する"
    属性値を否定するには、属性や修飾子名の前に `!` を使用してください。たとえば：`attacks !ip:111.111.111.111` は `111.111.111.111` 以外の任意のIPアドレスから発生した攻撃を表示するためです。

以下に、検索クエリで使用可能な属性および修飾子の一覧を示します。

### オブジェクトタイプによる検索

検索文字列に以下を指定します：

* `attack`、`attacks`：既知の脆弱性を対象としていない攻撃のみを検索します。  
* `incident`、`incidents`：既知の脆弱性を悪用する攻撃（incidents）のみを検索します。

### 攻撃タイプによる検索

検索文字列に以下を指定します：

* `sqli`：[SQLインジェクション][al-sqli]攻撃を検索します。  
* `xss`：[XSS攻撃][al-xss]を検索します。  
* `rce`：[OSコマンド実行][al-rce]攻撃を検索します。  
* `brute`：[ブルートフォース][al-brute-force]攻撃およびこのタイプの攻撃により[denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)されたIPからのブロックリクエストを検索します。  
* `ptrav`：[パストラバーサル][al-path-traversal]攻撃を検索します。  
* `crlf`：[CRLFインジェクション][al-crlf]攻撃を検索します。  
* `redir`：[オープンリダイレクト][al-open-redirect]攻撃を検索します。  
* `nosqli`：[NoSQLインジェクション][al-nosqli]攻撃を検索します。  
* `data_bomb`：[ロジックボム][al-logic-bomb]攻撃を検索します。  
* `ssti`：[サーバーサイドテンプレートインジェクション][ssti-injection]を検索します。  
* `invalid_xml`：[安全でないXMLヘッダーの使用][invalid-xml]を検索します。  
* `overlimit_res`：[計算資源の過剰利用][al-overlimit]を狙った攻撃を検索します。  
* `xxe`：[XML外部実体][al-xxe]攻撃を検索します。  
* `vpatch`：[バーチャルパッチ][al-virtual-patch]を検索します。  
* `dirbust`：[強制ブラウジング][al-forced-browsing]攻撃およびこのタイプの攻撃により[denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)されたIPからのブロックリクエストを検索します。  
* `ldapi`：[LDAPインジェクション][al-ldapi]攻撃を検索します。  
* `scanner`：[ポートスキャナー][al-port-scanner]攻撃を検索します。  
* `infoleak`：[情報漏洩][al-infoleak]の攻撃を検索します。  
* `mail_injection`：[メールインジェクション][email-injection]を検索します。  
* `ssi`：[SSIインジェクション][ssi-injection]を検索します。  
* `overlimit_res`：[リソースの過剰制限][overlimit-res]タイプの攻撃を検索します。  
* `experimental`：[カスタム正規表現](../rules/regex-rule.md)に基づいて検出された実験的な攻撃を検索します。  
* `bola`：[BOLA (IDOR)脆弱性][../../attacks-vulns-list.md#broken-object-level-authorization-bola]を悪用する攻撃およびこのタイプの攻撃により[denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)されたIPからのブロックリクエストを検索します。  
* `mass_assignment`：[マスアサインメント][../../attacks-vulns-list.md#mass-assignment]攻撃の試行を検索します。  
* `api_abuse`：[疑わしいAPIアクティビティ][../../attacks-vulns-list.md#suspicious-api-activity]を検索します。  
* `account_takeover`（4.10.6以前は`api_abuse`）：[アカウント乗っ取り試行][../../attacks-vulns-list.md#account-takeover]を検索します。  
* `scraping`（4.10.6以前は`api_abuse`）：[スクレイピング試行][../../attacks-vulns-list.md#scraping]を検索します。  
* `security_crawlers`（4.10.6以前は`api_abuse`）：[セキュリティクローラーによるスキャン試行][../../attacks-vulns-list.md#security-crawlers]を検索します。  
* `ssrf`：[サーバーサイドリクエストフォージェリ（SSRF）][../../attacks-vulns-list.md#serverside-request-forgery-ssrf]の攻撃を検索します。  
* `blocked_source`：**手動**で[denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)されたIPからの攻撃を検索します。  
* `multiple_payloads`：[悪意のあるペイロード数](../../admin-en/configuration-guides/protecting-with-thresholds.md)トリガーによって検出された攻撃およびこのタイプの攻撃により[denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)されたIPからのブロックリクエストを検索します。  
* `credential_stuffing`：盗まれた認証資格情報を使用する試行（[credential stuffing](../../about-wallarm/credential-stuffing.md)）を検索します。  
* `ebpf`：[Wallarm eBPFベースのソリューション](../../installation/oob/ebpf/deployment.md)によって検出された攻撃を検索します。  
* <a name="graphql-tags"></a> `graphql_attacks`：組織のGraphQLポリシー（[GraphQLルール](../../api-protection/graphql-rule.md)）違反すべてを検索します。さらに、特定の違反は以下で検索できます：  
    * `gql_doc_size`：クエリ全体の最大許容サイズの違反  
    * `gql_value_size`：値の最大許容サイズの違反  
    * `gql_depth`：クエリの最大許容深度の違反  
    * `gql_aliases`：エイリアスの最大許容数の違反  
    * `gql_docs_per_batch`：バッチクエリの最大許容数の違反  
    * `gql_introspection`：禁止されたイントロスペクションクエリ  
    * `gql_debug`：禁止されたデバッグモードクエリ  
* <a name="spec-violation-tags"></a> `api_specification`：[仕様に基づく](../../api-specification-enforcement/overview.md)違反すべてを検索します。さらに、特定の違反は以下で検索できます：  
    * `undefined_endpoint`：仕様に記載されていないエンドポイントへのリクエスト試行  
    * `undefined_parameter`：仕様に記載されていないパラメータを含むため攻撃と判定されたリクエスト  
    * `missing_parameter`：仕様で必須とされているパラメータまたはその値が含まれていないため攻撃と判定されたリクエスト  
    * `invalid_parameter_value`：仕様で定義された型/形式に対応しないパラメータの値を含むため攻撃と判定されたリクエスト  
    * `missing_auth`：認証方式に関する必要な情報が含まれていないため攻撃と判定されたリクエスト  
    * `invalid_request`：無効なJSONを含むため攻撃と判定されたリクエスト  
    * 補助検索タグ - `processing_overlimit`：API Specification Enforcementは、リクエストと仕様の比較に制限を設けており、これらの制限を超えると、リクエストの処理を中止し、その旨のイベントを作成します。  
    * 参照：`spec:'<SPECIFICATION-ID>'` [こちら](#search-by-specification)

攻撃名は大文字小文字を区別せず指定可能です。たとえば、`SQLI`、`sqli`、`SQLi` はすべて正しいです。

### OWASPトップ脅威に関連する攻撃の検索

OWASP脅威タグを使用することで、OWASPトップ脅威に関連する攻撃を検索できます。これらの攻撃を検索する形式は `owasp_api1_2023` です。  
これらのタグはOWASPで定義された脅威の元の番号に対応しています。Wallarmは2023バージョンのOWASP APIトップ脅威に攻撃を関連付けます。

### 既知の攻撃（CVEおよび著名なエクスプロイト）による検索

* `known`：CVE脆弱性やその他の著名な脆弱性タイプを利用するため、正確に攻撃するリクエストを検索します。  

特定のCVEまたはその他の著名な脆弱性タイプによる攻撃をフィルタリングするには、`known`タグに加えて、またはそれとは別に適切なタグを渡すことができます。例：`known:CVE-2004-2402 CVE-2018-6008` または `CVE-2004-2402 CVE-2018-6008` は、[CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) および [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) 脆弱性を悪用する攻撃を検索します。

* `!known`：潜在的な誤検知。これらのリクエストには、あまり知られていないエクスプロイトや、エクスプロイトを正当なパラメータ値に変えるコンテキストが含まれている可能性があります。

CVEや著名なエクスプロイトによる攻撃をフィルタリングするには、イベントタイプおよび **CVE and exploits** のクイックフィルタを使用できます。

### APIプロトコルによるヒットの検索

APIプロトコルによってヒットをフィルタリングするには、`proto:`または`protocol:`タグを使用します。  
このタグでは以下の値を使用できます：

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### 認証プロトコルによるヒットの検索

攻撃者が使用した認証プロトコルによってヒットをフィルタリングするには、`auth:`タグを使用します。  
このタグでは以下の値を使用できます：

* `auth:none`
* `auth:api-key`
* `auth:aws`
* `auth:basic`
* `auth:bearer`
* `auth:cookie`
* `auth:digest`
* `auth:hawk`
* `auth:jwt`
* `auth:ntlm`
* `auth:oauth1`
* `auth:oauth2`
* `auth:scram`

### 攻撃対象による検索

検索文字列に以下を指定します：

* `client`：クライアントデータに対する攻撃を検索します。  
* `database`：データベース攻撃を検索します。  
* `server`：アプリサーバーへの攻撃を検索します。

### リスクレベルによる検索

検索文字列にリスクレベルを指定します：

* `low`：低リスクレベル  
* `medium`：中リスクレベル  
* `high`：高リスクレベル

### イベント時刻による検索

検索文字列に期間を指定します。期間が指定されていない場合、直近24時間に発生したイベントが検索対象となります。  
期間指定には以下の方法があります：

* 日付指定： `11/10/2020-11/14/2020`  
* 日付と時刻指定（秒は無視されます）： `11/10/2020 11:11`、`11:30-12:22`、`11/10/2020 11:12-01/14/2020 12:14`  
* 特定の時刻に対する指定： `>11/10/20`  
* 文字列エイリアスの使用：  
    * `yesterday`：昨日の日付と同等  
    * `today`：今日の日付と同等  
    * `last <unit>`：過去の単位の開始から現在までの期間と同等です。`<unit>` には `week`、`month`、`year` またはこれらの数値を使用できます。例： `last week`、`last 3 month` または `last 3 months`。  
    * `this <unit>`：現在の単位と同等です。`<unit>` には `week`、`month`、`year` を使用できます。例：今日が水曜日の場合、`this week` は今週の月曜日、火曜日、水曜日に検出されたイベントを返します。

日付と時刻の形式は、[profile](../settings/account.md)で指定された設定に依存します：

* **MDY** が選択されている場合：MM/DD/YYYY  
* **DMY** が選択されている場合：DD/MM/YYYY  
* **24‑hour** が選択されている場合：`13:00`  
* **24‑hour** が選択されていない場合：`1pm`

月は番号と名称の両方で指定できます：1月の場合は `01`、`1`、`January`、`Jan`。  
年は完全な形式（`2020`）および短縮形式（`20`）で指定可能です。  
日付に年が指定されていない場合、現在の年が使用されます。

### IPアドレスによる検索

IPアドレスによる検索を行うには、`ip:` プレフィックスを使用し、その後に以下を指定できます：

* 特定のIPアドレス、例：`192.168.0.1` — この場合、攻撃元のIPアドレスがこのアドレスに一致するすべての攻撃およびincidentsが検索されます。  
* IPアドレスの範囲を表す表現。  
* 攻撃またはincidentに関連するIPアドレスの総数。

#### IPアドレス範囲による検索

必要なIPアドレス範囲を設定するには、以下を使用できます：

* 明示的なIPアドレス範囲：  
    * `192.168.0.0-192.168.63.255`  
    * `10.0.0.0-10.255.255.255`
* IPアドレスの一部：  
    * `192.168.` — `192.168.0.0-192.168.255.255` と同等です。`*` 修飾子を使った冗長な形式も許容されます — `192.168.*`  
    * `192.168.0.` — `192.168.0.0-192.168.0.255` と同等です。
* 最後のオクテット内で値の範囲を指定した、IPアドレスまたはその一部：  
    * `192.168.1.0-255` — `192.168.1.0-192.168.1.255` と同等です。  
    * `192.168.0-255` — `192.168.0.0-192.168.255.255` と同等です。  
    
    !!! warning "重要"
        オクテット内で値の範囲を指定する場合、末尾にドットを付けません。

* サブネットプレフィックス（[CIDR表記](https://tools.ietf.org/html/rfc4632)）：  
    * `192.168.1.0/24` — `192.168.1.0-192.168.1.255` と同等です。  
    * `192.168.0.0/17` — `192.168.0.1-192.168.127.255` と同等です。

!!! note
    上記の方法を組み合わせてIPアドレス範囲を定義することが可能です。その場合、必要な各範囲を個別に`ip:` プレフィックス付きで列挙してください。
    
    **例**：`ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IPアドレスの数による検索

攻撃またはincidentに関連するIPアドレスの総数による検索（攻撃およびincidentのみ）が可能です：

* `ip:1000+ last month` — 過去1ヶ月間において、ユニークなIPアドレスの数が1000を超える攻撃およびincidentを検索します（`attacks incidents ip:1000+ last month` と同等）。  
* `xss ip:100+` — すべてのクロスサイトスクリプティング攻撃およびincidentを検索します。攻撃に使用されたIPアドレスの数（XSS攻撃タイプ）が100未満の場合、検索結果は空になります。  
* `xss p:id ip:100+` — idパラメータ（例：`?id=aaa`）に関連するすべてのXSS攻撃およびincidentを検索します。異なるIPアドレスの数が100を超える場合にのみ結果が返されます。

### IPアドレスの発信元データセンターによる検索

攻撃の発信元IPアドレスが属するデータセンターによる検索を行うには、`source:` プレフィックスを使用してください。  
この属性値は以下のいずれかです：

* `tor`: Torネットワーク  
* `proxy`: パブリックまたはウェブプロキシサーバー  
* `vpn`: VPN  
* `aws`: Amazon  
* `azure`: Microsoft Azure  
* `gce`: Google Cloud Platform  
* `ibm`: IBM Cloud  
* `alibaba`: Alibaba Cloud  
* `huawei`: Huawei Cloud  
* `rackspace`: Rackspace Cloud  
* `plusserver`: PlusServer  
* `hetzner`: Hetzner  
* `oracle`: Oracle Cloud  
* `ovh`: OVHcloud  
* `tencent`: Tencent  
* `linode`: Linode  
* `docean`: Digital Ocean

### IPアドレスが登録されている国または地域による検索

攻撃の発信元IPアドレスが登録されている国または地域による検索を行うには、`country:` プレフィックスを使用してください。  
国または地域名は、標準の[ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1)に従った形式（大文字または小文字）で属性に渡してください。例：中国からの攻撃の場合は `country:CN` または `country:cn` と指定します。

### 著名な悪意のあるIPから発信されたイベントの検索

Wallarmは悪意のある活動と広く関連付けられているIPアドレスを公共のリソースからスキャンし、その正確性を検証することで、これらのIPをdenylistに追加するなどの必要な対策を容易にします。  
これらの悪意のあるIPアドレスから発信されたイベントを検索するには、`source:malicious` タグを使用してください。これは**Malicious IPs**を意味し、denylistのソースタイプによるブロックのセクションでそのように命名されています。  
この情報は、以下のリソースを組み合わせて取得されます：

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### サーバーレスポンスステータスによる検索

サーバーレスポンスステータスによる検索を行うには、`statuscode:` プレフィックスを指定してください。  
レスポンスステータスは以下のように指定できます：

* 100から999の数値  
* N–M 範囲（NおよびMは100から999の数値）  
* N+ および N- 範囲（Nは100から999の数値）

### サーバーレスポンスサイズによる検索

サーバーレスポンスサイズによる検索を行うには、`s:`または`size:`プレフィックスを使用してください。  
任意の整数値で検索できます。999以上の数値はプレフィックスなしで指定可能です。N–M、N+、N- 範囲も指定でき、999以上の数値もプレフィックスなしで指定できます。

### HTTPリクエストメソッドによる検索

HTTPリクエストメソッドによる検索を行うには、`method:` プレフィックスを指定してください。  
`GET`、`POST`、`PUT`、`DELETE`、`OPTIONS` の検索の場合、すべて大文字で使用される場合はプレフィックスなしで検索文字列を指定できます。他の値の場合は、プレフィックスを指定する必要があります。

### 攻撃/incident内のヒット数による検索

攻撃およびincidentをヒット数で検索するには、`N:` プレフィックスを指定してください。  
たとえば、ヒット数が100を超える攻撃を検索するには：`attacks N:>100`、ヒット数が10未満の攻撃を検索するには：`attacks N:<10` と指定します。

### ドメインによる検索

ドメインによる検索を行うには、`d:`または`domain:`プレフィックスを使用してください。  
2次ドメイン以上のドメインであれば、任意の文字列をプレフィックスなしで指定できます。任意の文字列はプレフィックス付きでも指定できます。  
ドメイン内にマスクを使用することができます。シンボル `*` は任意の文字数を置き換え、シンボル `?` は任意の1文字を置き換えます。

### パスによる検索

パスによる検索を行うには、以下のいずれかを使用してください：

* `u:`または`url:`プレフィックスを使用し、`/`から始まる引用符で囲んだパスを指定する（例：`url:"/api/users"`）、または  
* 何も付けずに`/`から入力を開始する（例：`/api/users`）

### アプリケーションによる検索

攻撃が送信されたアプリケーションによる検索を行うには、`application:`または`app:`プレフィックス（以前の`pool:`プレフィックスはサポートされていますが推奨されません）を使用してください。  
属性値は、**Settings**セクションの**Applications**タブで設定されたアプリケーション名です。例：`application:'Example application'`

### パラメータまたはパーサーによる検索

パラメータまたはパーサーによる検索を行うには、`p:`、`param:`、または`parameter:`プレフィックス、もしくは`=`サフィックスを使用してください。サフィックスを使用する場合、`/`で始まらない文字列はパラメータとみなされ、末尾の`=`文字は値に含まれません。  
可能な属性値：

* 狙われたパラメータ名。  
    例： GETパラメータに`xss`を含むSQLインジェクション攻撃など、XSS攻撃自体を検索対象としないが、`xss`パラメータを狙った攻撃を検索する場合は、検索文字列に`attacks sqli p:xss`と指定します。  
* Wallarmノードがパラメータ値を読み取るために使用する[パーサー](../rules/request-processing.md)名。名前は大文字でなければなりません。  
    例：`attacks p:*BASE64` は、base64パーサーで解析された任意のパラメータを狙った攻撃を検索します。  
* パラメータとパーサーのシーケンス。  
    例：`attacks p:"POST_JSON_DOC_HASH_from"` は、リクエストのJSON本文中の`from`パラメータで送信された攻撃を検索します。

値内でマスクを使用することができます。シンボル`*`は任意の文字数を置き換え、シンボル`?`は任意の1文字を置き換えます。

### イベントの異常による検索

イベントの異常を検索するには、`a:`または`anomaly:`プレフィックスを使用してください。  
異常検索をさらに絞り込むには、以下のパラメータを使用してください：

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

例：  
`attacks sqli a:size` は、リクエストにおいてレスポンスサイズの異常があるすべてのSQLインジェクション攻撃を検索します。

### リクエスト識別子による検索

攻撃およびincidentをリクエスト識別子で検索するには、`request_id`プレフィックスを指定してください。  
`request_id`パラメータは`a79199bcea606040cc79f913325401fb`のような形式です。読みやすさのため、以下の例ではこのパラメータはプレースホルダー`<requestId>`に置き換えられています。

* `attacks incidents request_id:<requestId>`：`request_id`が`<requestId>`と等しい攻撃またはincidentを検索します。  
* `attacks incidents !request_id:<requestId>`：`request_id`が`<requestId>`と等しくない攻撃およびincidentを検索します。  
* `attacks incidents request_id`：任意の`request_id`を持つ攻撃およびincidentを検索します。  
* `attacks incidents !request_id`：`request_id`を持たない攻撃およびincidentを検索します。

### サンプルヒットによる検索

[サンプルヒット](../events/grouping-sampling.md#sampling-of-hits)を検索するには、検索文字列に`sampled`を追加してください。

### ノードUUIDによる検索

特定のノードによって検出された攻撃を検索するには、`node_uuid`プレフィックスに続けてノードUUIDを指定してください。

* `attacks incidents today node_uuid:<NODE UUID>`：この`<NODE UUID>`を持つノードによって本日に検出されたすべての攻撃およびincidentを検索します。  
* `attacks today !node_uuid:<NODE UUID>`：この`<NODE UUID>`を持たない任意のノードによって本日に検出されたすべての攻撃を検索します。

!!! info "新規攻撃のみの検索"
    ノードUUIDによる検索では、2023年5月31日以降に検出された攻撃のみが表示されます。

ノードUUIDは、**Nodes**セクションの[node details](../../user-guides/nodes/nodes.md#viewing-details-of-a-node)で確認できます。UUIDをクリックしてコピーするか、**View events from this node for the day**をクリックしてください（**Attacks**セクションに切り替わります）。

### 仕様による検索

特定の[仕様ポリシー違反](../../api-specification-enforcement/overview.md)に関連するイベントの一覧を取得するには、検索フィールドに `spec:'<SPECIFICATION-ID>'` と指定してください。  
`<SPECIFICATION-ID>` は、**API Specifications**で仕様を編集すると、ブラウザのアドレス欄に`specid`として表示されます。

![Specification - use for applying security policies](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

ブロックされたおよび監視されたイベントは、設定されたポリシー違反アクションに応じて表示される場合があります。イベントの詳細には、違反タイプとその原因となった仕様へのリンクが表示されます。

### 正規表現ベースのカスタマールールによる検索

[正規表現ベースのカスタマールール](../../user-guides/rules/regex-rule.md)によって検出された攻撃の一覧を取得するには、検索フィールドに`custom_rule`と指定してください。  
これらの攻撃の詳細には、対応するルールへのリンクが表示されます（複数存在する場合があります）。ルールの詳細にアクセスし、必要に応じて編集してください。

![Attack detected by regexp-based customer rule - editing rule](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

また、`!custom_rule` を使用すると、正規表現ベースのカスタマールールに関連しない攻撃の一覧を取得できます。