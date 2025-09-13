[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# リクエストの解析

リクエストを分析する際、Wallarmフィルタリングノードは包括的なパーサー群を使用します。リクエストの各部分を特定した後、各部分に対してパーサーを順次適用し、攻撃検知に利用するリクエストのメタパラメータを得ます。利用可能なパーサー、その適用ロジック、およびそのロジックに対して可能な設定について本記事で説明します。

効果的な解析のため、Wallarmは次の原則に従います。

* 保護対象アプリケーションと同じデータで処理します。例えば:

    アプリケーションがJSON APIを提供している場合、処理されるパラメータもJSON形式でエンコードされています。パラメータ値の取得にはJSONパーサーを使用します。データが複数回エンコードされるより複雑なケースもあります—例えば、JSONをBase64にし、それを再びJSONにするなどです。このような場合は複数のパーサーでのデコードが必要になります。

* データ処理のコンテキストを考慮します。例えば:

    `name`というパラメータは、作成リクエストにおいて製品名としてもユーザー名としても渡される可能性があります。ただし、そのようなリクエストの処理コードは異なる場合があります。これらのパラメータの分析方法を定義するために、Wallarmはリクエストが送信されたURLや他のパラメータを利用することがあります。

## リクエスト部分の特定と解析

HTTPリクエストの最上位から開始し、フィルタリングノードは各部分に対して適切な各パーサーを順次適用しようとします。適用されるパーサーの一覧は、データの性質とシステムの過去の学習結果に依存します。

パーサーからの出力は、同様の方法でさらに分析すべき追加のパラメータ群になります。パーサーの出力は、JSON、配列、連想配列のような複雑な構造になることもあります。

!!! info "パーサータグ"
    各パーサーには識別子（タグ）があります。例えば、リクエストヘッダー用のパーサーには`header`が付与されます。リクエスト分析に使用されたタグの集合は、Wallarm Consoleのイベント詳細内に表示されます。この情報により、攻撃が検出されたリクエスト部分と使用されたパーサーが分かります。

    例えば、`SOAPACTION`ヘッダーで攻撃が検出された場合:

    ![タグの例](../../images/user-guides/rules/tags-example.png)

### URL

各HTTPリクエストにはURLが含まれます。攻撃を見つけるため、フィルタリングノードは元の値とその個々の構成要素である**path**、**action_name**、**action_ext**、**query**を分析します。

URLパーサーに対応するタグは次のとおりです。

* **uri** はドメインを除いた元のURL値（例: `http://example.com/blogs/123/index.php?q=aaa`に送られたリクエストに対する`/blogs/123/index.php?q=aaa`）。
* **path** は`/`記号で区切られたURL部分の配列（URLの最後の部分は配列に含まれません）。URLに1つの部分しかない場合、配列は空になります。
* **action_name** は`/`記号の後、最初のピリオド（`.`）より前にあるURLの最後の部分です。このURL部分は、その値が空文字列であっても常にリクエスト内に存在します。
* **action_ext** は最後のピリオド（`.`）の後のURL部分です。リクエストに存在しない場合があります。

    !!! warning "最後の部分に複数のピリオドがある場合の**action_name**と**action_ext**の境界"
        URLの最後の部分（`/`の後）に複数のピリオド（`.`）がある場合、**action_name**と**action_ext**の境界に問題が生じることがあります。例えば:
        
        * 最初のピリオドを基準に境界が設定されるケース。例:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * 解析後に一部の要素が失われるケース。上記の例では以下のようになります:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        これを修正するには、URIコンストラクタの[advanced edit form](rules.md#advanced-edit-form)で**action_name**と**action_ext**のポイントを手動で編集してください。

* **query** は`?`記号の後の[クエリ文字列パラメータ](#query-string-parameters)です。 

例:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### クエリ文字列パラメータ

クエリ文字列パラメータは、`?`の後に`key=value`形式でリクエストURL内にアプリケーションへ渡されます。これに対応するパーサータグは**query**です。

Request example | Query string parameters and values
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### リクエスト送信元のIPアドレス

Wallarmルールにおけるリクエスト送信元IPアドレスのリクエストポイントは`remote_addr`です。このポイントは、IPごとのリクエストを制限する[**Advanced rate limiting**](rate-limiting.md)ルールでのみ使用します。

### ヘッダー

ヘッダーはHTTPリクエストやその他の一部の形式（例: **multipart**）に存在します。これに対応するパーサータグは**header**です。ヘッダー名は常に大文字に変換されます。

例:

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

HTTPリクエストのメタデータに対応するパーサータグは次のとおりです。

* **post** はHTTPリクエストボディ
* **method** はHTTPリクエストメソッド: `GET`、`POST`、`PUT`、`DELETE`
* **proto** はHTTPプロトコルバージョン
* **scheme**: http/https
* **application** はアプリケーションID

### 追加のパーサー

複雑なリクエスト部分は追加の解析が必要になる場合があります（例えば、データがBase64でエンコードされている、または配列形式で表現されている場合）。そのような場合、以下に列挙するパーサーが対象のリクエスト部分に対して追加で適用されます。

#### base64

Base64でエンコードされたデータをデコードします。リクエストの任意の部分に適用できます。

#### gzip

GZIPでエンコードされたデータをデコードします。リクエストの任意の部分に適用できます。

#### htmljs

HTMLおよびJSの記号をテキスト形式に変換します。リクエストの任意の部分に適用できます。

例: `&#x22;&#97;&#97;&#97;&#x22;` は`"aaa"`に変換されます。

#### json_doc

JSON形式のデータを解析します。リクエストの任意の部分に適用できます。

フィルター:

* **json_array** または **array** は配列要素の値
* **json_obj** または **hash** は連想配列のキー（`key:value`）の値

例:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

XML形式のデータを解析します。リクエストの任意の部分に適用できます。

フィルター:

* **xml_comment** はXMLドキュメント本体内のコメントの配列
* **xml_dtd** は使用中の外部DTDスキーマのアドレス
* **xml_dtd_entity** はEntity DTDドキュメントで定義された配列
* **xml_pi** は処理命令の配列
* **xml_tag** または **hash** はタグの連想配列

    !!! info "名前空間付き**xml_tag**の記法"
        **xml_tag**でURI、名前空間、タグ名を一緒に指定する場合、必要な区切り文字はWallarmノードのバージョンに依存します。

        * バージョン6.3.0以降では`URI|namespace|tag_name`（例: `https://www.w3.org/path|xhtml|html`）
        * 6.3.0より前のバージョンでは`URI:namespace:tag_name`（例: `https://www.w3.org/path:xhtml:html`）

* **xml_tag_array** または **array** はタグ値の配列
* **xml_attr** は属性の連想配列（**xml_tag**フィルターの後でのみ使用可能）

XMLパーサーは、タグの内容とタグ値配列の最初の要素を区別しません。つまり、`[..., xml, xml_tag, 't1']`と`[..., xml, xml_tag, 't1', array, 0]`は同一で相互に置換可能です。

例:

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- テスト -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

* `[..., xml, xml_dtd_entity, 0]` — name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]` — name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` テスト `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

データ配列を解析します。リクエストの任意の部分に適用できます。

例:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

連想配列（`key:value`）を解析します。リクエストの任意の部分に適用できます。

例:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

同名のパラメータの値を結合します。初期形式またはデコード済み形式のリクエスト任意の部分に適用できます。

例:

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

URL記号をデコードします。URLの**uri**コンポーネントにのみ適用できます。

#### cookie

Cookieリクエストパラメータを解析します。リクエストヘッダーにのみ適用できます。

例:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

`application/x-www-form-urlencoded`形式で渡されるリクエストボディを解析します。リクエストボディにのみ適用できます。

例:

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

#### grpc<a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC APIリクエストを解析します。リクエストボディにのみ適用できます。

Protocol Buffersデータ用の**protobuf**フィルターをサポートします。

#### multipart

`multipart`形式で渡されるリクエストボディを解析します。リクエストボディにのみ適用できます。

リクエストボディ内のヘッダー用に**header**フィルターをサポートします。

例:

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

`Content-Disposition`ヘッダーにファイル名が指定されている場合、そのパラメータにはファイルがアップロードされたと見なされます。パラメータは次のようになります。

* `[post, multipart, 'someparam', file]` — ファイルの内容

#### viewstate

セッション状態を分析するために設計されています。Microsoft ASP.NETで使用される技術で、リクエストボディにのみ適用できます。

フィルター:

* **viewstate_array** は配列
* **viewstate_pair** は配列
* **viewstate_triplet** は配列
* **viewstate_dict** は連想配列
* **viewstate_dict_key** は文字列
* **viewstate_dict_value** は文字列
* **viewstate_sparse_array** は連想配列

#### jwt

JWTトークンを解析します。リクエストの任意の部分に適用できます。

JWTパーサーは検出したJWT構造に応じて、次のパラメータで結果を返します。

* `jwt_prefix`: サポートされるJWT値プレフィックスのいずれか—lsapi2、mobapp2、bearer。パーサーはどの大文字小文字でもプレフィックス値を読み取ります。
* `jwt_header`: JWTヘッダー。値を取得すると、Wallarmは通常それに対して[`base64`](#base64)および[`json_doc`](#json_doc)パーサーも適用します。
* `jwt_payload`: JWTペイロード。値を取得すると、Wallarmは通常それに対して[`base64`](#base64)および[`json_doc`](#json_doc)パーサーも適用します。

JWTはリクエストの任意の部分で渡される可能性があります。そのため、`jwt`パーサーを適用する前に、Wallarmは特定のリクエスト部分用のパーサー、例えば[`query`](#query-string-parameters)や[`header`](#headers)を使用します。

`Authentication`ヘッダーで渡されたJWTの例:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

[ルール](rules.md)を適用するリクエスト要素を定義する際は次のようにします。

* まずJWTを含むリクエスト部分のパーサーを選択します
* 列挙した`jwt_*`パラメータのいずれかを`jwt`パーサーの値として指定します。例えばJWTペイロードの`name`パラメータ値に対しては次のとおりです。

![ルールでのJWTパラメータの指定](../../images/user-guides/rules/request-element-desc.png)

#### gql

GraphQLの実行可能定義（クエリ、ミューテーション、サブスクリプション、フラグメント）を解析し、GraphQL特有のリクエストポイントにおける[入力バリデーション攻撃](../../attacks-vulns-list.md#attack-types)の検知を改善します。NGINX Node 5.3.0以上、またはネイティブノード0.12.0が必要です。

フィルター:

 * **gql_query** はクエリオペレーション
 * **gql_mutation** はミューテーションオペレーション
 * **gql_subscription** はサブスクリプションオペレーション
 * **gql_alias** はフィールドエイリアス
 * **gql_arg** はフィールド引数
 * **gql_dir** はディレクティブ
 * **gql_spread** はフラグメントスプレッド
 * **gql_fragment** はフラグメント定義
 * **gql_type** はフラグメント定義またはインラインフラグメントの名前付き型
 * **gql_inline** はインラインフラグメント
 * **gql_var** は変数定義

例:

```
query GetUser {
  user(id: "1") {
    ...UserFields @include(if: true)
  }
}
```

* `[..., gql, gql_query, 'GetUser', hash, 'user', gql_arg, hash, 'id']` — `1`
* `[..., gql, gql_query, 'GetUser', hash, 'user', gql_spread,` `'UserFields', gql_dir, 'include', gql_arg, hash, 'if']` — `true`

```
query GetAllUsers {
  users(limit: 10) {
    ...UserFields @include(if: true)
  }
}
```

* `[..., gql, gql_query, 'GetAllUsers', hash, 'users', gql_arg, hash, 'limit']` — `10`
* `[..., gql, gql_query, 'GetAllUsers', hash, 'users',` `gql_spread, 'UserFields', gql_dir, 'include', gql_arg, hash, 'if']` — `true`

```
fragment UserFields on User {
  id
  name
  email
  posts(status: "published") {
    title
    content
  }
}
```

* `[..., gql, gql_fragment, 'UserFields', gql_type,` `'User', hash, 'posts', gql_arg, hash, 'status']` — `published`

このパーサーにより、[API SessionsにおけるGraphQLリクエストパラメータ](../../api-sessions/overview.md#graphql-requests-in-api-sessions)の値を抽出・表示したり、GraphQL特有のリクエスト部分に[ルール](rules.md)を適用したりできます。

![GraphQLリクエストポイントに適用されたルールの例](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

!!! info "WallarmによるGraphQL保護"
    デフォルトで[常に有効](#managing-parsers)なパーサーはGraphQLにおける通常の攻撃（SQLi、RCEなど）を検知しますが、Wallarmでは[GraphQL特有の攻撃からの保護](../../api-protection/graphql-rule.md)を**設定**することもできます。

### ノルム

ノルムは配列型およびキー型のデータに対するパーサーに適用されます。ノルムはデータ分析の境界を定義するために使用します。ノルムの値はパーサータグ内に示されます。例: **hash_all**、**hash_name**。

ノルムが指定されていない場合、処理対象のエンティティの識別子がパーサーに渡されます。例えば、**hash**の後にJSONオブジェクト名やその他の識別子が渡されます。

**all**

すべての要素、パラメータ、またはオブジェクトの値を取得するために使用します。例:

* **path_all** はURLパスのすべての部分
* **query_all** はすべてのクエリ文字列パラメータ値
* **header_all** はすべてのヘッダー値
* **array_all** はすべての配列要素の値
* **hash_all** はすべてのJSONオブジェクトまたはXML属性の値
* **jwt_all** はすべてのJWT値

**name**

すべての要素、パラメータ、またはオブジェクトの名前を取得するために使用します。例:

* **query_name** はすべてのクエリ文字列パラメータ名
* **header_name** はすべてのヘッダー名
* **hash_name** はすべてのJSONオブジェクトまたはXML属性の名前
* **jwt_name** はJWTを含むすべてのパラメータの名前

## パーサーの管理

デフォルトでは、リクエストを分析する際、Wallarmノードはリクエストの各要素に対して、該当する[パーサー](request-processing.md)を順次適用しようとします。ただし、一部のパーサーが誤って適用され、その結果、Wallarmノードがデコード後の値に攻撃の兆候を検出してしまうことがあります。

例えば、[Base64](https://en.wikipedia.org/wiki/Base64)のアルファベット記号は通常のテキスト、トークン値、UUID値、その他のデータ形式でも頻繁に使用されるため、Wallarmノードが未エンコードのデータをBase64でエンコードされたものと誤認することがあります。未エンコードのデータをデコードして、その結果の値に攻撃の兆候を検出してしまうと、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生します。

このような誤検知を防ぐために、Wallarmは特定のリクエスト要素に誤って適用されるパーサーを無効化する**Disable/Enable request parser**ルールを提供します。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Configure parsers**を選択します。
1. **If request is**で、ルールを適用する範囲を[記述](rules.md#configuring)します。
1. `off`/`on`にするパーサーを追加します。
1. **In this part of request**で、このルールを設定したいリクエストポイントを指定します。Wallarmは、選択したリクエストパラメータの値が同じであるリクエストを対象に制限します。

    利用可能なポイントは本記事の上部で説明しています。お使いのユースケースに合致するものを選択してください。

1. [ルールのコンパイルとフィルタリングノードへのアップロードが完了する](rules.md#ruleset-lifecycle)までお待ちください。

**ルール例**

`https://example.com/users/`へのリクエストに認証ヘッダー`X-AUTHTOKEN`が必要だとします。ヘッダー値には特定の記号の組み合わせ（例えば末尾の`=`など）が含まれることがあり、Wallarmが`base64`パーサーでデコードしてしまい、攻撃兆候を誤検知する可能性があります。誤検知を回避するため、このデコードを防ぐ必要があります。 

そのためには、スクリーンショットのようにルールを設定します。

![ルール「Disable/Enable request parser」の例](../../images/user-guides/rules/disable-parsers-example.png)