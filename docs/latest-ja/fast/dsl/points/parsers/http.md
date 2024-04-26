[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded]:      form-urlencoded.md
[link-multipart]:           multipart.md
[link-xml]:                 xml.md
[link-json]:                json.md

[link-get-array]:           array.md#the-example-of-using-the-get-filter-with-the-array-filter
[link-get-hash]:            hash.md#the-example-of-using-the-get-filter-and-the-hash-filter
[link-header-array]:        array.md#the-example-of-using-the-header-filter-with-the-array-filter

[anchor1]:      #uri-filter
[anchor2]:      #path-filter
[anchor3]:      #action_name-filter
[anchor4]:      #action_ext-filter
[anchor5]:      #get-filter
[anchor6]:      #header-filter
[anchor7]:      #post-filter

# HTTP パーサー

暗黙の**HTTP パーサー**は年間のリクエスト処理を行います。その名前は、それによって提供されるフィルターを使用する際に、ポイントで指定する必要はありません。

HTTP パーサーは、基本リクエストに基づいて複雑なデータ構造を構築します。このデータ構造の要素にアクセスするために以下のフィルターを使用できます：

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "ポイントでのフィルターの使用"
    ポイントでフィルターを使用するには、フィルターの名前を大文字でポイントに追加します。

## URI フィルター

**URI**フィルターは、リクエスト対象への絶対パスを指します。絶対パスは、ターゲットのドメインまたはIPアドレスに続く`/`記号で始まります。

URIフィルターは文字列値を指します。このフィルターは複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。

**例：** 

`URI_value`ポイントは、`GET http://example.com/login/index.php` リクエスト中の `/login/index.php` 文字列を指します。


## Path フィルター

**Path** フィルターは、URIパスのパーツを含む配列を参照します。この配列の要素は、そのインデックスを使用して参照する必要があります。配列のインデックス付けは`0`から始まります。

!!! info "ポイントでの正規表現"
    ポイントでのインデックスは、[Ruby プログラミング言語][link-ruby]の正規表現になることがあります。

**例：** 

`GET http://example.com/main/login/index.php HTTP/1.1`のリクエストに対して、Path フィルターは次の配列を参照します：

| インデックス  | 値       |
|--------|------------|
| 0      | main       |
| 1      | login      |

* `PATH_0_value` ポイントは、`0` インデックスの Path フィルターによってアドレス指定された配列内の `main` 値を参照します。
* `PATH_1_value` ポイントは、`1` インデックスの Path フィルターによってアドレス指定された配列内の `login` 値を参照します。

リクエストURIが一部のみを含む場合、Path フィルターは空の配列を参照します。

**例：**

`GET http://example.com/ HTTP/1.1` のリクエストに対して、Path フィルターは空の配列を参照します。

## Action_name フィルター

**Action_name** フィルターは、URIの最後の`/`記号の後から始まり、ピリオドで終わる部分を参照します。

Action_nameフィルタは文字列値を指します。このフィルターは複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。

**例：** 
* `ACTION_NAME_value` ポイントは、`GET http://example.com/login/index.php` のリクエストに対して `index` 値を参照します。
* `ACTION_NAME_value` ポイントは、`GET http://example.com/login/` のリクエストに対して空の値を参照します。

## Action_ext フィルター

**Action_ext** フィルターは、URIの最後の`/`記号に続く最初のピリオドの後から始まる部分を参照します。このURIの部分がリクエストから欠落している場合、Action_extフィルタはポイントで使用できません。

Action_extフィルターは文字列値を指します。このフィルターは複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。

**例：** 

* `ACTION_EXT_value` ポイントは、`GET http://example.com/main/login/index.php`のリクエストに対して `php` 値を参照します。
* `GET http://example.com/main/login/` のリクエストを指すポイントでは、Action_ext フィルターは使用できません。

## Get フィルター

**Get** フィルターは、リクエストのクエリ文字列からのパラメータを含むハッシュテーブルを参照します。このハッシュテーブルの要素は、パラメータの名前を使用して参照する必要があります。

!!! info "ポイントでの正規表現"
    ポイントでのパラメータ名は、[Ruby プログラミング言語][link-ruby]の正規表現になることがあります。

クエリ文字列のパラメータは、配列やハッシュテーブルといった複雑なデータ構造も含むことがあります。これらの構造内の要素にアクセスするには、それぞれに対応する[Array][link-get-array] フィルターや [Hash][link-get-hash] フィルターを使用します。

**例：** 

`POST http://example.com/login?id=01234&username=admin` のリクエストに対して、Get フィルターは次のハッシュテーブルを参照します：

| パラメーター名 | 値     |
|----------------|---------|
| id             | 01234   |
| username       | admin   |

* `GET_id_value` ポイントは、Get フィルターによってアドレス指定されたハッシュテーブルから `id` パラメータに対応する `01234` 値を参照します。
* `GET_username_value` ポイントは、Get フィルターによってアドレス指定されたハッシュテーブルから `username` パラメータに対応する `admin` 値を参照します。

## Header フィルター

**Header** フィルターは、ヘッダー名と値を含むハッシュテーブルを参照します。このハッシュテーブルの要素は、ヘッダーの名前を使用して参照する必要があります。

!!! info "ポイントでのヘッダー名"
    ヘッダー名は、以下のいずれかの方法でポイントに指定できます：

    * 大文字で
    * リクエストで指定されているのと同じ方法

!!! info "ポイントでの正規表現"
    ポイントでのヘッダー名は、[Ruby プログラミング言語][link-ruby]の正規表現になることがあります。

ヘッダーの名前には値の配列も含めることができます。この配列の要素にアクセスするには、[Array][link-header-array] フィルタを使用します。

**例：** 

以下のリクエスト、

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

に対して、Header フィルターは次のハッシュテーブルを参照します：

| ヘッダー名        | 値            |
|-----------------|----------------|
| Connection      | keep-alive     |
| Host            | example.com    |
| Accept-Encoding | gzip           |

* `HEADER_Connection_value` ポイントは、Header フィルターによってアドレス指定されたハッシュテーブルから `Connection` ヘッダに対応する `keep-alive` 値を参照します。
* `HEADER_Host_value` ポイントは、Header フィルターによってアドレス指定されたハッシュテーブルから `Host` ヘッダーに対応する `example.com` 値を参照します。
* `HEADER_Accept-Encoding_value` ポイントは、Header フィルターによってアドレス指定されたハッシュテーブルから `Accept-Encoding` ヘッダーに対応する `gzip` 値を参照します。

## Post フィルター

**Post** フィルターはリクエストボディの内容を参照します。

ポイントで Post フィルターの名前を使用して、リクエストボディの内容を生形式で操作することができます。

**例：** 

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

というリクエストと、

```
This is a simple body text.
```

というボディを持つ場合、`POST_value` ポイントは、リクエストボディから `This is a simple body text.` 値を参照します。

また、リクエストボディ内に複雑なデータ構造が含まれている場合も対応可能です。対応するデータ構造の要素をアドレス指定するために、Post フィルターの後のポイントで以下のフィルターやパーサーを使用します： 
* **form-urlencoded** 形式のリクエストボディに対しては、[Form_urlencoded][link-formurlencoded] パーサー
* **multipart** 形式のリクエストボディに対しては、[Multipart][link-multipart] パーサー
* **XML** 形式のリクエストボディに対しては、[XML パーサーが提供するフィルター][link-xml]
* **JSON** 形式のリクエストボディに対しては、[Json_doc パーサーが提供するフィルター][link-json]