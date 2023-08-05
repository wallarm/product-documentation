[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# マルチパートパーサー

**Multipart** パーサーは、マルチパート形式のリクエストボディを操作するために使用されます。このパーサーはハッシュテーブルを生成し、リクエストボディのパラメータ名がキーであり、対応するパラメータの値がハッシュテーブルの値になります。このハッシュテーブルの要素は、パラメータの名前を使用して参照する必要があります。


!!! info "ポイントにおける正規表現"
    ポイントのパラメータ名は、[Rubyプログラミング言語][link-ruby]の正規表現であることができます。

!!! warning "ポイントでのMultipartパーサーの使用"
    Multipartパーサーは、ベースラインリクエストボディを参照するPostフィルターと一緒に、ポイントでのみ使用できます。


**例:**

以下の

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

リクエストに対して、Multipartパーサーがリクエストボディに適用されると、次のハッシュテーブルが作成されます:

| キー       | 値           |
|-----------|-------------|
| id        | 01234      |
| username  | admin       |

* `POST_MULTIPART_id_value` ポイントは、Multipartパーサーによって作成されたハッシュテーブルから `id` キーに対応する `01234` 値を参照します。
* `POST_MULTIPART_username_value` ポイントは、Multipartパーサーによって作成されたハッシュテーブルから `username` キーに対応する `admin` 値を参照します。

マルチパート形式のリクエストボディには、次のような複雑なデータ構造も含まれることがあります：配列とハッシュテーブル。これらの構造内の要素に対応するために、それぞれ [配列][link-multipart-array] と [ハッシュ][link-multipart-hash] フィルターを使用してください。