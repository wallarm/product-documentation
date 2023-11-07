# Analisador GZIP

O analisador **GZIP** codifica e decodifica o valor do elemento de requisição na codificação GZIP. Este analisador pode ser aplicado a qualquer string.

**Exemplo:**

Para o

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

request, o ponto `POST_MULTIPART_passwd_GZIP_value` refere-se ao valor `01234` decodificado do GZIP que é passado no parâmetro `passwd` do corpo da requisição no formato multipart.