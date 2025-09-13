# GZIPパーサー

この**GZIP**パーサーは、GZIPエンコーディングでリクエスト要素の値をエンコードおよびデコードします。このパーサーは任意の文字列に適用できます。

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

リクエストでは、`POST_MULTIPART_passwd_GZIP_value`ポイントは、マルチパート形式のリクエストボディ内の`passwd`パラメータに渡されたGZIPでエンコードされたデータをデコードして得られる値`01234`を指します。