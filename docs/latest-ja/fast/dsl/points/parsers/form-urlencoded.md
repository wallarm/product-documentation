[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#formurlencoded-パーサーアンド-アレイ-フィルター-使う-例
[link-formurlencoded-hash]:         hash.md#formurlencoded-パーサーと-ハッシュ-フィルター-使う-例

# Form_urlencoded パーサー

**Form_urlencoded** パーサーは、form-urlencoded 形式でリクエストボディを操作するために使用します。このパーサーは、リクエストボディパラメーターの名前がキーで、対応するパラメーターの値がハッシュテーブルの値になるハッシュテーブルを作成します。このハッシュテーブルの要素は、パラメーターの名前を使用して参照する必要があります。

!!! info "ポイントの正規表現"
    ポイントのパラメーター名は、[Rubyプログラミング言語][link-ruby]の正規表現であることができます。

!!! warning "ポイントでのForm_urlencodedパーサーの使用"
    Form_urlencodedパーサーは、基線のリクエストボディを参考にしたPostフィルターと共に、ポイントでのみ使用できます。

form-urlencoded形式のリクエストボディには、次の複雑なデータ構造も含まれることがあります：配列とハッシュテーブル。これらの構造の要素にアクセスするためには、それぞれに対応する[配列][link-formurlencoded-array]と[ハッシュ][link-formurlencoded-hash]フィルターを使用してください。

**例：** 

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

というリクエストに対して

```
id=01234&username=John
```

というボディがある場合、リクエストボディに適用されたForm_urlencodedパーサーによって次のハッシュテーブルが作成されます：

| キー     | 値      |
|----------|---------|
| id       | 01234   |
| username | John    |

* `POST_FORM_URLENCODED_id_value` ポイントは、Form_urlencodedパーサーによって作成されたハッシュテーブル内の `id` キーに対応する `01234` の値を指します。
* `POST_FORM_URLENCODED_username_value` ポイントは、Form_urlencodedパーサーによって作成されたハッシュテーブル内の `username` キーに対応する `John` の値を指します。