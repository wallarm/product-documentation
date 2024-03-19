# リクエストの解析とパース

効果的なリクエスト解析のために、Wallarmは以下の原則に従います。

* 保護されたアプリケーションと同じデータを扱います。例えば:
    アプリケーションがJSON APIを提供している場合、処理されるパラメータもJSON形式でエンコードされます。パラメータ値を取得するために、WallarmはJSONパーサを使用します。データが何度もエンコードされるより複雑なケースも存在します。例えば、JSONからBase64にエンコードされた後、再度JSONにエンコードされる場合などです。これらのケースでは、複数のパーサでデコードする必要があります。

* データ処理のコンテキストを考慮します。例えば:
    
    パラメータ`name`は、製品名とユーザー名の両方として作成リクエストに渡すことができます。しかし、そのようなリクエストを処理するためのコードは異なる場合があります。このようなパラメータを解析する方法を定義するために、Wallarmはリクエストが送信されたURLや他のパラメータを使用することがあります。

## リクエスト部分の識別とパース

HTTPリクエストの最上位から始めて、フィルタリングノードは適切なパーサを各部分に順次適用しようとします。適用されるパーサのリストは、データの性質とシステムの前回のトレーニング結果によります。

パーサからの出力は、同様に分析される必要がある追加のパラメータセットとなります。パーサの出力は、時々、JSON、配列、連想配列のような複雑な構造になります。

!!! info "パーサのタグ"
    各パーサには識別子（タグ）があります。例えば、リクエストヘッダのパーサの場合は`header`です。リクエスト解析で使用されるタグのセットは、Wallarmコンソール内のイベント詳細で表示されます。このデータは、攻撃が検出されたリクエスト部分と使用されたパーサを示します。

    例えば、`SOAPACTION`ヘッダで攻撃が検出された場合：

    ![タグの例](../../images/user-guides/rules/tags-example.png)

### URL

各HTTPリクエストにはURLが含まれています。攻撃を見つけるために、フィルタリングノードは元の値と個々のコンポーネント：**path**、**action_name**、**action_ext**、**query**の両方を分析します。

URLパーサに対応するタグは次のとおりです。

* **uri** は、ドメインを除いたオリジナルのURL値（例：`http://example.com/blogs/123/index.php?q=aaa`へのリクエストの場合は`/blogs/123/index.php?q=aaa`）を指します。
* **path** は、`/`記号で分割されたURL部分の配列（最後のURL部分は配列に含まれません）。URLに1つの部分だけがある場合、配列は空になります。
* **action_name** は、`/`記号の後の最後の部分から最初のピリオド(`.`)までのURLの部分を指します。このURL部分は常にリクエストに存在し、その値が空文字列であっても。
* **action_ext** は、最後のピリオド(`.`)の後のURLの部分を指します。これはリクエストに存在しない場合があります。

    !!! warning "**action_name**と**action_ext**の境界について（ピリオドが複数ある場合)"
        URLの最後の部分の`/`記号の後に複数のピリオド(`.`)がある場合、**action_name**と**action_ext**の間の境界に問題が発生することがあります。例えば：
        
        * 境界が**最初の**ピリオドに基づいて設定される場合、たとえば：

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * パース後に一部の要素が欠落している場合、上記の例ではこれになります：

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        これを修正するには、URIコンストラクタの[高度な編集フォーム](rules.md#advanced-edit-form)で**action_name**と**action_ext**のポイントを手動で編集します。

* **query**は`?`記号の後の[クエリストリングパラメータ](#query-string-parameters)を指します。

例：

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### クエリストリングのパラメータ

クエリストリングのパラメータは、「キー=値」の形式で、リクエストURLの文字`?`の後にアプリケーションに渡されます。パーサに対応するタグは**query**です。

リクエストの例 | クエリストリングのパラメータと値
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### リクエスト元のIPアドレス

リクエスト元のIPアドレスのリクエストポイントはWallarmルールの`remote_addr`です。このポイントは、IPごとのリクエストを制限するための[**レート制限の設定**](rate-limiting.md)ルールでのみ使用されます。

### ヘッダ

ヘッダはHTTPリクエストと他のいくつかの形式（例えば、**multipart**）で提供されます。パーサに対応するタグは**header**です。ヘッダの名前は常に大文字に変換されます。

例：

```
GET / HTTP/1.1
Host: example.com
X-Test: aaa
X-Test: bbb
```

* `[header, 'HOST']` — `example.com`
* `[header, 'X-TEST', array, 0]` — `aaa`
* `[header, 'X-TEST', array, 1]` — `aaa`
* `[header, 'X-TEST', pollution]` — `aaa,bbb`

### メタデータ

次のタグは、HTTPリクエストのメタデータのパーサに対応しています。

* **post** はHTTPリクエストの本体を意味します。
* **method** はHTTPリクエストの方法を意味します：`GET`、`POST`、`PUT`、`DELETE`
* **proto** はHTTPプロトコルのバージョンを意味します。
* **scheme**：http/https
* **application** はアプリケーションIDを意味します。

### 追加のパーサ

複雑なリクエスト部分は追加のパースが必要になることがあります（例えば、データがBase64でエンコードされているか、配列形式で表示されている場合など）。これらの場合、以下に示すパーサがリクエスト部分に追加で適用されます。

#### base64

Base64でエンコードされたデータをデコードし、リクエストの任意の部分に適用することができます。

#### gzip

GZIPでエンコードされたデータをデコードし、リクエストの任意の部分に適用することができます。

#### htmljs

HTMLとJSのシンボルをテキスト形式に変換し、リクエストの任意の部分に適用することができます。

例： `&#x22;&#97;&#97;&#97;&#x22;`は`"aaa"`に変換されます。

#### json_doc

JSON形式のデータをパースし、リクエストの任意の部分に適用することができます。

フィルタ：

* **json_array**または**array**は配列要素の値を指します。
* **json_obj**または**hash**は連想配列のキー（`key:value`）の値を指します。

例：

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

XML形式のデータをパースし、リクエストの任意の部分に適用することができます。

フィルタ：

* **xml_comment**はXML文書本体内のコメントの配列を指します。
* **xml_dtd**は使用される外部DTDスキーマのアドレスを指します。
* **xml_dtd_entity**はEntity DTD文書で定義された配列を指します。
* **xml_pi**は指示文の配列を指します。
* **xml_tag**または**hash**はタグの連想配列を指します。
* **xml_tag_array**または**array**はタグの値の配列を指します。
* **xml_attr**は属性の連想配列を指します；**xml_tag**フィルタの後でのみ使用できます。

XMLパーサはタグの内容とタグの値の配列の最初の要素を区別しません。つまり、パラメータ`[..., xml, xml_tag, 't1']`と`[..., xml, xml_tag, 't1', array, 0]`は同一であり、互換性があります。

例：

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

* `[..., xml, xml_dtd_entity, 0]` — name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]` — name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

データ配列をパースします。リクエストの任意の部分に適用することができます。

例：

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

連想データ配列（`key:value`）をパースし、リクエストの任意の部分に適用することができます。

例：

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

同じ名前のパラメータの値を組み合わせ、初期形式またはデコード形式のリクエストの任意の部分に適用することができます。

例：

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

URLのシンボルをデコードし、URLの**uri**コンポーネントにのみ適用することができます。

#### cookie

Cookieリクエストパラメータをパースし、リクエストヘッダにのみ適用することができます。

例：

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

リクエスト本体を`application/x-www-form-urlencoded`形式でパースし、リクエスト本体にのみ適用することができます。

例：

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, form_urlencoded, 'p1']` — `1`
* `[post, form_urlencoded, 'p2', hash, 'a']` — `2`
* `[post, form_urlencoded, 'p2', hash, 'b']` — `3`
* `[post, form_urlencoded, 'p3', array, 0]` — `4`
* `[post, form_urlencoded, 'p3', array, 1]` — `5`
* `[post, form_urlencoded, 'p4', array, 0]` — `6`
* `[post, form_urlencoded, 'p4', array, 1]` — `7`
* `[post, form_urlencoded, 'p4', pollution]` — `6,7`

#### grpc <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC APIリクエストをパースし、リクエスト本体にのみ適用することができます。

Protocol Buffersデータの**protobuf**フィルタをサポートしています。

#### multipart

リクエスト本体を`multipart`形式でパースし、リクエスト本体にのみ適用することができます。

リクエスト本体のヘッダに対応する**header**フィルタをサポートしています。

例：

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, multipart, 'p1']` — `1`
* `[post, multipart, 'p2', hash, 'a']` — `2`
* `[post, multipart, 'p2', hash, 'b']` — `3`
* `[post, multipart, 'p3', array, 0]` — `4`
* `[post, multipart, 'p3', array, 1]` — `5`
* `[post, multipart, 'p4', array, 0]` — `6`
* `[post, multipart, 'p4', array, 1]` — `7`
* `[post, multipart, 'p4', pollution]` — `6,7`

`Content-Disposition`ヘッダにファイル名が指定されている場合、そのパラメータではファイルがロードされると見なされます。そのパラメータは次のように見えるでしょう：

* `[post, multipart, 'someparam', file]` — file contents

#### viewstate

セッションの状態を分析するために設計されています。この技術はMicrosoft ASP.NETによって使用され、リクエスト本体にのみ適用可能です。

フィルタ：

* **viewstate_array**は配列を意味します。
* **viewstate_pair**は配列を意味します。
* **viewstate_triplet**は配列を意味します。
* **viewstate_dict**は連想配列を意味します。
* **viewstate_dict_key**は文字列を意味します。
* **viewstate_dict_value**は文字列を意味します。
* **viewstate_sparse_array**は連想配列を意味します。

#### jwt

JWTトークンをパースし、リクエストの任意の部分に適用することができます。

JWTパーサは、検出されたJWT構造に基づいて、以下のパラメータで結果を返します。

* `jwt_prefix`：サポートされているJWT値のプレフィックスの一つ - lsapi2、mobapp2、bearer。パーサはプレフィックス値を任意のレジスタで読み取ります。
* `jwt_header`：JWTヘッダ。値を取得した後、Wallarmは通常、[`base64`](#base64)と[`json_doc`](#json_doc)のパーサをそれに適用します。
* `jwt_payload`：JWTペイロード。値を取得した後、Wallarmは通常、[`base64`](#base64)と[`json_doc`](#json_doc)のパーサをそれに適用します。

JWTは任意のリクエスト部分で渡すことができます。したがって、`jwt`パーサを適用する前にWallarmは特定のリクエスト部分パーサを使用します。例えば、[`query`](#query-string-parameters)や[`header`](#headers)。

`Authentication`ヘッダで渡されるJWTの例：

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

[rule](rules.md)が適用されるリクエスト要素を定義するときには：

* 最初にJWTを含むリクエスト部分のパーサを選択します
* `jwt`パーサの値として上記の`jwt_*`パラメータの一つを指定します。例えば、`name` JWTペイロードパラメータの値に対しては：

![JWT param desc in a rule](../../images/user-guides/rules/request-element-desc.png)

### ノルム

ノルムは、配列およびキーデータ型のパーサに適用されます。ノルムは、データ解析の境界を定義するために使用されます。ノルムの値は、パーサのタグで示されます。例えば：**hash_all**、**hash_name**。

ノルムが指定されていない場合、処理が必要なエンティティの識別子がパーサに渡されます。例えば：**hash**の後にJSONオブジェクトの名前や他の識別子が渡されます。

#### all

すべての要素、パラメータ、またはオブジェクトの値を取得するために使用されます。例えば：

* **path_all**はすべてのURLパス部分を指します。
* **query_all**はすべてのクエリストリングパラメータ値を指します。
* **header_all**はすべてのヘッダ値を指します。
* **array_all**はすべての配列要素値を指します。
* **hash_all**はすべてのJSONオブジェクトまたはXML属性値を指します。
* **jwt_all**はすべてのJWT値を指します。

#### name

すべての要素、パラメータ、またはオブジェクトの名前を取得するために使用されます。例えば：

* **query_name**はすべてのクエリストリングパラメータの名前を指します。
* **header_name**はすべてのヘッダの名前を指します。
* **hash_name**はすべてのJSONオブジェクトまたはXML属性の名前を指します。
* **jwt_name**はすべてのパラメータのJWTの名前を指します。