[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Analisador Form_urlencoded

O analisador **Form_urlencoded** é usado para trabalhar com o corpo da solicitação no formato form-urlencoded. Este analisador cria uma tabela hash onde os nomes dos parâmetros do corpo da solicitação são as chaves e os valores dos parâmetros correspondentes são os valores da tabela hash. Os elementos desta tabela hash precisam ser referidos usando os nomes dos parâmetros.

!!! info "Expressões regulares nos pontos"
    O nome do parâmetro no ponto pode ser uma expressão regular da [linguagem de programação Ruby][link-ruby].

!!! aviso "Usando o analisador Form_urlencoded no ponto"
    O analisador Form_urlencoded só pode ser usado no ponto juntamente com o filtro Post que se refere ao corpo da solicitação inicial.

O corpo da solicitação no formato form-urlencoded também pode conter as seguintes estruturas de dados complexas: matrizes e tabelas hash. Utilize os filtros [Array][link-formurlencoded-array] e [Hash][link-formurlencoded-hash] respectivamente para se referir aos elementos nessas estruturas.

**Exemplo:**

Para o

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

pedido com o

```
id=01234&username=John
```

corpo, o analisador Form_urlencoded aplicado ao corpo do pedido cria a seguinte tabela hash:

| Chave    | Valor    |
|----------|----------|
| id       | 01234    |
| username | John     |

* O ponto `POST_FORM_URLENCODED_id_value` refere-se ao valor `01234` que corresponde à chave `id` da tabela hash criada pelo analisador Form_urlencoded.
* O ponto `POST_FORM_URLENCODED_username_value` refere-se ao valor `John` que corresponde à chave `username` da tabela hash criada pelo analisador Form_urlencoded.