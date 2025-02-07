```markdown
[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Cookieパーサー

**Cookie**パーサーはベースラインリクエストのCookieヘッダーの内容に基づくハッシュテーブルを作成します。 このハッシュテーブルの各要素は、Cookieの名前を使用して参照する必要があります。

!!! info "ポイントにおける正規表現"
    ポイント内のCookie名は、[Ruby programming language][link-ruby]の正規表現にできます。

!!! warning "ポイントでのCookieパーサーの使用"
    Cookieパーサーは、ベースラインリクエストのCookieヘッダーを参照するHeaderフィルターと併用してのみ、ポイントで使用できます。
 
**例：** 

次の

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

リクエストに対して、HTTPパーサーおよびCookieパーサーは、対応するヘッダーデータを用いてハッシュテーブルを作成します。

Headerフィルターは、次のハッシュテーブルを参照します:

| ヘッダー名   | ヘッダー値             |
|---------------|--------------------------|
| Host          | example.com              |
| Cookie        | id=01234; username=admin |

このハッシュテーブルでは、ヘッダー名がキーとなり、対応するヘッダーの値がハッシュテーブルの値となります。

Cookieを文字列値として操作するためには`HEADER_Cookie_value`ポイントを使用します。本例では、このポイントは`id=01234; username=admin`文字列を指します。

Cookieパーサーは、次のハッシュテーブルを作成します:

| Cookie名 | Cookie値  |
|-------------|---------------|
| id          | 01234         |
| username    | admin         |

Cookieパーサーは、Headerフィルターによって参照されるハッシュテーブルから取得したCookieヘッダーデータを基にハッシュテーブルを作成します。このハッシュテーブルでは、Cookie名がキーとなり、対応するCookieの値がハッシュテーブルの値となります。

* `HEADER_Cookie_COOKIE_id_value`ポイントはCookieパーサーによって作成されたハッシュテーブルの`id`キーに対応する`01234`の値を指します。
* `HEADER_Cookie_COOKIE_username_value`ポイントはCookieパーサーによって作成されたハッシュテーブルの`username`キーに対応する`admin`の値を指します。
```