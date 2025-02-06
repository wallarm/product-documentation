# GZIP Ayrıştırıcı

**GZIP** ayrıştırıcı, GZIP kodlamasındaki istek öğesi değerini kodlar ve çözer. Bu ayrıştırıcı herhangi bir string üzerinde uygulanabilir.

**Örnek:** 

Aşağıdaki

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

isteği için, `POST_MULTIPART_passwd_GZIP_value` noktası, multipart formatındaki istek gövdesinde `passwd` parametresiyle gönderilen GZIP'ten çözülen `01234` değerine işaret eder.