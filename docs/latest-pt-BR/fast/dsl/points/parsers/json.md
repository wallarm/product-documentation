[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-jsondoc-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-jsonarray-filter-and-the-hash-filter

[ancora1]:          #jsonobj-filter
[ancora2]:          #jsonarray-filter


# Analisador Json_doc

O analisador **Json_doc** é usado para trabalhar com dados no formato JSON que podem estar localizados em qualquer parte da solicitação. O analisador Json_doc se refere ao conteúdo do contêiner de dados JSON de nível superior em seu formato bruto.

O analisador Json_doc constrói uma estrutura de dados complexa com base nos dados de entrada. Você pode usar os seguintes filtros para se referir aos elementos desta estrutura de dados: 
* [Filtro Json_obj][ancora1];
* [Filtro Json_array][ancora2].

Adicione os nomes do analisador Json_doc e do filtro fornecido por ele em letras maiúsculas ao ponto para usar o filtro no ponto.

**Exemplo:** 

Para a

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

solicitação com o

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

corpo, o analisador Json_doc aplicado ao corpo da solicitação se refere aos seguintes dados:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## Filtro Json_obj

O filtro **Json_obj** se refere à tabela hash dos objetos JSON. Os elementos desta tabela hash precisam ser referidos usando os nomes dos objetos JSON.

!!! info "Expressões regulares nos pontos"
    O nome do objeto JSON no ponto pode ser uma [expressão regular da linguagem de programação Ruby][link-ruby].  

O filtro [Hash][link-hash] aplicado aos dados JSON funciona de maneira semelhante ao Json_obj.

Os valores das tabelas hash no formato JSON também podem conter as seguintes estruturas de dados complexas: arrays e tabelas hash. Use os seguintes filtros para se referir aos elementos nestas estruturas:
* O filtro [Array][link-jsonobj-array] ou o filtro [Json_array][ancora2] para arrays
* O filtro [Hash][link-jsonobj-hash] ou o filtro [Json_obj][ancora1] para tabelas hash

**Exemplo:** 

Para a

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

solicitação com o

```
{
    "username": "user",
    "rights": "read"
}
```

corpo, o filtro Json_obj aplicado ao corpo da solicitação juntamente com o analisador Json_doc se refere à seguinte tabela:

| Chave      | Valor   |
|------------|---------|
| username   | user    |
| rights     | read    |

* O ponto `POST_JSON_DOC_JSON_OBJ_username_value` se refere ao valor `user`.
* O ponto `POST_JSON_DOC_JSON_OBJ_rights_value` se refere ao valor `read`.

## Filtro Json_array

O filtro **Json_array** se refere ao array dos valores de objeto JSON. Os elementos deste array precisam ser referidos usando os índices. A indexação do array começa com `0`.

!!! info "Expressões regulares nos pontos"
    O índice no ponto pode ser uma [expressão regular da linguagem de programação Ruby][link-ruby]. 

O filtro [Array][link-array] aplicado aos dados JSON funciona de maneira semelhante ao filtro Json_array.

Os valores das matrizes no formato JSON também podem conter tabelas hash. Use o [Hash][link-jsonarray-hash] ou [Json_obj][ancora1].

**Exemplo:** 

Para a

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

solicitação com o

```
{
    "username": "user",
    "rights":["read","write"]
}
```

corpo, o filtro Json_array aplicado ao objeto JSON `rights` junto com o analisador Json_doc e o filtro Json_obj se refere ao seguinte array:

| Índice | Valor    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* O ponto `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` se refere ao valor `read` que corresponde ao índice `0` do array dos valores do objeto JSON `rights` endereçado pelo filtro Json_array.
* O ponto `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` se refere ao valor `write` que corresponde ao índice `1` do array dos valores do objeto JSON `rights` endereçado pelo filtro Json_array.