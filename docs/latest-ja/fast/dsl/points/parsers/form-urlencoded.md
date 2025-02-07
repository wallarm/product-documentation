[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Form_urlencoded パーサー

**Form_urlencoded**パーサーは、form-urlencoded形式のリクエストボディを処理するために使用されます。このパーサーは、リクエストボディパラメータの名前をキーとし、対応するパラメータの値をハッシュテーブルの値として作成します。このハッシュテーブルの要素には、パラメータの名前を使用して参照する必要があります。

!!! info "ポイントにおける正規表現"
    ポイント内のパラメータ名は、[Rubyプログラミング言語][link-ruby]の正規表現にすることができます。

!!! warning "ポイントでのForm_urlencodedパーサーの使用"
    Form_urlencodedパーサーは、ベースラインリクエストボディを参照するPostフィルターと併用する場合に限り、ポイントで使用できます。

form-urlencoded形式のリクエストボディには、配列やハッシュテーブルなどの以下の複雑なデータ構造が含まれる場合もあります。これらの構造内の要素にアクセスするには、[Array][link-formurlencoded-array]および[Hash][link-formurlencoded-hash]フィルターをそれぞれ使用してください。

**例:**

下記の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストに

```
id=01234&username=John
```

ボディが付随している場合、リクエストボディに適用されたForm_urlencodedパーサーは、以下のハッシュテーブルを作成します:

| Key      | Value    |
|----------|----------|
| id       | 01234    |
| username | John     |

* `POST_FORM_URLENCODED_id_value`ポイントは、Form_urlencodedパーサーによって作成されたハッシュテーブルの`id`キーに対応する`01234`の値を指します。
* `POST_FORM_URLENCODED_username_value`ポイントは、Form_urlencodedパーサーによって作成されたハッシュテーブルの`username`キーに対応する`John`の値を指します。