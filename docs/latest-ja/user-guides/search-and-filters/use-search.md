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
[al-overlimit]:           ../../attacks-vulns-list.md#overlimiting-of-computational-resources
[email-injection]:        ../../attacks-vulns-list.md#email-injection
[ssi-injection]:          ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]:            ../../attacks-vulns-list.md#unsafe-xml-header
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]:          ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# 検索とフィルタの使用

Wallarmは、検出された攻撃やインシデントを検索するための便利な方法を提供します。Wallarm Consoleの**イベント**セクションでは、次の検索方法が利用できます :

* **フィルタ** で選択基準を設定
* **検索フィールド** で属性と修飾子を含む検索クエリを入力（人間の言葉に近い）

フィルタで設定された値は、検索フィールドに自動的に複製され、逆もまた同様です。

任意の検索クエリまたはフィルタの組み合わせは、**クエリを保存** をクリックすることで保存できます。

## フィルタ

利用可能なフィルタは、Wallarm Consoleで複数の形態で提示されています :

* **フィルタ** ボタンを使用して展開および折りたたむことができるフィルタパネル
* 特定のパラメータ値を有するイベントだけを表示または除外するためのクイックフィルタ

![フィルタのUI](../../images/user-guides/search-and-filters/filters.png)

異なるフィルタの値が選択された場合、結果はそれらすべての条件を満たすものとなります。同じフィルタに異なる値が指定された場合、結果はいずれかの条件を満たすものとなります。

## 検索フィールド

検索フィールドは、属性と修飾子が人間の言葉に似ているクエリを受け付けるため、クエリの提出が直感的です。例えば：

* `attacks xss`: すべての[XSS-攻撃][al-xss]を検索
* `attacks today`: 今日発生したすべての攻撃を検索
* `xss 2020/12/14`: 2020年12月14日のすべての疑わしきもの、攻撃、および[cross‑site scripting][al-xss]のインシデントを検索
* `p:xss 2020/12/14`: 2020年12月14日にxss HTTPリクエストパラメータ（すなわち `http://localhost/?xss=attack-here`）内のすべてのタイプの疑わしきもの、攻撃、およびインシデントを検索
* `attacks 2020/9-12`: 2020年9月から12月までのすべての攻撃を検索
* `rce /catalog/import.php`: `/catalog/import.php`パス上のすべての[RCE][al-rce]攻撃およびインシデントを検索

異なるパラメータの値が指定された場合、結果はそれらすべての条件を満たすものとなります。同じパラメータに異なる値が指定された場合、結果はいずれかの条件を満たすものとなります。

!!! info "属性値をNOTに設定する"
    属性値を否定するためには、属性または修飾子の名前の前に`!`を使用してください。例えば： `attacks !ip:111.111.111.111` は、`111.111.111.111` を除く任意のIPアドレスから発生した全攻撃を示します。

以下に、検索クエリで使用できる属性と修飾子のリストを示します。

### オブジェクトタイプによる検索

検索文字列で指定してください :

* `attack`, `attacks`: 既知の脆弱性を狙ったものでは*ない*攻撃のみを検索する。
* `incident`, `incidents`: 既知の脆弱性を悪用するインシデント（攻撃）のみを検索する。

### 攻撃タイプによる検索

検索文字列で指定してください :

* `sqli`: [SQLインジェクション][al-sqli]攻撃を検索する。
* `xss`: [Cross Site Scripting][al-xss]攻撃を検索する。
* `rce`: [OS Commanding][al-rce]攻撃を検索する。
* `brute`: [brute-force][al-brute-force]攻撃を検索する。
* `ptrav`: [path traversal][al-path-traversal]攻撃を検索する。
* `crlf`: [CRLF injection][al-crlf]攻撃を検索する。
* `redir`: [open redirect][al-open-redirect]攻撃を検索する。
* `nosqli`: [NoSQL injection][al-nosqli]攻撃を検索する。
* `data_bomb`: [logic bomb][al-logic-bomb]攻撃を検索する。
* `ssti`: [Server‑Side Template Injections][ssti-injection] を検索する。
* `invalid_xml`: [安全でないXMLヘッダの使用][invalid-xml] を検索する。
* `overlimit_res`: [計算リソースの過剰制限][al-overlimit]を狙った攻撃を検索する。
* `xxe`: [XML External Entity][al-xxe]攻撃を検索する。
* `vpatch`: [virtual patches][al-virtual-patch]を検索する。
* `dirbust`: [forced browsing][al-forced-browsing]攻撃を検索する。
* `ldapi`: [LDAP injection][al-ldapi]攻撃を検索する。
* `scanner`: [port scanner][al-port-scanner]攻撃を検索する。
* `infoleak`: [情報漏えい][al-infoleak]の攻撃を検索する。
* `mail_injection`: [Email Injections][email-injection] を検索する。
* `ssi`: [SSI Injections][ssi-injection] を検索する。
* `overlimit_res`: [リソース過剰制限][overlimit-res]タイプの攻撃を検索する。
* `experimental`: [カスタム正規表現](../rules/regex-rule.md)に基づいて検出された実験的な攻撃を検索する。
* `bola`: [BOLA (IDOR)脆弱性](../../attacks-vulns-list.md#broken-object-level-authorization-bola)を悪用する攻撃を検索する。
* `mass_assignment`: [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)の攻撃試行を検索する。
* `api_abuse`: [ボットによるAPI攻撃](../../attacks-vulns-list.md#api-abuse)を検索する。
* `ssrf`: [Server‑side Request Forgery (SSRF)と攻撃](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)を検索する。

大文字小文字を問わずに攻撃名を指定できます：`SQLI`、`sqli`、および`SQLi`は同じく正しいです。

### OWASPトップ脅威と関連する攻撃の検索

OWASPの脅威タグを使用して、OWASPのトップ脅威と関連する攻撃を見つけることができます。これらの攻撃を検索するための形式は`owasp_api1_2023`です。

これらのタグは、OWASPにより定められた脅威の元の番号に対応しています。Wallarmは攻撃を2019年と2023年の両方のOWASP API Top脅威に関連付けます。

### 既知の攻撃（CVEおよびよく知られているエクスプロイト）による検索

* `known`: 彼らがCVE脆弱性または他のよく知られている脆弱性タイプを悪用するので、明確な攻撃を検索します。

    特定のCVEまたは他のよく知られている脆弱性タイプによる攻撃をフィルタリングするためには、`known`タグに加えて該当のタグを追加または別途指定できます。例えば、`known:CVE-2004-2402 CVE-2018-6008`または`CVE-2004-2402 CVE-2018-6008`は[CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402)と[CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008)の脆弱性を悪用する攻撃を検索します。
* `!known`: 潜在的な誤検知。これらの要求には、あまり知られていないエクスプロイトが含まれている場合があります。

CVEおよびよく知られているエクスプロイトによる攻撃をフィルタリングするためには、イベントタイプと**CVEとエクスプロイト**によるクイックフィルタを使用できます。

### APIプロトコルによるヒットの検索

APIプロトコルによるヒットをフィルタリングするために、`proto:`または`protocol:`タグを使用します。

このタグは以下の値を許可します:

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

攻撃者が使用した認証プロトコルによるヒットをフィルタリングするために、`auth:`タグを使用します。

このタグは以下の値を許可します:

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

検索文字列で指定してください :

* `client`: クライアントデータの攻撃を検索する。
* `database`: データベース攻撃を検索する。
* `server`: アプリケーションサーバ攻撃を検索する。

### リスクレベルによる検索

検索文字列でリスクレベルを指定してください：

* `low`: 低リスクレベル。
* `medium`: 中リスクレベル。
* `high`: 高リスクレベル。

### イベント時間による検索

検索文字列で時間を指定してください。期間が設定されていない場合、検索は最後の24時間に発生したイベントで行われます。

期間の設定には次の方法があります：

* 日付による設定：`2020/11/10-2020/11/14`
* 日時による設定（秒は無視されます）：`2020/11/10 11:11`、`11:30-12:22`、`2020/11/10 11:12-2020/1/14 12:14`
* 特定の時間に関連する設定：`>2020/11/10`
* 文字列エイリアスを利用する：
    * `yesterday`は昨日の日付に等しい
    * `today`は今日の日付に等しい
    * `last <unit>`は過去のユニット全体の開始から現在の日付と時間までの期間に等しい

        `<unit>`は`week`、`month`、`year`またはこれらのユニットの数を使うことが出来ます。例： `last week`、`last 3 month`または`last 3 months`。
    
    * `this <unit>`は現在のユニットに等しい

        `<unit>`は`week`、`month`、`year`を使うことが出来ます。例えば、`this week`は今日が水曜日なら、今週の月曜日、火曜日、そして水曜日に検出されたイベントを返します。

日付と時間の形式は、あなたの[プロフィール](../settings/account.md)で指定されている設定に依存します :

* **MDY**が選択されている場合はMM/DD/YYYY
* **DMY**が選択されている場合はDD/MM/YYYY
* **24‑hour**をチェックすると `13:00`
* **24‑hour**をチェックしていない場合は `1pm`

月は数または名前で指定できます：`01`、`1`、`January`、`Jan` はすべて1月を意味します。年は完全な形式（`2020`）または短縮形式（`20`）で指定できます。日付に年が指定されていない場合、現在の年が使用されます。

### IPアドレスによる検索

IPアドレスによる検索をするためには、`ip:`接頭辞を使用し、以下を指定できます
* 特定のIPアドレス、例えば `192.168.0.1` - この場合、攻撃のソースアドレスがこのIPアドレスに対応するすべての攻撃とインシデントが見つかります。
* IPアドレスの範囲を表す表現。
* 攻撃またはインシデントに関連したIPアドレスの総数。

#### IPアドレス範囲による検索

必要なIPアドレスの範囲を設定するためには、以下を使用できます
* 明示的なIPアドレス範囲：
    * `192.168.0.0-192.168.63.255`
    * `10.0.0.0-10.255.255.255`
* IPアドレスの一部：
    * `192.168.`—`192.168.0.0-192.168.255.255`に等しい。冗長な形式で`*`修飾子が許可されています—`192.168.*`
    * `192.168.0.`—`192.168.0.0-192.168.0.255`に等しい
* 数式内の最後のオクテットで値の範囲を持つIPアドレスまたはその一部：
    * `192.168.1.0-255`—`192.168.1.0-192.168.1.255`に等しい
    * `192.168.0-255`—`192.168.0.0-192.168.255.255`に等しい。
    
    !!! warning "重要"
        オクテット内の値の範囲を使用するとき、最後にドットは設定されません。

* サブネットプレフィックス（[CIDR表記](https://tools.ietf.org/html/rfc4632)）：
    * `192.168.1.0/24`—`192.168.1.0-192.168.1.255`に等しい
    * `192.168.0.0/17`—`192.168.0.1-192.168.127.255`に等しい

!!! note
    IPアドレス範囲を定義するための上記の方法を組み合わせることができます。これには、ip:プレフィックスを個別にすべての必要な範囲に列挙する必要があります。

    **例**：`ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IPアドレスの数による検索

攻撃またはインシデント（攻撃とインシデントのみ）に関連するIPアドレスの総数による検索が可能です：
* `ip:1000+ last month` — 過去1か月で、ユニークなIPアドレスの数が1000以上の攻撃とインシデントを検索 （`attacks incidents ip:1000+ last month`に相当）。
* `xss ip:100+` — すべてのクロスサイトスクリプティング攻撃とインシデントを検索します。攻撃するIPアドレスの数（XSS攻撃タイプ）が100未満の場合、検索結果は空になります。
* `xss p:id ip:100+` — idパラメータ（`?id=aaa`）に関連するすべてのXSS攻撃とインシデントを検索します。異なるIPアドレスの数が100を超える場合にのみ結果が返されます。

### IPアドレスの所属するデータセンターによる検索

攻撃が起こったIPアドレスが所属するデータセンターによる検索をするためには、`source:`接頭辞を使用します。

この属性の値は次のことができます :

* `tor` は Torネットワーク用
* `proxy` は公開またはウェブプロキシサーバ用
* `vpn` は VPN用
* `aws` は Amazon用
* `azure` は Microsoft Azure用
* `gce` は Google Cloud Platform用
* `ibm` は IBM Cloud用
* `alibaba` は Alibaba Cloud用
* `huawei` は Huawei Cloud用
* `rackspace` は Rackspace Cloud用
* `plusserver` は PlusServer用
* `hetzner` は Hetzner用
* `oracle` は Oracle Cloud用
* `ovh` は OVHcloud用
* `tencent` は Tencent用
* `linode` は Linode用
* `docean` は Digital Ocean用

### IPアドレスが登録されている国または地域による検索

攻撃が起こったIPアドレスが登録されている国または地域による検索をするためには、`country:`接頭辞を使用します。

国/地域の名前は、標準 [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1)に対応する形式で属性に渡す必要があります。大文字または小文字で書かれています。たとえば、`country:CN`または`country:cn`は中国からの攻撃を検索します。

### サーバレスポンスステータスによる検索

サーバレスポンスステータスによる検索をするためには、`statuscode:`接頭辞を指定してください。

レスポンスステータスは次のように指定できます：
* 100から999までの数字。
* «N–M»範囲、NとMは100から999までの数値。
* 「N+」および「N-」範囲、Nは100から999までの数値。

### サーバレスポンスサイズによる検索

サーバレスポンスのサイズによる検索をするためには、`s:`または`size:`接頭辞を使用します。

任意の整数値を検索することができます。999以上の数字は接頭辞なしで指定できます。「N–M」、「N+」および「N-」の範囲も指定できます。これらの場合も999以上の数字は接頭辞なしで指定できます。

### HTTPリクエストメソッドによる検索

HTTPリクエストメソッドによる検索をするためには、`method:`接頭辞を指定してください。

`GET`、`POST`、`PUT`、`DELETE`、`OPTIONS`については、大文字を使用している場合、検索文字列は接頭辞なしで指定できます。他のすべての値については、接頭辞を指定する必要があります。

### ヒット数内の攻撃/インシデントによる検索

攻撃とインシデントをヒット数によって検索するには、`N:`接頭辞を指定してください。

例えば、100以上のヒットを持つ攻撃を検索するためには：`attacks N:>100`を使用します。または10未満のヒットを持つ攻撃を検索するには：`attacks N:<10`を使用します。

### ドメインによる検索

ドメインによる検索をするためには、`d:`または`domain:`接頭辞を使います。

あらゆる文字列をドメインとして指定できます、二次レベルまでのドメインは接頭辞無しで指定できます。任何の文字列は接頭辞を使って指定できます。

ドメイン内でマスクを使用することができます。`*`記号は任意の数の文字を置き換え、「?」記号は任意の単一文字を置き換えます。

### パスによる検索

パスによる検索をするためには以下のどちらかを使用します：

* `u:`または`url:`接頭辞を使用し、引用符で始まるパスを指定します（例： `url:"/api/users"`）
* 接頭辞を使用せずにパスを`/`で開始します（例：`/api/users`）

### アプリケーションによる検索

攻撃が送信されたアプリケーションによる検索をするためには、「application:」または「app:」接頭辞を使用します（以前の「pool:」接頭辞はまだサポートされていますが、推奨はされていません）。

属性値は、**設定**セクションの**アプリケーション**タブに設定されているアプリケーション名です。例： `application:'Example application'`。

### パラメータまたはパーサーによる検索

パラメータまたはパーサーによる検索をするためには、`p:`、`param:`、または`parameter:`接頭辞、または`=`接尾辞を使用します。接尾辞を使用する場合、`/`で始まらない文字列はパラメータと見なされます（これには最後の`=`文字は含まれません）。

可能な属性値は次のとおりです :

* 狙われたパラメータの名前。

    例えば、`xss`パラメータを狙った攻撃を見つける必要がありますが、XSS攻撃（例えば、GETパラメータに`xss`が含まれているSQLインジェクション攻撃）ではない場合は、検索文字列に`attacks sqli p:xss`を指定します。
* Wallarmノードがパラメータ値を読み取るために使用した[パーサ](../rules/request-processing.md)の名前。名前は大文字でなければなりません。

    例えば、`attacks p:*BASE64`を使用して、base64パーサによって読み取られた任意のパラメータを狙った攻撃を見つけます。
* パラメータとパーサのシーケンス。

    例えば： `attacks p:"POST_JSON_DOC_HASH_from"`を使って、リクエストのJSON本文の`from`パラメータに攻撃が送信された場合の攻撃を見つけます。

マスクを値内で使用することができます。記号`*`は任意の数の文字を代替し、記号`?`は任意の単一文字を代替します。

### 攻撃の異常による検索

攻撃の異常を検索するためには、`a:`または`anomaly:`接頭辞を使用します。

異常検索を絞り込むためには、次のパラメータを使用します：

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

例：

`attacks sqli a:size`はリクエスト内で応答のサイズの異常を持つすべてのSQLインジェクション攻撃を検索します。

### リクエスト識別子による検索

攻撃とインシデントをリクエスト識別子によって検索するには、`request_id`接頭辞を指定します。
`request_id`パラメータには、その値が形式`a79199bcea606040cc79f913325401fb`です。以下の例では、このパラメータがプレースホルダの省略形`<requestId>`で置き換えられています。

例：
* `attacks incidents request_id:<requestId>`：`request_id`が`<requestId>`に等しい攻撃またはインシデントを検索します。
* `attacks incidents !request_id:<requestId>`：`request_id`が`<requestId>`と等しくない攻撃とインシデントを検索します。
* `attacks incidents request_id`：任意の`request_id`を持つ攻撃とインシデントを検索します。
* `attacks incidents !request_id`: `request_id`を持たない攻撃とインシデントを検索します。

### サンプリングされたヒットの検索

[サンプリングされたヒット](../events/analyze-attack.md#sampling-of-hits)を検索するには、検索文字列に`sampled`を追加します。

### ノードUUIDによる検索

特定のノードによって検出された攻撃を検索するには、`node_uuid`接頭辞を指定した後にノードのUUIDを指定します。

例：

* `attacks incidents today node_uuid:<NODE UUID>`：この`<NODE UUID>`を持つノードによって見つかった今日のすべての攻撃とインシデントを検索します。
* `attacks today !node_uuid:<NODE UUID>`：この`<NODE UUID>`を持つノードを除く任意のノードによって見つかった今日のすべての攻撃を検索します。

!!! info "新しい攻撃のみを検索"
    ノードUUIDによる検索を行った場合、2023年5月31日以降に検出された攻撃のみが表示されます。

ノードのUUIDは**ノード**セクションの[ノードの詳細](../../user-guides/nodes/nodes.md#viewing-details-of-a-node)で見つけることができます。UUIDをクリックしてコピーします。