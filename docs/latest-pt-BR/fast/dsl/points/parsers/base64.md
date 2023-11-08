# Analisador Base64

O analisador **Base64** codifica e decodifica o valor do elemento de solicitação em codificação base64. Este analisador pode ser aplicado a qualquer sequência de caracteres.

**Exemplo:** 

Para o

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

pedido com o

```
username=admin&passwd=MDEyMzQ=
```

corpo, o ponto `POST_FORM_URLENCODED_passwd_BASE64_value` refere-se ao valor `01234` decodificado do base64 que é passado no parâmetro `passwd` do corpo do pedido no formato form-urlencoded.