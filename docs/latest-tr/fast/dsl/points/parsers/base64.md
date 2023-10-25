# Base64 Parser

**Base64** parser, istek öğesi değerini Base64 kodlamada kodlar ve kod çözer. Bu parser herhangi bir dizeye uygulanabilir.

**Örnek:** 

Aşağıdaki için

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

istek ile

```
username=admin&passwd=MDEyMzQ=
```

gövdesi, `POST_FORM_URLENCODED_passwd_BASE64_value` noktası, form-urlencoded formatındaki istek gövdesinin `passwd` parametresinde geçen base64'ten çözülen `01234` değerine işaret eder.