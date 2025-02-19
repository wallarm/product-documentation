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

# HTTPパーサー

暗黙の**HTTPパーサー**は、リクエストの処理を年次で行います。フィルタを利用するときに、その名前をポイントに指定する必要はありません。

HTTPパーサーは、ベースとなるリクエストに基づいた複雑なデータ構造を構築します。以下のフィルタを使用して、このデータ構造の要素にアクセスできます:

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "ポイントでのフィルタ利用方法"
    ポイントでフィルタを利用するには、ポイントにフィルタ名を大文字で追加します。

## URIフィルタ

**URI**フィルタは、リクエストターゲットへの絶対パスを指します。絶対パスは、ドメインまたはターゲットのIPアドレスに続く「/」記号から始まります。

URIフィルタは文字列の値を指します。このフィルタは複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。

**例:**

`URI_value`ポイントは、`GET http://example.com/login/index.php`リクエストにおける`/login/index.php`文字列を指します。

## Pathフィルタ

**Path**フィルタは、URIパスの各部分を含む配列を指します。この配列の要素には、そのインデックスを使用してアクセスする必要があります。配列のインデックスは`0`から始まります。

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスは、[Rubyプログラミング言語][link-ruby]の正規表現にすることができます。  

**例:**

`GET http://example.com/main/login/index.php HTTP/1.1`リクエストでは、Pathフィルタは次の配列を指します:

| インデックス | 値       |
|--------------|----------|
| 0            | main     |
| 1            | login    |

* `PATH_0_value`ポイントは、Pathフィルタのインデックス`0`で示される配列内の`main`の値を指します。
* `PATH_1_value`ポイントは、Pathフィルタのインデックス`1`で示される配列内の`login`の値を指します。

リクエストURIに1つの部分のみが含まれている場合、Pathフィルタは空の配列を指します。

**例:**

`GET http://example.com/ HTTP/1.1`リクエストでは、Pathフィルタは空の配列を指します。

## Action_nameフィルタ

**Action_name**フィルタは、最後の「/」記号の直後から始まり、ピリオドで終わるURIの部分を指します。

Action_nameフィルタは文字列の値を指します。このフィルタは複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。

**例:**
* `GET http://example.com/login/index.php`リクエストでは、`ACTION_NAME_value`ポイントは`index`の値を指します。
* `GET http://example.com/login/`リクエストでは、`ACTION_NAME_value`ポイントは空の値を指します。

## Action_extフィルタ

**Action_ext**フィルタは、最後の「/」記号の後に続く最初のピリオドの後から始まるURIの部分を指します。このURI部分がリクエストに存在しない場合、Action_extフィルタはポイントで使用できません。

Action_extフィルタは文字列の値を指します。このフィルタは複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。

**例:**

* `GET http://example.com/main/login/index.php`リクエストでは、`ACTION_EXT_value`ポイントは`php`の値を指します。
* `GET http://example.com/main/login/`リクエストでは、Action_extフィルタはポイントで使用できません。

## Getフィルタ

**Get**フィルタは、リクエストのクエリ文字列からパラメータを含むハッシュテーブルを指します。このハッシュテーブルの要素には、パラメータ名を使用してアクセスする必要があります。

!!! info "ポイントにおける正規表現"
    ポイント内のパラメータ名は、[Rubyプログラミング言語][link-ruby]の正規表現にすることができます。

クエリ文字列のパラメータは、配列やハッシュテーブルといった複雑なデータ構造を含む場合もあります。これらの構造の要素にアクセスするために、それぞれ[Array][link-get-array]および[Hash][link-get-hash]フィルタを使用します。

**例:**

`POST http://example.com/login?id=01234&username=admin`リクエストでは、Getフィルタは次のハッシュテーブルを指します:

| パラメータ名 | 値     |
|--------------|--------|
| id           | 01234  |
| username     | admin  |

* `GET_id_value`ポイントは、Getフィルタで参照されるハッシュテーブルの`id`パラメータに対応する`01234`の値を指します。
* `GET_username_value`ポイントは、Getフィルタで参照されるハッシュテーブルの`username`パラメータに対応する`admin`の値を指します。

## Headerフィルタ

**Header**フィルタは、ヘッダ名と値を含むハッシュテーブルを指します。このハッシュテーブルの要素には、ヘッダ名を使用してアクセスする必要があります。

!!! info "ポイントにおけるヘッダ名"
    ポイント内のヘッダ名は、以下のいずれかの方法で指定できます:

    * 大文字で指定
    * リクエストで指定された通りに指定

!!! info "ポイントにおける正規表現"
    ポイント内のヘッダ名は、[Rubyプログラミング言語][link-ruby]の正規表現にすることができます。

ヘッダ名は、値の配列を含む場合もあります。この配列の要素にアクセスするために、[Array][link-header-array]フィルタを使用します。

**例:**

以下のリクエスト

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

において、Headerフィルタは次のハッシュテーブルを指します:

| ヘッダ名          | 値          |
|-------------------|-------------|
| Connection        | keep-alive  |
| Host              | example.com |
| Accept-Encoding   | gzip        |

* `HEADER_Connection_value`ポイントは、Headerフィルタで参照されるハッシュテーブルの`Connection`ヘッダに対応する`keep-alive`の値を指します。
* `HEADER_Host_value`ポイントは、Headerフィルタで参照されるハッシュテーブルの`Host`ヘッダに対応する`example.com`の値を指します。
* `HEADER_Accept-Encoding_value`ポイントは、Headerフィルタで参照されるハッシュテーブルの`Accept-Encoding`ヘッダに対応する`gzip`の値を指します。

## Postフィルタ

**Post**フィルタは、リクエストボディの内容を指します。

Postフィルタの名前をポイントに使用することで、リクエストボディの内容を生の形式で扱うことができます。

**例:**

以下のリクエスト

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

において、本文が

```
This is a simple body text.
```

の場合、`POST_value`ポイントはリクエストボディから`This is a simple body text.`の値を指します。

また、複雑なデータ構造を含むリクエストボディも扱うことができます。Postフィルタの後に、以下のフィルタおよびパーサーを使用して、対応するデータ構造の要素にアクセスします: 
* **form-urlencoded**形式のリクエストボディのための[Form_urlencoded][link-formurlencoded]パーサー
* **multipart**形式のリクエストボディのための[Multipart][link-multipart]パーサー
* **XML**形式のリクエストボディのための[XMLパーサーが提供するフィルタ][link-xml]
* **JSON**形式のリクエストボディのための[Json_docパーサーが提供するフィルタ][link-json]