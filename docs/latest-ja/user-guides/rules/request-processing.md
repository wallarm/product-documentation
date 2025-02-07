[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# リクエストのパース

リクエストの解析時に、Wallarmフィルタリングノードは包括的なパーサ群を使用します。リクエストの各部分を識別した後、パーサはこれらへ順次適用され、攻撃検出にさらに使用されるリクエストのメタパラメータが提供されます。使用可能なパーサ、使用ロジック、およびそのロジックの可能な設定については本記事に記載されています。

効果的なパースのため、Wallarmは以下の原則に従います:

* 保護対象のアプリケーションと同じデータを使用します。例えば:

    アプリケーションがJSON APIを提供している場合、処理されたパラメータもJSON形式でエンコードされます。パラメータ値を取得するために、WallarmはJSONパーサを使用します。さらに、データが複数回エンコードされるより複雑なケースも存在します—例えば、JSONからBase64へ、更にJSONへ。こうした場合には、複数のパーサを使ってデコードする必要があります。

* データ処理の文脈を考慮します。例えば:

    パラメータ`name`は、作成リクエストにおいて製品名やユーザー名として渡される場合があります。しかし、そのようなリクエストの処理コードは異なる可能性があります。こうしたパラメータの解析方法を定義するために、Wallarmはリクエストが送信されたURLや他のパラメータを使用する場合があります。

## リクエスト部分の識別とパース

HTTPリクエストの最上位から、フィルタリングノードは各リクエスト部分に対して順次適切なパーサを適用しようと試みます。適用されるパーサのリストは、データの性質やシステムの事前学習の結果に依存します。

パーサからの出力は、同様に解析されるべき追加のパラメータセットとなります。パーサの出力は、時にはJSON、配列、または連想配列のような複雑な構造となる場合があります。

!!! info "パーサタグ"
    各パーサには識別子（タグ）が割り当てられています。例えば、リクエストヘッダー用パーサの場合は`header`です。リクエスト解析で使用されるタグのセットは、Wallarm Consoleのイベント詳細内に表示されます。このデータは、検出された攻撃と使用されたパーサを含むリクエスト部分を示しています。

    例えば、`SOAPACTION`ヘッダーで攻撃が検出された場合:

    ![Tag example](../../images/user-guides/rules/tags-example.png)

### URL

各HTTPリクエストにはURLが含まれます。攻撃を検出するために、フィルタリングノードは元の値とその個々の構成要素（**path**、**action_name**、**action_ext**、**query**）を解析します。

以下のタグはURLパーサに対応します:

* **uri** — ドメインを除いた元のURL値（例：`http://example.com/blogs/123/index.php?q=aaa`に送信されたリクエストの場合、`/blogs/123/index.php?q=aaa`）。
* **path** — URLのパーツが`/`記号で区切られた配列。URLの最後の部分は配列に含まれません。URLが1つのパーツだけの場合、配列は空になります。
* **action_name** — `/`記号の後、最初のピリオド（`.`）の前のURLの最後の部分。たとえ値が空文字であっても、リクエストには常に存在します。
* **action_ext** — URLの最後のピリオド（`.`）以降の部分。リクエストに存在しない場合もあります。

    !!! warning "**action_name**と**action_ext**の境界—複数のピリオドが存在する場合"
        もし`/`記号の後のURLの最後の部分に複数のピリオド（`.`）が存在する場合、**action_name**と**action_ext**の境界で問題が発生する可能性があります。例えば:
        
        * 最初のピリオドに基づいて境界が設定される例:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * パース後に一部の要素が欠落する例:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        これを修正するには、URIコンストラクタの[advanced edit form](rules.md#advanced-edit-form)で**action_name**および**action_ext**を手動で編集してください。

* **query** — `?`記号以降のリクエストにおける[query string parameters](#query-string-parameters)。

例:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### クエリ文字列パラメータ

クエリ文字列パラメータは、リクエストURLの`?`以降で`key=value`形式にてアプリケーションへ渡されます。**query**タグはこのパーサに対応します。

リクエスト例 | クエリ文字列パラメータと値
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `いくつかのテキスト`</li><li>`[query, 'check']` — `はい`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### リクエスト元のIPアドレス

Wallarmルールにおけるリクエスト元IPアドレスのポイントは`remote_addr`です。このポイントは、IPごとのリクエストを制限する[**Set rate limit**](rate-limiting.md)ルールでのみ使用されます。

### ヘッダー

ヘッダーはHTTPリクエストおよび一部の他の形式（例：**multipart**）で提示されます。**header**タグはこのパーサに対応します。ヘッダー名は常に大文字に変換されます。

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

以下のタグはHTTPリクエストのメタデータ用パーサに対応します:

* **post** — HTTPリクエストのボディ
* **method** — HTTPリクエストメソッド（`GET`、`POST`、`PUT`、`DELETE`）
* **proto** — HTTPプロトコルのバージョン
* **scheme** — http/https
* **application** — アプリケーションID

### 追加パーサ

複雑なリクエスト部分は追加のパースが必要な場合があります（例：データがBase64エンコードされている場合や配列形式で提示される場合）。そのような場合、以下のリストにあるパーサがリクエスト部分に追加適用されます。

#### base64

Base64エンコードされたデータをデコードし、リクエストの任意の部分に適用可能です。

#### gzip

GZIPエンコードされたデータをデコードし、リクエストの任意の部分に適用可能です。

#### htmljs

HTMLおよびJSの記号をテキスト形式に変換し、リクエストの任意の部分に適用可能です。

例: `&#x22;&#97;&#97;&#97;&#x22;`は`"aaa"`に変換されます。

#### json_doc

JSON形式のデータを解析し、リクエストの任意の部分に適用可能です。

フィルタ:

* **json_array**または**array** — 配列要素の値
* **json_obj**または**hash** — 連想配列キーの値（`key:value`）

例:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

XML形式のデータを解析し、リクエストの任意の部分に適用可能です。

フィルタ:

* **xml_comment** — XML文書本文内のコメントの配列
* **xml_dtd** — 使用されている外部DTDスキーマのアドレス
* **xml_dtd_entity** — Entity DTD文書で定義された配列
* **xml_pi** — 処理する命令の配列
* **xml_tag**または**hash** — タグの連想配列
* **xml_tag_array**または**array** — タグ値の配列
* **xml_attr** — 属性の連想配列（**xml_tag**フィルタの後のみ使用可能）

XMLパーサは、タグの内容とタグ値の配列の最初の要素を区別しません。すなわち、パラメータ`[..., xml, xml_tag, 't1']`と`[..., xml, xml_tag, 't1', array, 0]`は同一であり、互換性があります。

例:

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

データ配列を解析し、リクエストの任意の部分に適用可能です。

例:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

連想データ配列（`key:value`）を解析し、リクエストの任意の部分に適用可能です。

例:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

同じ名前のパラメータの値を結合し、初期またはデコードされた形式のリクエストの任意の部分に適用可能です。

例:

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

URLの記号をデコードし、**uri**コンポーネントのみに適用可能です。

#### cookie

Cookieリクエストパラメータを解析し、リクエストヘッダーのみに適用可能です。

例:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

`application/x-www-form-urlencoded`形式で渡されるリクエストボディを解析し、リクエストボディのみに適用可能です。

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

**grpc** <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC APIリクエストを解析し、リクエストボディのみに適用可能です。Protocol Buffersデータ向けの**protobuf**フィルタをサポートします。

#### multipart

`multipart`形式で渡されるリクエストボディを解析し、リクエストボディのみに適用可能です。

リクエストボディ内のヘッダーに対して、**header**フィルタをサポートします。

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

もし`Content-Disposition`ヘッダーでファイル名が指定されている場合、そのファイルはこのパラメータに読み込まれているとみなされます。パラメータは以下のようになります:

* `[post, multipart, 'someparam', file]` — file contents

#### viewstate

セッション状態を解析するために設計されています。この技術はMicrosoft ASP.NETで使用され、リクエストボディのみに適用可能です。

フィルタ:

* **viewstate_array** — 配列
* **viewstate_pair** — 配列
* **viewstate_triplet** — 配列
* **viewstate_dict** — 連想配列
* **viewstate_dict_key** — 文字列
* **viewstate_dict_value** — 文字列
* **viewstate_sparse_array** — 連想配列

#### jwt

JWTトークンを解析し、リクエストの任意の部分に適用可能です。

JWTパーサは、検出されたJWT構造に応じて、以下のパラメータに結果を返します:

* `jwt_prefix` — サポートされているJWT値のプレフィックスのいずれか（lsapi2, mobapp2, bearer）。パーサは大文字小文字を区別せずにプレフィックス値を読み取ります。
* `jwt_header` — JWTヘッダー。値を取得した後、Wallarmは通常[`base64`](#base64)および[`json_doc`](#json_doc)パーサを適用します。
* `jwt_payload` — JWTペイロード。値を取得した後、Wallarmは通常[`base64`](#base64)および[`json_doc`](#json_doc)パーサを適用します。

JWTはリクエストの任意の部分で渡される可能性があります。そのため、`jwt`パーサを適用する前に、Wallarmは特定のリクエスト部分パーサ（例、[query string parameters](#query-string-parameters)や[headers](#headers)）を使用します。

例: `Authentication`ヘッダーに渡されるJWT:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

リクエスト要素を定義する際、[rule](rules.md)は以下に適用されます:

* まず、JWTを含むリクエスト部分のパーサを選択します
* リストされている`jwt_*`パラメータのいずれかを`jwt`パーサの値として指定します。例として、JWTペイロード中の`name`パラメータ値の場合:

![JWT param desc in a rule](../../images/user-guides/rules/request-element-desc.png)

#### gql

GraphQLの実行可能な定義（クエリ、ミューテーション、サブスクリプション、フラグメント）を解析し、GraphQL固有のリクエストポイントにおける[入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)の検出を向上させます。NGINX Node 5.3.0以上が必要であり、現時点ではNative Nodeではサポートされていません。

フィルタ:

 * **gql_query** — クエリ操作
 * **gql_mutation** — ミューテーション操作
 * **gql_subscription** — サブスクリプション操作
 * **gql_alias** — フィールドエイリアス
 * **gql_arg** — フィールド引数
 * **gql_dir** — ディレクティブ
 * **gql_spread** — フラグメントスプレッド
 * **gql_fragment** — フラグメント定義
 * **gql_type** — フラグメント定義またはインラインフラグメントの型名
 * **gql_inline** — インラインフラグメント
 * **gql_var** — 変数定義

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

このパーサは、[API Sessions](../../api-sessions/overview.md#graphql-requests-in-api-sessions)におけるGraphQLリクエストパラメータの値を抽出・表示し、GraphQL固有のリクエスト部分に[rules](rules.md)を適用することを可能にします:

![Example of the rule applied to GraphQL request point"](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

!!! info "WallarmによるGraphQL保護"
    デフォルトで常に有効なパーサ（[常時有効](#managing-parsers)）は、GraphQLにおいて通常の攻撃（SQLi、RCEなど）の検出を提供しますが、WallarmはGraphQL固有の攻撃からの保護を[設定する](../../api-protection/graphql-rule.md)ことも可能です。

### ノーム

ノームは配列やキーのデータ型のパーサに適用されます。ノームはデータ解析の境界を定義するために使用され、ノームの値はパーサタグに示されます。例: **hash_all**、**hash_name**。

ノームが指定されていない場合、処理が必要なエンティティの識別子がパーサに渡されます。例として、JSONオブジェクトの名前や他の識別子が**hash**の後に渡されます。

**all**

すべての要素、パラメータ、またはオブジェクトの値を取得するために使用されます。例:

* **path_all** — URLパスのすべての部分
* **query_all** — すべてのクエリ文字列パラメータ値
* **header_all** — すべてのヘッダー値
* **array_all** — すべての配列要素の値
* **hash_all** — すべてのJSONオブジェクトまたはXML属性の値
* **jwt_all** — すべてのJWT値

**name**

すべての要素、パラメータ、またはオブジェクトの名前を取得するために使用されます。例:

* **query_name** — すべてのクエリ文字列パラメータ名
* **header_name** — すべてのヘッダー名
* **hash_name** — すべてのJSONオブジェクトまたはXML属性名
* **jwt_name** — すべてのJWTパラメータ名

## パーサの管理

デフォルトでは、リクエスト解析の際、Wallarmノードは適切な[parsers](request-processing.md)をリクエストの各要素に順次適用しようとします。しかし、特定のパーサが誤って適用され、その結果、デコードされた値に攻撃の兆候が検出される場合があります。

例えば、Base64のアルファベット記号は通常のテキスト、トークン値、UUID値、その他のデータ形式で頻繁に使用されるため、Wallarmノードがエンコードされていないデータを誤って[Base64](https://en.wikipedia.org/wiki/Base64)エンコードされたものと識別し、デコード後の値で攻撃の兆候を検知すると、[false positive](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生します。

このような場合のfalse positiveを防ぐために、Wallarmは特定のリクエスト要素に誤って適用されたパーサを無効化するための**Disable/Enable request parser**ルールを提供します。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Configure parsers**を選択します。
1. **If request is**において、ルールを適用する範囲を[rules.md#configuring](rules.md#configuring)に記述します。
1. `off`/`on`に設定するパーサを追加します。
1. **In this part of request**において、ルールを設定したいリクエストポイントを指定します。Wallarmは、選択されたリクエストパラメータの値が同一のリクエストを制限します。

    利用可能なすべてのポイントは上記本記事に記載されていますので、特定のユースケースに合致するものを選択できます。

1. [rule compilation and uploading to the filtering nodeによる完了](rules.md#ruleset-lifecycle)を待ちます。

**ルール例**

例えば、`https://example.com/users/`へのリクエストでは、認証ヘッダー`X-AUTHTOKEN`が必要とされます。ヘッダー値には、Wallarmがパーサ`base64`でデコードし、攻撃の兆候を誤検知する可能性のある特定の記号の組み合わせ（例：末尾の`=`）が含まれる場合があります。false positiveを避けるため、このデコードを防ぐ必要があります。 

そのため、以下のスクリーンショットに示すようにルールを設定します:

![Example of the rule "Disable/Enable request parser"](../../images/user-guides/rules/disable-parsers-example.png)