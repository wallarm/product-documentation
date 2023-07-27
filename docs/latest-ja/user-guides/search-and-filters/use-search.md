[al-sqli]: ../../attacks-vulns-list.md#sql-injection
[al-xss]: ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]: ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]: ../../attacks-vulns-list.md#bruteforce-attack
[al-path-traversal]: ../../attacks-vulns-list.md#path-traversal
[al-crlf]: ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]: ../../attacks-vulns-list.md#open-redirect
[al-nosqli]: ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]: ../../attacks-vulns-list.md#data-bomb
[al-xxe]: ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]: ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]: ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]: ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]: ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]: ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]: ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]: ../../attacks-vulns-list.md#overlimiting-of-computational-resources
[email-injection]: ../../attacks-vulns-list.md#email-injection
[ssi-injection]: ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]: ../../attacks-vulns-list.md#unsafe-xml-header
[ssti-injection]: ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]: ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# 検索とフィルタの使用

Wallarmは、検出された攻撃、インシデント、および脆弱性を検索するための便利な方法を提供しています。Wallarmコンソールの**イベント**セクションには、次の検索方法が利用可能です。

* フィルタリング基準を選択するための**フィルタ**
* 属性と修飾子を含む検索クエリを入力するための**検索フィールド**

フィルターで設定された値は、検索フィールドに自動的に複製され、その逆も同様です。

**Save a query**をクリックして、任意の検索クエリやフィルターの組み合わせを保存できます。

## フィルタ

利用可能なフィルタは、Wallarmコンソールで複数の形式で表示されます。

* **Filter**ボタンを使用して展開および折りたたむことができるフィルタパネル
* 特定のパラメーター値を持つイベントを除外または表示するためのクイックフィルタ

![!Filters in the UI](../../images/user-guides/search-and-filters/filters.png)

異なるフィルターの値が選択されると、結果はそれらの条件をすべて満たします。同じフィルターに対して異なる値が指定された場合、結果はそれらの条件のいずれかを満たします。

## 検索フィールド

検索フィールドは、人間の言語に似た属性と修飾子を含むクエリを受け入れるため、クエリの送信が直感的になります。例：

* `attacks xss`: [XSS-攻撃][al-xss]をすべて検索するには
* `attacks today`: 今日発生したすべての攻撃を検索するには
* `vulns sqli`: [SQLインジェクション][al-sqli]の脆弱性を検索するには
* `vulns 11/01/2020-11/10/2020`: ある期間内の脆弱性を検索するには
* `xss 12/14/2020`: 2020年12月14日の[クロスサイトスクリプティング][al-xss]に関連するすべての脆弱性、疑義、攻撃、およびインシデントを検索するには
* `p:xss 12/14/2020`: 2020年12月14日にxss HTTP要求パラメータ（つまり、「http://<span>localhost/？xss=attack-here」）内で発生したすべての種類の脆弱性、疑念、攻撃、およびインシデントを検索するには
* `attacks 9-12/2020`: 2020年9月から12月までのすべての攻撃を検索するには
* `rce /catalog/import.php`: `/catalog/import.php`パス에서のすべての[RCE][al-rce]攻撃、インシデントおよび脆弱性を昨日から検索するには

異なるパラメータの値が指定されている場合、結果はそれらの条件すべてを満たします。同じパラメータに対して異なる値が指定されている場合、結果はそれらの条件のうちのいずれかを満たします。

!!! info "属性値をNOTに設定する"
    属性値を否定するには、属性または修飾子名の前に `!` を使用してください。 例： `attacks !ip:111.111.111.111` すべての IP アドレスから生成された攻撃(*) ！= `111.111.111.111`.

以下は、検索クエリで使用できる属性と修飾子のリストです。

### オブジェクトタイプでの検索

検索文字列に指定してください：

* `attack`, `attacks`: 既知の脆弱性に対する攻撃では *ない* 攻撃のみを検索する場合。
* `incident`, `incidents`: 既知の脆弱性を悪用する攻撃であるインシデントのみを検索する場合。
* `vuln`, `vulns`, `vulnerability`, `vulnerabilities`: 脆弱性のみを検索する場合。

### 攻撃タイプまたは脆弱性タイプでの検索

検索文字列に指定してください：

* `sqli`: [SQL インジェクション][al-sqli]の攻撃/脆弱性を検索します。
* `xss`: [Cross Site Scripting][al-xss]の攻撃/脆弱性を検索します。
* `rce`: [OS コマンド][al-rce]の攻撃/脆弱性を検索します。
* `brute`: [brute-force][al-brute-force]攻撃を検索します。
* `ptrav`: [パストラバーサル][al-path-traversal]の攻撃を検索します。
* `crlf`: [CRLFインジェクション][al-crlf]の攻撃/脆弱性を検索します。
* `redir`: [オープンリダイレクト][al-open-redirect]の脆弱性を検索します。
* `nosqli`: [NoSQLインジェクション][al-nosqli]の攻撃/脆弱性を検索します。
* `data_bomb`: [データ爆弾][al-logic-bomb]攻撃を検索します。
* `ssti`: [サーバーサイドテンプレートインジェクション][ssti-injection]を検索します。
* `invalid_xml`: [安全でないXMLヘッダーの使用][invalid-xml]を検索します。
* `overlimit_res`: [計算リソースのオーバーリミット][al-overlimit]を目的とした攻撃を検索します。
* `xxe`: [XML外部エンティティ][al-xxe]攻撃を検索します。
* `vpatch`: [仮想パッチ][al-virtual-patch]を検索します。
* `dirbust`: [強制ブラウジング][al-forced-browsing]攻撃を検索します。
* `ldapi`: [LDAPインジェクション][al-ldapi]攻撃/脆弱性を検索します。
* `scanner`: [ポートスキャナー][al-port-scanner]攻撃/脆弱性を検索します。
* `infoleak`: [情報漏洩][al-infoleak]の攻撃/脆弱性を検索します。
* `vuln_component`: [脆弱なコンポーネント][al-vuln-component]使用に起因する脆弱性を検索します。
* `mail_injection`: [Eメールインジェクション][email-injection]を検索します。
* `ssi`: [SSIインジェクション][ssi-injection]を検索します。
* `overlimit_res`: [リソースオーバーリミット][overlimit-res]タイプの攻撃を検索します。
* `experimental`: [カスタム正規表現](../rules/regex-rule.md)に基づいて検出された実験的な攻撃を検索します。
* `idor`: [BOLA（IDOR）](../../attacks-vulns-list.md#broken-object-level-authorization-bola)タイプの脆弱性を検索します。
* `bola`: [BOLA（IDOR）脆弱性](../../attacks-vulns-list.md#broken-object-level-authorization-bola)を悪用した攻撃を検索します。
* `weak_auth`: [JWT脆弱性](../../attacks-vulns-list.md#weak-jwt)を検索します。
* `mass_assignment`: [マスアサインメント](../../attacks-vulns-list.md#mass-assignment)攻撃を検索します。
* `api_abuse`: [ボットによって実行されたAPIへの攻撃](../../attacks-vulns-list.md#api-abuse)を検索します。
* `csrf`: [クロスサイトリクエストフォージェリ（CSRF）脆弱性](../../attacks-vulns-list.md#cross-site-request-forgery-csrf)を検索します。
* `ssrf`: [サーバーサイドリクエストフォージェリ（SSRF）脆弱性および攻撃](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)を検索します。

攻撃名または脆弱性名は大文字と小文字の両方で指定できます。「SQLI」、「sqli」、「SQLi」は同様に正しいです。### 既知の攻撃（CVEおよびよく知られたエクスプロイト）による検索

* `known`：CVEの脆弱性や他のよく知られた脆弱性タイプを悪用することで、正確に攻撃を仕掛けるリクエストを検索します。

    特定のCVEや他のよく知られた脆弱性タイプによる攻撃をフィルタリングするには、`known` タグに加えて適切なタグを渡すか、別のタグで渡すことができます。例：`known:CVE-2004-2402 CVE-2018-6008` または `CVE-2004-2402 CVE-2018-6008` は、[CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) および [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) の脆弱性を悪用する攻撃を検索します。
* `!known`：潜在的な誤検知。これらのリクエストは、あまり知られていないエクスプロイトや、エクスプロイトを正当なパラメータ値に変換するコンテキストを含む場合があります。

CVEおよびよく知られたエクスプロイトによる攻撃をフィルタリングするには、イベントタイプと **CVEおよびエクスプロイト** によるクイックフィルターが使用できます。

### APIプロトコルによる検索ヒット

APIプロトコルによるヒットをフィルタリングするには、`proto:` または `protocol:` タグを使用します。

このタグは以下の値を許可します。

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### 認証プロトコルによる検索ヒット

攻撃者が使用した認証プロトコルによるヒットをフィルタリングするには、`auth:` タグを使用します。

このタグは以下の値を許可します。

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

### 攻撃対象または脆弱性対象による検索

検索文字列で次のいずれかを指定します。

* `client`：クライアントデータの攻撃/脆弱性を検索するため。
* `database`：データベースの攻撃/脆弱性を検索するため。
* `server`：アプリサーバーの攻撃/脆弱性を検索するため。

### リスクレベルでの検索

検索文字列でリスクレベルを指定してください：

* `low`：リスクレベルが低い。
* `medium`：リスクレベルが中間。
* `high`：リスクレベルが高い。

### 脆弱性識別子での検索

特定の脆弱性を検索するには、その識別子を指定してください。2つの方法で指定できます。

* 完全に：`WLRM-ABCD-X0123`
* 省略形で：`X0123`

### 脆弱性ステータスでの検索

検索文字列で脆弱性のステータスを指定してください。脆弱性は次の3つのステータスのいずれかを持っています。

* `open`：現在関連性のある脆弱性
* `closed`：修正済みの脆弱性

### イベント時刻での検索

検索文字列で期間を指定してください。期間が指定されていない場合、検索は過去24時間以内に発生したイベント内で行われます。

期間を指定する方法は以下の通りです。

* 日付で：`11/10/2020-11/14/2020`
* 日付と時刻で（秒数は無視されます）：`11/10/2020 11:11`, `11:30-12:22`, `11/10/2020 11:12-01/14/2020 12:14`
* 特定の時点を基準として：`>11/10/20`
* 文字列エイリアスを使用して：
    * `yesterday`：昨日の日付と同じ
    * `today`：今日の日付と同じ
    * `last <unit>`：過去のユニット全体から現在の日付と時刻までの期間

        `<unit>`には `week`、`month`、`year`またはこれらのユニット数を使用できます。例：`last week` 、 `last 3 month` または `last 3 months`。

    * `this <unit>`：現在のユニットに等しい

        `<unit>`には `week`、`month`、`year` を使用できます。例：今日が水曜日の場合、`this week` は今週の月曜日、火曜日、水曜日に検出されたイベントを返します。

日付と時刻の形式は、あなたの[プロファイル](../settings/account.md#changing-your-date-time-format)で指定された設定に依存します。

* MM/DD/YYYY は **MDY**が選択されている場合。
* DD/MM/YYYY は **DMY** が選択されている場合。
* `13:00` は **24‑hour** がチェックされている場合。
* `1pm` は **24‑hour** がチェックされていない場合。

月は数字または名前で指定できます：`01`、`1`、`January`、`Jan`は1月に対応します。年は完全な形式（`2020`）と短縮形式（`20`）のどちらで指定することができます。日付に年が指定されていない場合、現在の年が使用されます。

### IPアドレスでの検索

IPアドレスで検索するには、`ip:`プレフィックスを使用し、次のいずれかを指定できます。
* 特定のIPアドレス、例：`192.168.0.1` － この場合、攻撃の送信元アドレスがこのIPアドレスに対応するすべての攻撃とインシデントが見つかります。
* IPアドレスの範囲を説明する表現。
* 攻撃またはインシデントに関連するIPアドレスの総数。

#### IPアドレス範囲での検索

IPアドレスの必要な範囲を設定するには、次のいずれかを使用できます。
* 明示的なIPアドレスの範囲：
    * `192.168.0.0-192.168.63.255`
    * `10.0.0.0-10.255.255.255`
* IPアドレスの一部：
    * `192.168.` － `192.168.0.0-192.168.255.255` と同等です。余分な形式で `*` 修飾子が許可されている - `192.168.*`
    * `192.168.0.` － `192.168.0.0-192.168.0.255` と同等です。
* 式の最後のオクテット内の値の範囲を持つIPアドレスまたはその一部：
    * `192.168.1.0-255` － `192.168.1.0-192.168.1.255` と同等です。
    * `192.168.0-255` － `192.168.0.0-192.168.255.255` と同等です。

    !!! warning "重要"
        オクテット内の値の範囲を使用する場合、最後にドットを設定しないでください。

* サブネットプレフィックス（[CIDR表記](https://tools.ietf.org/html/rfc4632)）：
    * `192.168.1.0/24` － `192.168.1.0-192.168.1.255` と同等です。
    * `192.168.0.0/17` － `192.168.0.1-192.168.127.255` と同等です。

!!! note
    IPアドレス範囲の定義方法を上記のように組み合わせることができます。これを行うには、ip:プレフィックスを別々にすべての必要な範囲でリストします。
    
    **例**：`ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IPアドレスの数での検索

攻撃またはインシデントに関連するIPアドレスの総数で検索することができます（攻撃およびインシデントのみ）：
* `ip:1000+ last month` － 過去1ヶ月間に、一意のIPアドレスの数が1000を超える攻撃およびインシデントを検索します （`attacks incidents ip:1000+ last month`に等しい）。
* `xss ip:100+` － すべてのクロスサイトスクリプティング攻撃およびインシデントを検索します。検索結果は、攻撃IPアドレスの数（XSS攻撃タイプで）が100未満の場合、空になります。
* `xss p:id ip:100+` －`？id=aaa`に関連するすべてのXSS攻撃およびインシデントを検索します。異なるIPアドレスの数が100を超える場合にのみ結果が返されます。

### IPアドレスの所属データセンターでの検索

攻撃の発生元となるIPアドレスが所属するデータセンターで検索するには、`source:`プレフィックスを使用します。

この属性の値は次のいずれかになります。

* `tor`: Torネットワーク用
* `proxy`: パブリックまたはWebプロキシサーバ用
* `vpn`: VPN用
* `aws`: Amazon用
* `azure`: Microsoft Azure用
* `gce`: Google Cloud Platform用
* `ibm`: IBM Cloud用
* `alibaba`: Alibaba Cloud用
* `huawei`: Huawei Cloud用
* `rackspace`: Rackspace Cloud用
* `plusserver`: PlusServer用
* `hetzner`: Hetzner用
* `oracle`: Oracle Cloud用
* `ovh`: OVHcloud用
* `tencent`: Tencent用
* `linode`: Linode用
* `docean`: Digital Ocean用

### IPアドレスが登録されている国または地域での検索

攻撃の発生源となるIPアドレスが登録されている国または地域で検索するには、`country:`プレフィックスを使用します。

国/地域の名前は、標準[ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1)に対応する形式で、大文字または小文字で属性に渡されます。例：`country:CN` または `country:cn` は中国から発生した攻撃を示します。

### サーバー応答ステータスでの検索

サーバー応答ステータスで検索するには、`statuscode:`プレフィックスを指定してください。

応答ステータスは次のように指定できます。
* 100から999までの数字。
* 「N-M」範囲。NおよびMは100から999までの数字。
* 「N+」および「N-」範囲。Nは100から999までの数字。### サーバーレスポンスサイズで検索

サーバーレスポンスサイズで検索するには、 `s:` または `size:` のプレフィックスを使用します。

任意の整数値を検索できます。999より大きい数値はプレフィックスなしで指定できます。「N-M」、「N+」および「N-」の範囲を指定でき、999より大きい数値もプレフィックスなしで指定できます。

### HTTPリクエストメソッドで検索

HTTPリクエストメソッドで検索するには、`method:` プレフィックスを指定します。

`GET`、`POST`、`PUT`、`DELETE`、`OPTIONS`を検索する場合：大文字が使用されている場合、検索文字列はプレフィックスなしで指定できます。それ以外の値の場合、プレフィックスを指定する必要があります。

### 攻撃/インシデント内のヒット数で検索

攻撃とインシデントをヒット数で検索するには、`N:` プレフィックスを指定します。

例えば、100回以上のヒットがある攻撃を検索するには `attacks N:>100` です。または、ヒット数が10未満の攻撃を `attacks N:<10` で検索できます。

### ドメインで検索

ドメインで検索するには、`d:` または `domain:` のプレフィックスを使用します。

2番目以上のレベルのドメインが可能な文字列はプレフィックスなしで指定できます。任意の文字列はプレフィックスと一緒に指定できます。

ドメイン内でマスクを使用できます。記号 `*` は任意の文字数を置き換えます。記号 `?` は1つの文字を置き換えます。

### パスで検索

パスで検索するには、`u:` または `url:` のプレフィックスを使用します。

`/` で始まる文字列はプレフィックスなしで処理されます。任意の文字列はプレフィックスと一緒に指定できます。

### アプリケーションで検索

攻撃が送信されたアプリケーションや脆弱性が見つかったアプリケーションを検索するには、 `application:` または `app:` のプレフィックスを使用します（以前の `pool:` プレフィックスもサポートされていますが、推奨されません）。

属性値は、**Settings** セクションの **Applications** タブで設定されたアプリケーション名です。例：`application:'Example application'`。

### パラメーターやパーサーで検索

パラメーターやパーサーで検索するには、 `p:`、`param:`、または `parameter:` のプレフィックスを使うか、 `=` 接尾辞を使用します。接尾辞を使用する場合、`/` で始まらない文字列はパラメータと見なされます（ただし、終了 `=` 文字は値に含まれません）。

可能な属性値：

* ターゲットパラメータの名前。

    例えば、`xss` パラメータを狙った攻撃（XSS攻撃ではなく、例えばGETパラメータに `xss` が含まれるSQLインジェクション攻撃など）を見つける必要がある場合、検索文字列に `attacks sqli p:xss` を指定します。
* Wallarmノードがパラメータ値を読み取るために使用する[パーサー](../rules/request-processing.md) の名前。名前は大文字でなければなりません。

    例えば、`attacks p:*BASE64` で、base64パーサーで解析された任意のパラメータを狙った攻撃を見つけます。
* パラメータとパーサーのシーケンス。

    例：`attacks p:"POST_JSON_DOC_HASH_from"` で、リクエストのJSONボディ内の `from` パラメータに送信された攻撃を見つけます。

値内でマスクを使うことができます。記号 `*` は任意の数の文字を置き換え、記号 `?` は1つの文字を置き換えます。

### 攻撃の異常検索

攻撃の異常を検索するには、`a:` または `anomaly:` のプレフィックスを使用します。

異常検索を絞り込むには、以下のパラメータを使います：

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

例：

`attacks sqli a:size` は、リクエストにレスポンスサイズの異常があるすべてのSQLインジェクション攻撃を検索します。

### リクエストIDで検索

攻撃とインシデントをリクエストIDで検索するには、`request_id` プレフィックスを指定します。
`request_id`パラメータの値の形式は `a79199bcea606040cc79f913325401fb` です。読みやすくするために、以下の例ではこのパラメータがプレースホルダの略 `<requestId>` に置き換えられています。

例:

*   `attacks incidents request_id:<requestId>`：`request_id` が `<requestId>` に等しい攻撃またはインシデントを検索します。
*   `attacks incidents !request_id:<requestId>`：`request_id` が `<requestId>` と等しくない攻撃とインシデントを検索します。
*   `attacks incidents request_id`：任意の `request_id` を持つ攻撃とインシデントを検索します。
*   `attacks incidents !request_id`：`request_id` を持たない攻撃とインシデントを検索します。

### サンプリングされたヒットの検索

[サンプリングされたヒット](../events/analyze-attack.md#sampling-of-hits)を検索するには、検索文字列に `sampled` を追加します。

### Search by regexp-based customer rule

To get the list of attacks detected by [regexp-based customer rules](../../user-guides/rules/regex-rule.md), in the search field specify `custom_rule`.

For any of such attacks, in its details, the links to the corresponding rules are presented (there can be more than one). Click the link to access the rule details and edit them if necessary.

![!Attack detected by regexp-based customer rule - editing rule](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

You can use `!custom_rule` to get the list of attacks not related to any regexp-based customer rules.
