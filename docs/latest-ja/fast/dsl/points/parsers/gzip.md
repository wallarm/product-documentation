# GZIPパーサー

**GZIP**パーサーはリクエスト要素の値をGZIPエンコーディングでエンコードおよびデコードします。このパーサーは任意の文字列に適用できます。

**例:**

次の

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

リクエストでは、`POST_MULTIPART_passwd_GZIP_value`ポイントは、マルチパート形式のリクエスト本文の`passwd`パラメータに渡されるGZIPからデコードされた`01234`の値を指します。