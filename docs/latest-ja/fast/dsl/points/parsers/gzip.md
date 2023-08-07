# GZIPパーサー

**GZIP** パーサーは、GZIPエンコーディングでリクエストエレメントの値をエンコードおよびデコードします。このパーサーは任意の文字列に適用できます。

**例:**

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="username" 

admin 
--boundary 
Content-Disposition: form-data; name="passwd"

1f8b 0808 e25b 765c 0003 7465 7374 2e74 7874 0033 3034 3236 0100 2470 a4dd 0500 0000
```

リクエストでは、 `POST_MULTIPART_passwd_GZIP_value` ポイントは、リクエストボディの`passwd`パラメーターで渡されるGZIPからデコードされた `01234` 値を参照します。このリクエストはマルチパート形式で送信されます。