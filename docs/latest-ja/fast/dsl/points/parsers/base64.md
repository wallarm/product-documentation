# Base64パーサー

**Base64**パーサーは、リクエスト要素の値をbase64エンコーディングでエンコードおよびデコードします。このパーサーは任意の文字列に適用できます。

**例:**

例えば

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

というリクエストに、以下の

```
username=admin&passwd=MDEyMzQ=
```

ボディが含まれている場合、`POST_FORM_URLENCODED_passwd_BASE64_value`ポイントは、form-urlencoded形式のリクエストボディ内の`passwd`パラメータに渡されるbase64からデコードされた`01234`の値を示します。