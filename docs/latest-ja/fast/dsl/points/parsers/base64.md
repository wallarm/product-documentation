# Base64パーサー

**Base64**パーサーは、リクエスト要素の値をBase64エンコーディングでエンコードおよびデコードします。このパーサーは任意の文字列に適用できます。

**例:**

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストと

```
username=admin&passwd=MDEyMzQ=
```

本文に対して、`POST_FORM_URLENCODED_passwd_BASE64_value`ポイントは、フォームエンコード形式のリクエスト本文の`passwd`パラメータに渡されるBase64からデコードされた`01234`値を指します。