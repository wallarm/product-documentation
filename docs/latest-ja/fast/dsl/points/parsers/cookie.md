[link-ruby]: http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Cookieパーサー

**Cookie**パーサーは、ベースラインリクエスト内のCookieヘッダーの内容に基づいてハッシュテーブルを作成します。このハッシュテーブルの要素は、Cookieの名前を用いて参照する必要があります。

!!! info "ポイント内の正規表現"
    ポイント内のクッキー名は、[Rubyプログラミング言語][link-ruby]の正規表現とすることができます。

!!! warning "ポイント内でのCookieパーサーの使用"
    Cookieパーサーは、ベースラインリクエストのCookieヘッダーを参照するHeaderフィルターと一緒に、ポイント内でのみ使用することができます。

**例：** 

次のような

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

リクエストに対して、HTTPパーサーとCookieパーサーは対応するヘッダーデータを持つハッシュテーブルを作成します。

Headerフィルターは次のハッシュテーブルを参照します：

| ヘッダー名  | ヘッダー値               |
|-------------|--------------------------|
| Host        | example.com              |
| Cookie      | id=01234; username=admin |

このハッシュテーブルでは、ヘッダー名がキーで、対応するヘッダーの値がハッシュテーブルの値になります。

`HEADER_Cookie_value`ポイントを使用して、Cookieを文字列値として操作します。現在の例では、このポイントは`id=01234; username=admin`文字列を参照します。

Cookieパーサーは次のハッシュテーブルを作成します：

| Cookie名 | Cookie値  |
|----------|-----------|
| id       | 01234     |
| username | admin     |

Cookieパーサーは、Headerフィルターが参照するハッシュテーブルから取得したCookieヘッダーのデータに基づいてハッシュテーブルを作成します。このハッシュテーブルでは、Cookie名がキーで、対応するCookieの値がハッシュテーブルの値になります。

* `HEADER_Cookie_COOKIE_id_value`ポイントは、Cookieパーサーが作成したハッシュテーブルから`id`キーに対応する`01234`値を参照します。
* `HEADER_Cookie_COOKIE_username_value`ポイントは、Cookieパーサーが作成したハッシュテーブルから`username`キーに対応する`admin`値を参照します。