# Base64 Ayrıştırıcı

**Base64** ayrıştırıcısı, istek öğesi değerini base64 kodlamasıyla kodlar ve kod çözümü yapar. Bu ayrıştırıcı herhangi bir dizeye uygulanabilir.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

başlıklı istek için

```
username=admin&passwd=MDEyMzQ=
```

gövdesinde, `POST_FORM_URLENCODED_passwd_BASE64_value` noktası, istek gövdesinde form-urlencoded formatında gönderilen `passwd` parametresinden alınan ve base64'ten kod çözümü yapılan `01234` değerini ifade eder.