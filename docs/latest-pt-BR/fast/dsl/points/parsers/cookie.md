[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Analisador de Cookies

O analisador de **Cookies** cria uma tabela hash baseada no conteúdo do cabeçalho de Cookies na requisição base. Os elementos desta tabela hash precisam ser referenciados usando os nomes dos cookies.

!!! info "Expressões regulares em pontos"
    O nome do cookie no ponto pode ser uma expressão regular da [linguagem de programação Ruby][link-ruby].

!!! warning "Usando o analisador de Cookies no ponto"
    O analisador de Cookies só pode ser usado no ponto em conjunto com o filtro de Cabeçalho que se refere ao cabeçalho de Cookies da requisição base.
 
**Exemplo:** 

Para a

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

solicitação, o analisador HTTP e o analisador de Cookies criam tabelas hash com os dados de cabeçalho correspondentes.

O filtro de Cabeçalho se refere à seguinte tabela hash:

| Nome do cabeçalho  | Valor do cabeçalho      |
|--------------------|-------------------------|
| Host               | exemplo.com             |
| Cookie             | id=01234; username=admin |

Nesta tabela hash, os nomes dos cabeçalhos são as chaves e os valores dos cabeçalhos correspondentes são os valores da tabela hash.

Use o ponto `HEADER_Cookie_value` para trabalhar com o Cookie como um valor de string. No exemplo atual, este ponto se refere à string `id=01234; username=admin`.

O analisador de Cookies cria a seguinte tabela hash: 

| Nome do Cookie  | Valor do Cookie   |
|-----------------|-------------------|
| id              | 01234             |
| username        | admin             |

O analisador de Cookies cria uma tabela hash com base nos dados do cabeçalho de Cookies que são obtidos da tabela hash referenciada pelo filtro de Cabeçalho. Nesta tabela hash, os nomes dos cookies são as chaves e os valores dos cookies correspondentes são os valores da tabela hash.

* O ponto `HEADER_Cookie_COOKIE_id_value` se refere ao valor `01234` que corresponde à chave `id` da tabela hash criada pelo analisador de Cookies.
* O ponto `HEADER_Cookie_COOKIE_username_value` se refere ao valor `admin` que corresponde à chave `username` da tabela hash criada pelo analisador de Cookies.