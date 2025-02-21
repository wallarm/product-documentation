[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Multipartパーサー

**Multipart**パーサーは、multipart形式のリクエストボディを扱うために使用します。このパーサーは、リクエストボディパラメータの名前をキー、該当パラメータの値をハッシュテーブルの値とするハッシュテーブルを生成します。ハッシュテーブルの要素は、パラメータの名前を用いて参照する必要があります。

!!! info "ポイント内の正規表現"
    ポイント内のパラメータ名は[Ruby programming language][link-ruby]の正規表現を使用可能です。

!!! warning "ポイント内でのMultipartパーサーの使用"
    Multipartパーサーは、標準のリクエストボディを参照するPostフィルターと併せて、ポイント内でのみ使用できます。

**例:**

以下のリクエストにおいて、リクエストボディにMultipartパーサーを適用した場合、次のハッシュテーブルが生成されます:

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id" 

01234 
--boundary 
Content-Disposition: form-data; name="username"

admin 
```

| キー     | 値      |
|----------|---------|
| id       | 01234   |
| username | admin   |

* `POST_MULTIPART_id_value`ポイントは、Multipartパーサーによって生成されたハッシュテーブルの`id`キーに対応する`01234`の値を参照します。
* `POST_MULTIPART_username_value`ポイントは、Multipartパーサーによって生成されたハッシュテーブルの`username`キーに対応する`admin`の値を参照します。

multipart形式のリクエストボディには、以下の複雑なデータ構造も含まれる場合があります: 配列およびハッシュテーブル。これらの構造内の要素にアクセスするには、対応する[Array][link-multipart-array]および[Hash][link-multipart-hash]フィルターを使用してください。