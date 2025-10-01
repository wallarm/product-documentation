[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Form_urlencodedパーサー

**Form_urlencoded**パーサーは、form-urlencoded形式のリクエストボディを扱うために使用します。このパーサーは、リクエストボディのパラメータ名をキー、対応するパラメータの値を値とするハッシュテーブルを作成します。このハッシュテーブルの要素はパラメータ名で参照する必要があります。

!!! info "ポイント内の正規表現"
    ポイント内のパラメータ名には、[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。

!!! warning "ポイントでのForm_urlencodedパーサーの使用"
    Form_urlencodedパーサーは、ベースラインリクエストボディを参照するPostフィルターと組み合わせた場合にのみ、ポイントで使用できます。

form-urlencoded形式のリクエストボディには、配列やハッシュテーブルといった複雑なデータ構造が含まれる場合もあります。これらの構造内の要素を参照するには、[Arrayフィルター][link-formurlencoded-array]および[Hashフィルター][link-formurlencoded-hash]をそれぞれ使用します。

**例:** 

次の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストで、

```
id=01234&username=John
```

というボディの場合、リクエストボディにForm_urlencodedパーサーを適用すると、次のハッシュテーブルが作成されます:

| Key      | Value    |
|----------|----------|
| id       | 01234    |
| username | John     |

* `POST_FORM_URLENCODED_id_value`ポイントは、Form_urlencodedパーサーが作成したハッシュテーブルの`id`キーに対応する値`01234`を参照します。
* `POST_FORM_URLENCODED_username_value`ポイントは、Form_urlencodedパーサーが作成したハッシュテーブルの`username`キーに対応する値`John`を参照します。