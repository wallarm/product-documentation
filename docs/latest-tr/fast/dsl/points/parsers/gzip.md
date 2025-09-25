# GZIP Ayrıştırıcısı

**GZIP** ayrıştırıcısı, istek öğesi değerini GZIP kodlamasıyla kodlar ve kodunu çözer. Bu ayrıştırıcı herhangi bir dizeye uygulanabilir.

**Örnek:** 

Şu

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

isteği için, `POST_MULTIPART_passwd_GZIP_value` noktası, çok parçalı (multipart) biçimde istek gövdesindeki `passwd` parametresiyle iletilen ve GZIP’den kodu çözümlenen `01234` değerine karşılık gelir.