# Base64 Ayrıştırıcı

**Base64** ayrıştırıcısı, istek öğesi değerini base64 kodlamasıyla kodlar ve çözümler. Bu ayrıştırıcı herhangi bir dizeye uygulanabilir.

**Örnek:** 

Şu

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

isteğinin aşağıdaki

```
username=admin&passwd=MDEyMzQ=
```

gövdesiyle, `POST_FORM_URLENCODED_passwd_BASE64_value` noktası, form-urlencoded biçimindeki istek gövdesindeki `passwd` parametresiyle iletilen ve base64 kodlamasından çözümlenen `01234` değerini ifade eder.