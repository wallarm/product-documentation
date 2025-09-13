[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Multipartパーサー

**Multipart**パーサーは、multipart形式のリクエストボディを扱うために使用します。このパーサーは、リクエストボディのパラメータ名をキー、対応するパラメータの値を値とするハッシュテーブルを作成します。このハッシュテーブルの要素は、パラメータ名を用いて参照します。

!!! info "ポイントにおける正規表現"
    ポイント内のパラメータ名には、[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

!!! warning "ポイントでのMultipartパーサーの使用"
    Multipartパーサーは、ベースラインのリクエストボディを参照するPostフィルターと組み合わせて、ポイント内でのみ使用できます。


**例:** 

次の

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

リクエストに対して、リクエストボディにMultipartパーサーを適用すると、次のハッシュテーブルが作成されます:

| キー       | 値      |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* `POST_MULTIPART_id_value`ポイントは、Multipartパーサーによって作成されたハッシュテーブルのキー`id`に対応する値`01234`を参照します。
* `POST_MULTIPART_username_value`ポイントは、Multipartパーサーによって作成されたハッシュテーブルのキー`username`に対応する値`admin`を参照します。

multipart形式のリクエストボディには、配列やハッシュテーブルといった複雑なデータ構造が含まれる場合もあります。これらの構造内の要素を参照するには、それぞれ[配列][link-multipart-array]フィルターと[ハッシュ][link-multipart-hash]フィルターを使用します。