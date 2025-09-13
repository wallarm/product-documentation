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

暗黙の**HTTPパーサー**は通常のリクエスト処理を行います。提供されるフィルターをポイントで使用する際に、このパーサー名をポイントに指定する必要はありません。

HTTPパーサーはベースとなるリクエストに基づいて複雑なデータ構造を構築します。このデータ構造の要素を参照するには、次のフィルターを使用できます。

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "ポイントでのフィルター使用"
    ポイントでフィルターを使用するには、ポイントにフィルター名を大文字で追加します。

## URIフィルター

**URI**フィルターは、リクエスト対象への絶対パスを参照します。絶対パスは、対象のドメインまたはIPアドレスに続く`/`記号から始まります。

URIフィルターは文字列値を参照します。このフィルターは配列やハッシュテーブルなどの複雑なデータ構造を参照できません。

**例:** 

`URI_value`ポイントは、`GET http://example.com/login/index.php`リクエストにおける`/login/index.php`という文字列を参照します。


## Pathフィルター

**Path**フィルターは、URIパスの各部分を含む配列を参照します。この配列の要素は、そのインデックスを用いて参照する必要があります。配列のインデックスは`0`から始まります。

!!! info "ポイントでの正規表現"
    ポイント中のインデックスには[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

**例:** 

`GET http://example.com/main/login/index.php HTTP/1.1`リクエストでは、Pathフィルターは次の配列を参照します。

| インデックス  | 値      |
|--------|----------|
| 0      | main     |
| 1      | login    |

* `PATH_0_value`ポイントは、Pathフィルターでインデックス`0`を指定して参照される配列内にある`main`の値を参照します。
* `PATH_1_value`ポイントは、Pathフィルターでインデックス`1`を指定して参照される配列内にある`login`の値を参照します。

リクエストURIが1つの部分のみを含む場合、Pathフィルターは空の配列を参照します。

**例:**

`GET http://example.com/ HTTP/1.1`リクエストでは、Pathフィルターは空の配列を参照します。

## Action_nameフィルター

**Action_name**フィルターは、最後の`/`記号の直後から始まり、ピリオドで終わるURIの部分を参照します。

Action_nameフィルターは文字列値を参照します。このフィルターは配列やハッシュテーブルなどの複雑なデータ構造を参照できません。


**例:** 
* `ACTION_NAME_value`ポイントは、`GET http://example.com/login/index.php`リクエストに対して`index`の値を参照します。

* `ACTION_NAME_value`ポイントは、`GET http://example.com/login/`リクエストに対して空の値を参照します。


## Action_extフィルター

**Action_ext**フィルターは、最後の`/`記号に続く最初のピリオドの後から始まるURIの部分を参照します。リクエストにこのURIの部分が存在しない場合、そのポイントではAction_extフィルターを使用できません。

Action_extフィルターは文字列値を参照します。このフィルターは配列やハッシュテーブルなどの複雑なデータ構造を参照できません。

**例:** 

* `ACTION_EXT_value`ポイントは、`GET http://example.com/main/login/index.php`リクエストに対して`php`の値を参照します。
* `GET http://example.com/main/login/`リクエストを参照するポイントではAction_extフィルターを使用できません。

## Getフィルター

**Get**フィルターは、リクエストのクエリ文字列からのパラメータを含むハッシュテーブルを参照します。このハッシュテーブルの要素は、パラメータ名を用いて参照する必要があります。

!!! info "ポイントでの正規表現"
    ポイント中のパラメータ名には[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。

クエリ文字列のパラメータには、配列やハッシュテーブルといった複雑なデータ構造が含まれる場合もあります。これらの構造内の要素を参照するには、それぞれ[Array][link-get-array]フィルターと[Hash][link-get-hash]フィルターを使用します。

**例:** 

`POST http://example.com/login?id=01234&username=admin`リクエストでは、Getフィルターは次のハッシュテーブルを参照します。

| パラメータ名 | 値 |
|----------------|-------|
| id             | 01234 |
| username       | admin |

* `GET_id_value`ポイントは、Getフィルターで参照されるハッシュテーブルにおける`id`パラメータに対応する`01234`の値を参照します。
* `GET_username_value`ポイントは、Getフィルターで参照されるハッシュテーブルにおける`username`パラメータに対応する`admin`の値を参照します。


## Headerフィルター

**Header**フィルターは、ヘッダー名と値を含むハッシュテーブルを参照します。このハッシュテーブルの要素は、ヘッダー名を用いて参照する必要があります。

!!! info "ポイントにおけるヘッダー名"
    ヘッダー名は、ポイント内で次のいずれかの方法で指定できます。

    * 大文字
    * リクエストで指定されているのと同じ表記

!!! info "ポイントでの正規表現"
    ポイント中のヘッダー名には[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。


ヘッダーの値が配列になる場合もあります。この配列の要素を参照するには[Array][link-header-array]フィルターを使用します。

**例:** 

次の

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

リクエストでは、Headerフィルターは次のハッシュテーブルを参照します。

| ヘッダー名     | 値       |
|-----------------|-------------|
| Connection      | keep-alive  |
| Host            | example.com |
| Accept-Encoding | gzip        |

* `HEADER_Connection_value`ポイントは、Headerフィルターで参照されるハッシュテーブルにおける`Connection`ヘッダーに対応する`keep-alive`の値を参照します。
* `HEADER_Host_value`ポイントは、Headerフィルターで参照されるハッシュテーブルにおける`Host`ヘッダーに対応する`example.com`の値を参照します。
* `HEADER_Accept-Encoding_value`ポイントは、Headerフィルターで参照されるハッシュテーブルにおける`Accept-Encoding`ヘッダーに対応する`gzip`の値を参照します。



## Postフィルター

**Post**フィルターは、リクエスト本文の内容を参照します。

ポイントでPostフィルター名を使用すると、リクエスト本文の内容を生の形式で扱えます。

**例:** 

次の

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

リクエストにおいて、次の

```
This is a simple body text.
```

本文がある場合、`POST_value`ポイントはリクエスト本文の`This is a simple body text.`という値を参照します。

複雑なデータ構造を含むリクエスト本文も扱えます。対応するデータ構造の要素を参照するには、ポイントでPostフィルターの後ろに次のフィルターやパーサーを指定します。 
* **form-urlencoded**形式のリクエスト本文には[Form_urlencoded][link-formurlencoded]パーサー
* **multipart**形式のリクエスト本文には[Multipart][link-multipart]パーサー
* **XML**形式のリクエスト本文には[XMLパーサーが提供するフィルター][link-xml]
* **JSON**形式のリクエスト本文には[Json_docパーサーが提供するフィルター][link-json]