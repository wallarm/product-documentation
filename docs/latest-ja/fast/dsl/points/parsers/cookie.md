[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Cookieパーサー

**Cookie**パーサーは、ベースラインリクエストのCookieヘッダーの内容に基づいてハッシュテーブルを作成します。このハッシュテーブルの要素はCookieの名前で参照する必要があります。

!!! info "ポイントでの正規表現"
    ポイント内のCookie名は、[Rubyプログラミング言語][link-ruby]の正規表現にできます。

!!! warning "ポイントでのCookieパーサーの使用"
    Cookieパーサーは、ベースラインリクエストのCookieヘッダーを参照するHeaderフィルターと組み合わせた場合にのみ、ポイント内で使用できます。
 
**例：** 

次の

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

リクエストに対して、HTTPパーサーとCookieパーサーは対応するヘッダーデータを含むハッシュテーブルを作成します。

Headerフィルターは次のハッシュテーブルを参照します。

| ヘッダー名   | ヘッダー値                   |
|---------------|------------------------------|
| Host          | example.com                  |
| Cookie        | id=01234; username=admin     |

このハッシュテーブルでは、ヘッダー名がキーで、対応するヘッダーの値がハッシュテーブルの値です。

`HEADER_Cookie_value`ポイントを使用すると、Cookieを文字列値として扱えます。本例では、このポイントは`id=01234; username=admin`という文字列を参照します。

Cookieパーサーは次のハッシュテーブルを作成します。

| Cookie名 | Cookie値  |
|----------|-----------|
| id       | 01234     |
| username | admin     |

Cookieパーサーは、Headerフィルターが参照するハッシュテーブルから取得したCookieヘッダーのデータに基づいてハッシュテーブルを作成します。このハッシュテーブルでは、Cookie名がキーで、対応するCookieの値がハッシュテーブルの値です。

* `HEADER_Cookie_COOKIE_id_value`ポイントは、Cookieパーサーが作成したハッシュテーブルのキー`id`に対応する値`01234`を参照します。
* `HEADER_Cookie_COOKIE_username_value`ポイントは、Cookieパーサーが作成したハッシュテーブルのキー`username`に対応する値`admin`を参照します。