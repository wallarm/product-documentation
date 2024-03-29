# محلل Base64

يقوم محلل **Base64** بتشفيروفك تشفير قيمة عنصر الطلب بتشفير base64. يمكن تطبيق هذا المحلل على أي سلسلة.

**مثال:**

لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

مع الجسم

```
username=admin&passwd=MDEyMzQ=
```

يشير نقطة `POST_FORM_URLENCODED_passwd_BASE64_value` إلى قيمة `01234` المفككة من التشفير base64 التي يتم تمريرها في معامل `passwd` من جسم الطلب بتنسيق form-urlencoded.