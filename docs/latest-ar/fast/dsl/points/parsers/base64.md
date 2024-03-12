# مُحلل Base64

مُحلل **Base64** بيقوم بترميز وفك ترميز قيمة عنصر الطلب بترميز base64. يمكن تطبيق المُحلل ده على أي سلسلة.

**مثال:**

لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

بجسم الطلب

```
username=admin&passwd=MDEyMzQ=
```

، النقطة `POST_FORM_URLENCODED_passwd_BASE64_value` بتشير لقيمة `01234` اللي تم فك ترميزها من base64 واللي تم تمريرها في مُعامل `passwd` لجسم الطلب في صيغة form-urlencoded.