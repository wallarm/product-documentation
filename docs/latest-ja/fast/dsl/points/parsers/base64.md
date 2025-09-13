# Base64パーサー

**Base64**パーサーは、リクエスト要素の値をBase64でエンコードおよびデコードします。このパーサーは任意の文字列に適用できます。

**例:**

次の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

というリクエストに含まれる

```
username=admin&passwd=MDEyMzQ=
```

というボディの場合、`POST_FORM_URLENCODED_passwd_BASE64_value`ポイントは、application/x-www-form-urlencoded形式のリクエストボディ内の`passwd`パラメータに渡されたBase64値をデコードした結果である`01234`を指します。