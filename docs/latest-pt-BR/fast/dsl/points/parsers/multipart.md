[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Analisador Multipart

O analisador **Multipart** é usado para trabalhar com o corpo da solicitação no formato multipart. Este analisador cria uma tabela de hash onde os nomes dos parâmetros do corpo da solicitação são as chaves e os valores dos parâmetros correspondentes são os valores da tabela de hash. Os elementos desta tabela de hash precisam ser referidos usando os nomes dos parâmetros.

!!! info "Expressões regulares nos pontos"
    O nome do parâmetro no ponto pode ser uma expressão regular da [linguagem de programação Ruby][link-ruby].  

!!! warning "Usando o analisador Multipart no ponto"
    O analisador Multipart pode ser usado no ponto apenas em conjunto com o filtro Post que se refere ao corpo da solicitação de linha de base.

**Exemplo:** 

Para a

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id" 

01234 
--boundary 
Content-Disposition: form-data; name="username"

admin 
```

solicitação, o analisador Multipart aplicado ao corpo da solicitação cria a seguinte tabela de hash:

| Chave     | Valor    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* O ponto `POST_MULTIPART_id_value` refere-se ao valor `01234` que corresponde à chave `id` da tabela de hash criada pelo analisador Multipart.
* O ponto `POST_MULTIPART_username_value` refere-se ao valor `admin` que corresponde à chave `username` da tabela de hash criada pelo analisador Multipart.

O corpo da solicitação no formato multipart também pode conter as seguintes estruturas de dados complexas: arrays e tabelas de hash. Use os filtros [Array][link-multipart-array] e [Hash][link-multipart-hash] correspondentes para endereçar os elementos nessas estruturas.