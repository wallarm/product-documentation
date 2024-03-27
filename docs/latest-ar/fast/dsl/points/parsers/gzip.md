# مُحلل GZIP

مُحلل **GZIP** هو المسئول عن تشفير وفك تشفير قيمة عنصر الطلب في ترميز GZIP. يمكن تطبيق هذا المحلل على أي سلسلة نصية.

**مثال:**

للطلب

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

يشير النقطة `POST_MULTIPART_passwd_GZIP_value` إلى قيمة `01234` المُفككة من GZIP التي يتم إرسالها في مُعامل `passwd` لجسم الطلب بتنسيق multipart.