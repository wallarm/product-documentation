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

# イベントの検索とFilters

Wallarmは、検出されたイベント（攻撃とインシデント）を検索するための便利な方法を提供します。Wallarm Consoleの**Attacks**および**Incidents**セクションでは、次の検索方法が利用できます:

* **Filters**で絞り込み条件を選択します
* **Search field**に、人間の言語に近い属性や修飾子を用いた検索クエリを入力します

filtersで設定した値はSearch fieldに自動的に反映され、その逆も同様です。

任意の検索クエリやフィルターの組み合わせは、**Save a query**をクリックして保存できます。

## Filters

利用可能なfiltersは、Wallarm Consoleで複数の形式で提供されています:

* **Filter**ボタンで展開・折りたたみできるFilters panel
* 特定のパラメータ値を持つイベントのみを除外・表示するためのQuick filters

![UIのFilters](../../images/user-guides/search-and-filters/filters.png)

異なるfiltersの値を選択すると、結果はそれらすべての条件を満たします。同じfilterに対して異なる値を指定すると、結果はそのいずれかの条件を満たします。

## Search field

Search fieldは、人間の言語に近い属性や修飾子を持つクエリを受け付けるため、直感的にクエリを入力できます。例:

* `attacks xss`: すべての[XSS攻撃][al-xss]を検索します
* `attacks today`: 本日発生したすべての攻撃を検索します
* `xss 12/14/2020`: 2020年12月14日の[クロスサイトスクリプティング][al-xss]の疑い、攻撃、インシデントをすべて検索します
* `p:xss 12/14/2020`: 2020年12月14日時点で、xssというHTTPリクエストパラメータ（例: `http://localhost/?xss=attack-here`）に含まれるすべての種類の疑い、攻撃、インシデントを検索します
* `attacks 9-12/2020`: 2020年9月から12月までのすべての攻撃を検索します
* `rce /catalog/import.php`: 昨日以降の`/catalog/import.php`パスに対するすべての[RCE][al-rce]攻撃とインシデントを検索します

異なるパラメータの値を指定すると、結果はそれらすべての条件を満たします。同じパラメータに対して異なる値を指定すると、結果はそのいずれかの条件を満たします。

!!! info "属性値をNOTに設定する"
    属性値を否定するには、属性または修飾子名の前に`!`を使用します。例: `attacks !ip:111.111.111.111`は、`111.111.111.111`を除く任意のIPアドレスから発生したすべての攻撃を表示します。

以下に、検索クエリで使用できる属性と修飾子の一覧を示します。

### オブジェクトタイプで検索

検索文字列に指定します:

* `attack`, `attacks`: 既知の脆弱性を狙っていない攻撃のみを検索します。
* `incident`, `incidents`: インシデント（既知の脆弱性を悪用する攻撃）のみを検索します。

### 攻撃タイプで検索

検索文字列に指定します:

* `sqli`: [SQLインジェクション][al-sqli]攻撃を検索します。
* `xss`: [クロスサイトスクリプティング][al-xss]攻撃を検索します。
* `rce`: [OS Commanding][al-rce]攻撃を検索します。
* `brute`: [ブルートフォース][al-brute-force]攻撃および、この種の攻撃により[denylistに登録された](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)IPからのブロック済みリクエストを検索します。
* `ptrav`: [パストラバーサル][al-path-traversal]攻撃を検索します。
* `crlf`: [CRLFインジェクション][al-crlf]攻撃を検索します。
* `redir`: [オープンリダイレクト][al-open-redirect]攻撃を検索します。
* `nosqli`: [NoSQLインジェクション][al-nosqli]攻撃を検索します。
* `data_bomb`: [ロジックボム][al-logic-bomb]攻撃を検索します。
* `ssti`: [Server‑Side Template Injection][ssti-injection]を検索します。
* `invalid_xml`: [安全でないXMLヘッダーの使用][invalid-xml]を検索します。
* `overlimit_res`: [計算リソースの上限超過][al-overlimit]を狙った攻撃を検索します。
* `xxe`: [XML External Entity][al-xxe]攻撃を検索します。
* `vpatch`: [仮想パッチ][al-virtual-patch]を検索します。
* `dirbust`: [強制ブラウジング][al-forced-browsing]攻撃および、この種の攻撃により[denylistに登録された](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)IPからのブロック済みリクエストを検索します。
* `ldapi`: [LDAPインジェクション][al-ldapi]攻撃を検索します。
* `scanner`: [ポートスキャナー][al-port-scanner]攻撃を検索します。
* `infoleak`: [情報漏えい][al-infoleak]の攻撃を検索します。
* `mail_injection`: [Email Injection][email-injection]を検索します。
* `ssi`: [SSI Injection][ssi-injection]を検索します。
* `overlimit_res`: [resource overlimit][overlimit-res]タイプの攻撃を検索します。
* `experimental`: [カスタム正規表現](../rules/regex-rule.md)に基づいて検出された実験的な攻撃を検索します。
* `bola`: [BOLA（IDOR）脆弱性](../../attacks-vulns-list.md#broken-object-level-authorization-bola)を悪用する攻撃および、この種の攻撃により[denylistに登録された](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)IPからのブロック済みリクエストを検索します。
* `mass_assignment`: [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)攻撃の試行を検索します。
* `api_abuse`: [不審なボット活動](../../attacks-vulns-list.md#suspicious-api-activity)を検索します。
* `account_takeover`（4.10.6以前は`api_abuse`）: [アカウント乗っ取りの試行](../../attacks-vulns-list.md#account-takeover)を検索します。
* `scraping`（4.10.6以前は`api_abuse`）: [スクレイピングの試行](../../attacks-vulns-list.md#scraping)を検索します。
* `security_crawlers`（4.10.6以前は`api_abuse`）: [セキュリティクローラによるスキャン試行](../../attacks-vulns-list.md#security-crawlers)を検索します。
* `resource_consumption`: [無制限なリソース消費](../../attacks-vulns-list.md#unrestricted-resource-consumption)のボットによる試行を検索します。
* `ssrf`: [Server‑side Request Forgery（SSRF）および攻撃](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)を検索します。
* `blocked_source`: **手動で**[denylistに登録された](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)IPからの攻撃を検索します。
* `multiple_payloads`: [Number of malicious payloads](../../admin-en/configuration-guides/protecting-with-thresholds.md)トリガーで検出された攻撃および、この種の攻撃により[denylistに登録された](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)IPからのブロック済みリクエストを検索します。
* `credential_stuffing`: 盗まれた認証情報の使用（[credential stuffing](../../about-wallarm/credential-stuffing.md)）の試行を検索します。
* `ebpf`: [WallarmのeBPFベースのソリューション](../../installation/oob/ebpf/deployment.md)で検出された攻撃を検索します。
* `file_upload_violation`: [ファイルアップロード制限ポリシー](../../api-protection/file-upload-restriction.md)違反を検索します。
* <a name="graphql-tags"></a>`graphql_attacks`: [組織のGraphQLポリシー](../../api-protection/graphql-rule.md)のすべての違反を検索します。さらに、特定の違反は次で検索できます:
    * `gql_doc_size`: 許可されている合計クエリサイズの最大値の違反
    * `gql_value_size`: 許可されている値サイズの最大値の違反
    * `gql_depth`: 許可されているクエリ深度の最大値の違反
    * `gql_aliases`: 許可されているエイリアス数の最大値の違反
    * `gql_docs_per_batch`: 許可されているバッチクエリ数の最大値の違反
    * `gql_introspection`: 禁止されたイントロスペクションクエリ
    * `gql_debug`: 禁止されたデバッグモードクエリ
* <a name="spec-violation-tags"></a>`api_specification`: [仕様に基づく](../../api-specification-enforcement/overview.md)すべての違反を検索します。さらに、特定の違反は次で検索できます:
    * `undefined_endpoint`: 仕様に存在しないエンドポイントへのリクエスト試行
    * `undefined_parameter`: 指定のエンドポイントに仕様上存在しないパラメータを含むため攻撃と判定されたリクエスト
    * `missing_parameter`: 仕様で必須とされたパラメータまたはその値が含まれていないため攻撃と判定されたリクエスト
    * `invalid_parameter_value`: パラメータの値が仕様で定義された型/フォーマットに合致しないため攻撃と判定されたリクエスト
    * `missing_auth`: 必要な認証方式に関する情報を含まないため攻撃と判定されたリクエスト
    * `invalid_request`: 不正なJSONを含むため攻撃と判定されたリクエスト
    * 補助検索タグ - `processing_overlimit`: API Specification Enforcementは、リクエストと仕様の突き合わせに制限を適用します。これらの制限を超えると処理を停止し、それを通知するイベントを作成します
    * 参考: `spec:'<SPECIFICATION-ID>'`は[こちら](#search-by-specification)

攻撃名は大文字・小文字のいずれでも指定できます。`SQLI`、`sqli`、`SQLi`はいずれも同等に正しいです。

### OWASP主要脅威に関連する攻撃の検索

OWASPの脅威タグを使用して、OWASP主要脅威に関連する攻撃を検索できます。検索形式は`owasp_api1_2023`です。

これらのタグは、OWASPが定義する脅威の元の番号付けに対応します。Wallarmは、2023年版のOWASP API Top脅威に攻撃を関連付けます。

### 既知の攻撃（CVEと著名なエクスプロイト）で検索

* `known`: CVE脆弱性やその他の著名な脆弱性タイプを悪用するため、明確に攻撃であるリクエストを検索します。

    特定のCVEまたは別の著名な脆弱性タイプで攻撃を絞り込むには、`known`タグに加えて、または別々に該当するタグを指定します。例: `known:CVE-2004-2402 CVE-2018-6008` または `CVE-2004-2402 CVE-2018-6008` は、[CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) と [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) 脆弱性を悪用する攻撃を検索します。
* `!known`: 潜在的な誤検知です。あまり知られていないエクスプロイトを含む、またはコンテキストによりエクスプロイトが正当なパラメータ値に見えるリクエストです。

CVEや著名なエクスプロイトで攻撃を絞り込むには、イベントタイプおよび**CVE and exploits**のQuick filtersを使用できます。

### APIプロトコル別にHitsを検索

APIプロトコルでHitsを絞り込むには、`proto:`または`protocol:`タグを使用します。

このタグでは次の値を使用できます:

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### 認証プロトコル別にHitsを検索

攻撃者が使用した認証プロトコルでHitsを絞り込むには、`auth:`タグを使用します。

このタグでは次の値を使用できます:

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

### 攻撃対象で検索

検索文字列に指定します:

* `client`: クライアントのデータに対する攻撃を検索します。
* `database`: データベースに対する攻撃を検索します。
* `server`: アプリケーションサーバーに対する攻撃を検索します。

### リスクレベルで検索

検索文字列にリスクレベルを指定します:

* `low`: 低リスクレベル。
* `medium`: 中リスクレベル。
* `high`: 高リスクレベル。

### イベント時刻で検索

検索文字列に期間を指定します。期間を指定しない場合、直近24時間に発生したイベントが対象になります。

期間の指定方法は次のとおりです:

* 日付で指定: `11/10/2020-11/14/2020`
* 日付と時刻で指定（秒は無視）: `11/10/2020 11:11`, `11:30-12:22`, `11/10/2020 11:12-01/14/2020 12:14`
* 特定の時点に対する相対指定: `>11/10/20`
* 文字列エイリアスを使用:
    * `yesterday`: 昨日の日付
    * `today`: 今日の日付
    * `last <unit>`: 直前の単位の開始から現在までの期間

        `<unit>`には`week`、`month`、`year`またはそれらの数値を使用できます。例: `last week`、`last 3 month`または`last 3 months`。
    
    * `this <unit>`: 現在の単位

        `<unit>`には`week`、`month`、`year`を使用できます。例: 今日が水曜日の場合、`this week`は今週の月曜・火曜・水曜に検出されたイベントを返します。

日付と時刻の形式は、[profile](../settings/account.md)で指定した設定に依存します:

* **MDY**が選択されている場合はMM/DD/YYYY
* **DMY**が選択されている場合はDD/MM/YYYY
* **24‑hour**にチェックがある場合は`13:00`
* **24‑hour**にチェックがない場合は`1pm`

月は数字と名称のいずれでも指定できます。1月なら`01`、`1`、`January`、`Jan`です。年は完全表記（`2020`）と短縮表記（`20`）のいずれでも指定できます。日付に年が指定されていない場合は、現在の年が使用されます。

### IPアドレスで検索

IPアドレスで検索するには、`ip:`プレフィックスを使用し、その後に次のいずれかを指定します
*   特定のIPアドレス（例: `192.168.0.1`）—この場合、そのIPアドレスに一致する攻撃元アドレスを持つすべての攻撃とインシデントが見つかります。
*   IPアドレス範囲を表す式。
*   攻撃またはインシデントに関連するIPアドレスの総数。

#### IPアドレス範囲で検索

必要なIPアドレス範囲を設定するには、次を使用できます
*   明示的なIPアドレス範囲:
    *   `192.168.0.0-192.168.63.255`
    *   `10.0.0.0-10.255.255.255`
*   IPアドレスの一部:
    *   `192.168.`—`192.168.0.0-192.168.255.255`と同等。`*`修飾子を用いた冗長形式`192.168.*`も使用可能です
    *   `192.168.0.`—`192.168.0.0-192.168.0.255`と同等
*   IPアドレスまたはその一部において、式の最後のオクテット内で値の範囲を指定:
    *   `192.168.1.0-255`—`192.168.1.0-192.168.1.255`と同等
    *   `192.168.0-255`—`192.168.0.0-192.168.255.255`と同等
    
    !!! warning "重要"
        1つのオクテット内で値の範囲を使用する場合、末尾にドットは付けません。

*   サブネットプレフィックス（[CIDR表記](https://tools.ietf.org/html/rfc4632)）:
    *   `192.168.1.0/24`—`192.168.1.0-192.168.1.255`と同等
    *   `192.168.0.0/17`—`192.168.0.1-192.168.127.255`と同等

!!! note
    上記のIPアドレス範囲の定義方法は組み合わせて使用できます。その場合は、必要な各範囲を`ip:`プレフィックス付きで個別に列挙します。
    
    **例**: `ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IPアドレス数で検索

攻撃またはインシデントに関連するIPアドレスの総数で検索できます（攻撃とインシデントのみ）:
*   `ip:1000+ last month`—過去1か月において、一意のIPアドレス数が1000を超える攻撃とインシデントを検索します（`attacks incidents ip:1000+ last month`と同等）。
*   `xss ip:100+`—すべてのクロスサイトスクリプティング攻撃とインシデントを検索します。XSS攻撃タイプの攻撃元IPアドレス数が100未満の場合、検索結果は空になります。
*   `xss p:id ip:100+`—`id`パラメータ（`?id=aaa`）に関連するすべてのXSS攻撃とインシデントを検索します。異なるIPアドレスの数が100を超える場合にのみ結果が返されます。

### 攻撃元IPアドレスが属するデータセンターで検索

攻撃を発生させたIPアドレスが属するデータセンターで検索するには、`source:`プレフィックスを使用します。

この属性値には次を指定できます:

* `tor` Torネットワーク
* `proxy` パブリックまたはWebプロキシサーバー
* `vpn` VPN
* `aws` Amazon
* `azure` Microsoft Azure
* `gce` Google Cloud Platform
* `ibm` IBM Cloud
* `alibaba` Alibaba Cloud
* `huawei` Huawei Cloud
* `rackspace` Rackspace Cloud
* `plusserver` PlusServer
* `hetzner` Hetzner
* `oracle` Oracle Cloud
* `ovh` OVHcloud
* `tencent` Tencent
* `linode` Linode
* `docean` Digital Ocean

### IPアドレスが登録されている国または地域で検索

攻撃を発生させたIPアドレスが登録されている国または地域で検索するには、`country:`プレフィックスを使用します。

国/地域名は、標準[ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1)に対応する形式で大文字・小文字のいずれでも指定します。例: 中国からの攻撃の場合は`country:CN`または`country:cn`。

### 悪意のあることで知られるIPからのイベントを検索

Wallarmは、公知の悪意のある活動に関連付けられていると広く認識されているIPアドレスについて公開リソースをスキャンします。その後、この情報の正確性を検証し、これらのIPのdenylist登録など必要な対応を容易にします。

これらの悪意のあるIPアドレスから発生したイベントを検索するには、`source:malicious`タグを使用します。これはMalicious IPsを表し、denylistの「ソースタイプによるブロック」のセクションでも同名で表示されます。

このオブジェクトのデータは、以下のリソースの組み合わせから取得しています:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### サーバーレスポンスステータスで検索

サーバーレスポンスステータスで検索するには、`statuscode:`プレフィックスを指定します。

レスポンスステータスは次のように指定できます:
* 100から999までの数値
* 「N–M」範囲（NとMは100から999までの数字）
* 「N+」および「N-」範囲（Nは100から999までの数字）

### サーバーレスポンスサイズで検索

サーバーレスポンスサイズで検索するには、`s:`または`s ize:`プレフィックスを使用します。

任意の整数値で検索できます。999を超える数値はプレフィックスなしで指定できます。数値が999を超える場合でも「N–M」「N+」「N-」の範囲をプレフィックスなしで指定できます。

### HTTPリクエストメソッドで検索

HTTPリクエストメソッドで検索するには、`method:`プレフィックスを指定します。

`GET`、`POST`、`PUT`、`DELETE`、`OPTIONS`を検索する場合、大文字で指定すればプレフィックスなしで検索文字列を指定できます。それ以外の値についてはプレフィックスを指定してください。

### 攻撃/インシデント内のHits数で検索

攻撃やインシデントをHits数で検索するには、`N:`プレフィックスを指定します。

例えば、`attacks N:>100`で100Hitsを超える攻撃を検索できます。`attacks N:<10`で10Hits未満の攻撃を検索できます。

### ドメインで検索

ドメインで検索するには、`d:`または`domain:`プレフィックスを使用します。

第2レベル以上のドメインになり得る文字列は、プレフィックスなしで指定できます。任意の文字列はプレフィックス付きで指定できます。 

ドメイン内ではマスクを使用できます。`*`は任意の長さの文字列、`?`は任意の1文字に一致します。

### パスで検索

パスで検索するには、次のいずれかを行います:

* `u:`または`url:`プレフィックスを使用し、`/`で始まるパスを引用符で囲んで指定します（例: `url:"/api/users"`）
* プレフィックスなしで`/`から入力を開始します（例: `/api/users`）

### アプリケーションで検索

攻撃が送信されたアプリケーションで検索するには、`application:`または`app:`プレフィックスを使用します（以前の`pool:`プレフィックスもサポートされていますが推奨しません）。

属性値は、**Settings**の**Applications**タブで設定されたアプリケーション名です。例: `application:'Example application'`。

### パラメータまたはパーサーで検索

パラメータまたはパーサーで検索するには、`p:`、`param:`、`parameter:`プレフィックス、または`=`サフィックスを使用します。サフィックスを使用する場合、`/`で始まらない文字列はパラメータと見なされます（末尾の`=`文字は値に含まれません）。

可能な属性値:

* 対象となるパラメータ名。

    例えば、`xss`パラメータを狙った攻撃（例: GETパラメータに`xss`を含むSQLインジェクション攻撃）を見つけたいが、XSS攻撃そのものではない場合は、検索文字列に`attacks sqli p:xss`を指定します。
* Wallarm nodeがパラメータ値を読み取るために使用した[パーサー](../rules/request-processing.md)名。名前は大文字で指定する必要があります。

    例: `attacks p:*BASE64`は、base64パーサーで解析された任意のパラメータを狙う攻撃を検索します。
* パラメータとパーサーのシーケンス。

    例: `attacks p:"POST_JSON_DOC_HASH_from"`は、リクエストのJSONボディ内`from`パラメータで送られた攻撃を検索します。

値内ではマスクを使用できます。`*`は任意の長さの文字列、`?`は任意の1文字に一致します。

### イベントの異常を検索

イベントの異常を検索するには、`a:`または`anomaly:`プレフィックスを使用します。

異常検索を絞り込むには、次のパラメータを使用します:

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

例:

`attacks sqli a:size`は、リクエストのレスポンスサイズに異常があるすべてのSQLインジェクション攻撃を検索します。

### リクエスト識別子で検索

攻撃やインシデントをリクエスト識別子で検索するには、`request_id`プレフィックスを指定します。
`request_id`パラメータの値形式は`a79199bcea606040cc79f913325401fb`です。読みやすくするため、以下の例ではこのパラメータを省略形のプレースホルダー`<requestId>`に置き換えています。

例:
*   `attacks incidents request_id:<requestId>`: `request_id`が`<requestId>`に等しい攻撃またはインシデントを検索します。
*   `attacks incidents !request_id:<requestId>`: `request_id`が`<requestId>`に等しくない攻撃とインシデントを検索します。
*   `attacks incidents request_id`: 任意の`request_id`を持つ攻撃とインシデントを検索します。
*   `attacks incidents !request_id`: `request_id`を持たない攻撃とインシデントを検索します。

### サンプリングされたHitsを検索

[サンプリングされたHits](../events/grouping-sampling.md#sampling-of-hits)を検索するには、検索文字列に`sampled`を追加します。

### ノードUUIDで検索

特定のノードで検出された攻撃を検索するには、`node_uuid`プレフィックスに続けてノードUUIDを指定します。

例:

* `attacks incidents today node_uuid:<NODE UUID>`: `<NODE UUID>`のノードで本日見つかったすべての攻撃とインシデントを検索します。
* `attacks today !node_uuid:<NODE UUID>`: `<NODE UUID>`のノードを除く任意のノードで本日見つかったすべての攻撃を検索します。

!!! info "新しい攻撃のみを検索"
    ノードUUIDで検索する場合、2023年5月31日以降に検出された攻撃のみが表示されます。

ノードUUIDは**Nodes**セクションの[node details](../../user-guides/nodes/nodes.md#viewing-details-of-a-node)で確認できます。UUIDをクリックするとコピーできます。または**View events from this node for the day**をクリックします（**Attacks**セクションに切り替わります）。

<a name="search-by-specification"></a>
### 仕様による検索

特定の[仕様ポリシー違反](../../api-specification-enforcement/overview.md)に関連するイベント一覧を取得するには、検索フィールドに`spec:'<SPECIFICATION-ID>'`を指定します。`<SPECIFICATION-ID>`を取得するには、**API Specifications**で対象の仕様を編集モードで開きます。ブラウザのアドレス欄に`specid`が表示されます。

![Specification - セキュリティポリシー適用に使用](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

設定されたポリシー違反時のアクションに応じて、ブロック済みイベントとモニターイベントが表示されます。イベントの詳細には、違反タイプと原因となった仕様へのリンクが表示されます。

### 正規表現ベースのカスタマールールで検索

[正規表現ベースのカスタマールール](../../user-guides/rules/regex-rule.md)で検出された攻撃一覧を取得するには、検索フィールドに`custom_rule`を指定します。

この種の攻撃の詳細には、対応するルールへのリンク（複数の場合あり）が表示されます。必要に応じてリンクをクリックしてルールの詳細を開き、編集できます。

![正規表現ベースのカスタマールールで検出された攻撃 - ルールの編集](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

`!custom_rule`を使用すると、正規表現ベースのカスタマールールに関連しない攻撃の一覧を取得できます。