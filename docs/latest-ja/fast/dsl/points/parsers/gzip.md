
# GZIP Parser

The **GZIP** parser encodes and decodes the request element value in the GZIP encoding. This parser can be applied to any string.

**Example:** 

For the

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

request, the `POST_MULTIPART_passwd_GZIP_value` point refers to the `01234` value decoded from the GZIP that is passed in the `passwd` parameter of the request body in the multipart format.

