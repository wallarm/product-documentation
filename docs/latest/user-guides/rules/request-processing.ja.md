# 要求の分析とパース

効果的なリクエスト分析のために、Wallarmは次の原則に従います：

* 保護されたアプリケーションと同じデータで作業します。例えば：
    アプリケーションがJSON APIを提供する場合、処理されるパラメータもJSON形式でエンコードされます。パラメータの値を取得するために、WallarmはJSONパーサーを使用します。また、データが複数回エンコードされるより複雑なケースもあります。例えば、JSONからBase64へのJSONです。このようなケースでは、複数のパーサーでデコードする必要があります。

* データ処理の文脈を考慮します。例えば：

    パラメータ `name`は、製品名としても、ユーザ名としても作成リクエストに渡すことができます。しかし、そのようなリクエストの処理コードは異なる場合があります。
    このようなパラメータの分析方法を定義するために、Wallarmはリクエストが送信されたURLや他のパラメータを使用することがあります。

## リクエストパートの識別とパース

HTTPリクエストのトップレベルから始めて、フィルタリングノードは各パートに対して適切なパーサを順番に適用しようとします。適用されるパーサのリストは、データの性質とシステムの前回のトレーニング結果によって異なります。

パーサからの出力は、同様に分析される必要がある追加のパラメータセットになります。パーサの出力は、JSON、配列、連想配列などの複雑な構造になることがあります。

!!! info "パーサータグ"
    各パーサには識別子(タグ)があります。例えば、リクエストヘッダーのパーサーには `header` があります。リクエスト分析で使用されるタグのセットは、Wallarm Consoleのイベント詳細内に表示されます。このデータは、検出された攻撃と使用されたパーサを持つリクエスト部分を示します。

    例えば、`SOAPACTION`ヘッダーで攻撃が検出された場合：

    ![!タグの例](../../images/user-guides/rules/tags-example.png)

### URL

各HTTPリクエストにはURLが含まれています。攻撃を見つけるために、フィルタリングノードはオリジナルの値とその個々のコンポーネントを分析します：**path**、**action_name**、**action_ext**、**query**。

以下のタグはURLパーサーに対応します：

* ドメインなしのオリジナルのURL値（例：`http://example.com/blogs/123/index.php?q=aaa` へのリクエストの場合、`/blogs/123/index.php?q=aaa`）のための **uri** 。
* `/`シンボルで区切られたURLパーツを持つ配列のための **path** (最後のURLパーツは配列に含まれません)。URLにパーツが1つしかない場合、配列は空です。
* `/`シンボルの後のURLの最後の部分と最初のピリオド（`.`）の前にある部分のための **action_name** 。
* 最後のピリオド(`.`)の後にあるURLの部分のための **action_ext** 。リクエストには存在しない場合があります。

    !!! warning "いくつかの期間の後で**action_name**と**action_ext**の間の境界"
        `/`シンボルの後のURLの最後の部分にいくつかのピリオド(`.`)がある場合、**action_name**と**action_ext**の間の境界に問題が発生する可能性があります。

        * 最初のピリオドに基づいて境界を設定する場合：

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * 例のように、パーサリング後にいくつかの要素が欠けている場合：

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        これを修正するには、URIコンストラクタの[advanced edit form](add-rule.ja.md#advanced-edit-form)で**action_name**と**action_ext**のポイントを手動で編集します。

* `?`シンボルの後の[query string parameters](#query-string-parameters)用の **query** 。

例：

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### クエリ文字列パラメータ

クエリ文字列パラメータは、`key=value`形式で `?` の文字の後にリクエストURLでアプリケーションに渡されます。**query**タグは、パーサーに対応します。

Request example | クエリ文字列パラメータと値
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### ヘッダー

ヘッダーはHTTPリクエストに表示され、その他のフォーマット（例：**multipart**）でも表示されます。**header**タグはパーサーに対応します。ヘッダー名は常に大文字に変換されます。

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

以下のタグは、HTTPリクエストメタデータのパーサーに対応します：

* **post** for the HTTPリクエスト本文
* **method** for the HTTPリクエスト方法: `GET`, `POST`, `PUT`, `DELETE`
* **proto** for the HTTPプロトコルバージョン
* **scheme**: http/https
* **application** for the アプリケーションID

### 追加のパーサー

複雑なリクエスト部分は、追加のパーサリングが必要になる場合があります（例：データがBase64エンコードされている場合や、配列形式で表示されている場合）。そのような場合、以下にリストされているパーサがリクエストパートに追加で適用されます。

#### base64

Base64エンコードされたデータをデコードし、リクエストの任意の部分に適用できます。

#### gzip

GZIPエンコードされたデータをデコードし、リクエストの任意の部分に適用できます。

#### htmljs

HTMLおよびJSシンボルをテキスト形式に変換し、リクエストの任意の部分に適用できます。

例: `&#x22;&#97;&#97;&#97;&#x22;` は `"aaa"` に変換されます。

#### json_doc

JSON形式のデータを解析し、リクエストの任意の部分に適用できます。

フィルタ：

* 配列要素の値のための **json_array** または **array**
* 連想配列のキーの値（`key:value`）用の **json_obj** または **hash**

例：

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`### XML

XML形式のデータを解析し、リクエストの任意の部分に適用できます。

フィルター:

* **xml_comment**：XMLドキュメントの本文にあるコメントを含む配列
* **xml_dtd**：使用されている外部DTDスキーマのアドレス
* **xml_dtd_entity**：Entity DTDドキュメントで定義されている配列
* **xml_pi**：処理する命令の配列
* **xml_tag** または **hash**：タグの連想配列
* **xml_tag_array** または **array**：タグ値の配列
* **xml_attr**：属性の連想配列。**xml_tag**フィルターの後にのみ使用できます

XMLパーサは、タグの内容とタグの値の配列の最初の要素を区別しません。つまり、パラメータ`[..., xml, xml_tag, 't1']`と`[..., xml, xml_tag, 't1', array, 0]`は同一であり、互換性があります。

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

* `[..., xml, xml_dtd_entity, 0]` — 名前 = `xxe`, 値 = `aaaa`
* `[..., xml, xml_pi, 0]` — 名前 = `xml-stylesheet`, 値 = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

### 配列

データ配列を解析します。リクエストの任意の部分に適用できます。

例：

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

### ハッシュ

連想データ配列（`key:value`）を解析し、リクエストの任意の部分に適用できます。

例：

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

### pollution

同じ名前のパラメータの値を組み合わせ、初期または復号化された形式のリクエストの任意の部分に適用できます。

例：

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

### percent

URLのシンボルを復号化し、URLの**uri**コンポーネントにのみ適用できます。

### cookie

Cookieリクエストパラメータを解析し、リクエストヘッダーにのみ適用できます。

例：

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`;

### form_urlencoded

`application/x-www-form-urlencoded`形式で渡されるリクエストの本文を解析し、リクエストの本文にのみ適用できます。

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

### grpc <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC APIリクエストを解析し、リクエストの本文にのみ適用できます。

プロトコルバッファーのデータに対しては、**protobuf**フィルターがサポートされています。

### multipart

`multipart`形式で渡されるリクエストの本文を解析し、リクエストの本文にのみ適用できます。

リクエスト本文のヘッダーに対しては、**header**フィルターがサポートされています。

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

`Content-Disposition`ヘッダーでファイル名が指定されている場合、このパラメータでファイルが読み込まれていると見なされます。パラメータは次のようになります。

* `[post, multipart, 'someparam', file]` — ファイルの内容

### viewstate

セッション状態の分析を目的としています。Microsoft ASP.NETで使用される技術で、リクエストの本文にのみ適用できます。

フィルター:

* **viewstate_array**：配列用
* **viewstate_pair**：配列用
* **viewstate_triplet**：配列用
* **viewstate_dict**：連想配列用
* **viewstate_dict_key**：文字列用
* **viewstate_dict_value**：文字列用
* **viewstate_sparse_array**：連想配列用

### jwt

JWTトークンを解析し、リクエストの任意の部分に適用できます。

JWTパーサは、検出されたJWT構造に基づいて以下のパラメータで結果を返します。

* `jwt_prefix`：サポートされているJWT値のプレフィックス（lsapi2、mobapp2、bearer）のいずれか。パーサはプレフィックス値を任意のレジスタで読み取ります。
* `jwt_header`：JWTヘッダー。値を取得した後、Wallarmは通常、[`base64`](#base64)および[`json_doc`](#json_doc)パーサを適用します。
* `jwt_payload`：JWTペイロード。値を取得した後、Wallarmは通常、[`base64`](#base64)および[`json_doc`](#json_doc)パーサを適用します。

JWTはリクエストの任意の部分で渡すことができます。そのため、`jwt`パーサを適用する前に、Wallarmは特定のリクエスト部分パーサ（[`query`](#query-string-parameters)や[`header`](#headers)など）を使用します。

`Authentication`ヘッダーに渡されるJWTの例：

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

[ルール](add-rule.ja.md)が適用されるリクエスト要素を定義するときには、

* 最初にJWTを含むリクエスト部分のパーサを選択します
* `jwt`パーサの値として上記の`jwt_*`パラメータの1つを指定します。例：JWTペイロードの`name`パラメータ値を指定する場合：

![!JWT param desc in a rule](../../images/user-guides/rules/request-element-desc.png)

### 標準

配列とキーデータ型のパーサに適用される標準です。標準は、データ分析の範囲を定義するために使用されます。標準の値は、パーサタグで示されます。例：**hash_all**、**hash_name**。

標準が指定されていない場合、処理が必要なエンティティの識別子がパーサに渡されます。例：JSONオブジェクトの名前やその他の識別子が**hash**の後に渡されます。

#### all

すべての要素、パラメータ、またはオブジェクトの値を取得するために使用されます。例：

* **query_all**：すべてのクエリ文字列パラメーター値
* **header_all**：すべてのヘッダー値
* **array_all**：すべての配列要素の値
* **hash_all**：すべてのJSONオブジェクトまたはXML属性値
* **jwt_all**：すべてのJWT値

#### name

すべての要素、パラメータ、またはオブジェクトの名前を取得するために使用されます。例：

* **query_name**：すべてのクエリ文字列パラメータ名
* **header_name**：すべてのヘッダー名
* **hash_name**：すべてのJSONオブジェクトまたはXML属性名
* **jwt_name**：すべてのJWT所持パラメータの名前