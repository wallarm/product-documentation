[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #o-exemplo-do-uso-do-filtro-get-e-do-filtro-hash
[anchor2]:      #o-exemplo-do-uso-do-parser-formurlencoded-with-the-hash-filter
[anchor3]:      #o-exemplo-do-uso-do-filtro-multipart-e-do-filtro-hash
[anchor4]:      #o-exemplo-do-uso-do-parser-jsondoc-e-do-filtro-hash
[anchor5]:      #o-exemplo-do-uso-do-filtro-jsonobj-e-do-filtro-hash
[anchor6]:      #o-exemplo-do-uso-do-filtro-jsonarray-e-do-filtro-hash


# Filtro Hash

O filtro **Hash** refere-se à tabela hash dos valores em qualquer um dos elementos de solicitação de base que podem conter tabelas hash.

O filtro Hash pode ser usado no ponto junto com os seguintes filtros e parsers:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

Use as chaves para se referir aos elementos da tabela hash endereçada pelo filtro Hash.

!!! info "Expressões regulares em pontos"
    A chave no ponto pode ser uma [expressão regular da linguagem de programação Ruby][link-ruby].  

## O Exemplo do Uso do Filtro Get e Do Filtro Hash

Para a 

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

solicitação, o filtro Hash aplicado ao parâmetro de string de consulta `id` refere-se à seguinte tabela hash:

| Chave   | Valor   |
|--------|---------|
| user   | 01234   |
| group  | 56789   |

* O ponto `GET_id_HASH_user_value` refere-se ao valor `01234` que corresponde à chave `user` da tabela hash de valores do parâmetro de string de consulta `id` endereçada pelo filtro Hash.
* O ponto `GET_id_HASH_group_value` refere-se ao valor `56789` que corresponde à chave `group` da tabela hash de valores do parâmetro de string de consulta `id` endereçada pelo filtro Hash. 

## O Exemplo do Uso do Parser Form_urlencoded com o Filtro Hash

Para a 

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

solicitação com o

```
id[user]=01234&id[group]=56789
```

corpo, o filtro Hash aplicado ao parâmetro `id` do corpo da solicitação no formato form-urlencoded refere-se à seguinte array:

| Chave   | Valor   |
|--------|---------|
| user   | 01234   |
| group  | 56789   |

* O ponto `POST_FORM_URLENCODED_id_HASH_user_value` refere-se ao valor `01234` que corresponde à chave `user` da tabela hash de parâmetros do corpo da solicitação endereçada pelo filtro Hash.
* O ponto `POST_FORM_URLENCODED_id_HASH_group_value` refere-se ao valor `56789` que corresponde à chave `group` da tabela hash de parâmetros do corpo da solicitação endereçada pelo filtro Hash. 


## O Exemplo do Uso do Filtro Multipart e do Filtro Hash

Para a 

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[user]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[group]"

56789
```

solicitação, o filtro Hash aplicado ao parâmetro `id` do corpo da solicitação junto com o parser Multipart refere-se à seguinte tabela hash:

| Chave   | Valor   |
|--------|---------|
| user   | 01234   |
| group  | 56789   |

* O ponto `POST_MULTIPART_id_HASH_user_value` refere-se ao valor `01234` que corresponde à chave `user` da tabela hash de parâmetros do corpo da solicitação endereçada pelo filtro Hash.
* O ponto `POST_MULTIPART_id_HASH_group_value` refere-se ao valor `56789` que corresponde à chave `group` da tabela hash de parâmetros do corpo da solicitação endereçada pelo filtro Hash.

## O Exemplo do Uso do Parser Json_doc e do Filtro Hash

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

corpo, o filtro Hash aplicado ao corpo da solicitação no formato JSON junto com o parser Json_doc refere-se à seguinte tabela hash:

| Chave    | Valor   |
|----------|---------|
| username | user    |
| rights   | read    |

* O ponto `POST_JSON_DOC_HASH_username_value` refere-se ao valor `user` que corresponde à chave `username` da tabela hash de parâmetros do corpo da solicitação endereçada pelo filtro Hash.
* O ponto `POST_JSON_DOC_HASH_rights_value` refere-se ao valor `read` que corresponde à chave `rights` da tabela hash de parâmetros do corpo da solicitação endereçada pelo filtro Hash.

## O Exemplo do Uso do Filtro Json_obj e do Filtro Hash

Para a 

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

solicitação com o

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

corpo, o filtro Hash aplicado ao corpo da solicitação no formato JSON junto com o parser Json_doc e o filtro Json_obj refere-se à seguinte tabela hash:

| Chave | Valor  |
|-------|--------|
| status | ativo  |
| rights | ler    |

* O ponto `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` refere-se ao valor `ativo` que corresponde à chave `status` da tabela hash de objetos filhos do objeto JSON info endereçada pelo filtro Hash.
* O ponto `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` refere-se ao valor `ler` que corresponde à chave `rights` da tabela hash de objetos filhos do objeto JSON info endereçada pelo filtro Hash.

## O Exemplo do Uso do Filtro Json_array e do Filtro Hash

Para a 

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

solicitação com o

```
{
    "username": "user",
    "posts": [{
            "title": "Greeting",
            "length": "256"
        },
        {
            "title": "Hello World!",
            "length": "32"
        }
    ]
}
```

corpo, o filtro Hash aplicado ao primeiro elemento da array de objetos JSON `posts` do corpo da solicitação junto com o parser Json_doc e os filtros Json_obj e Json_array refere-se à seguinte tabela hash:

| Chave | Valor     |
|-------|-----------|
| title | Saudação  |
| length| 256       |

* O ponto `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` refere-se ao valor `Saudação` que corresponde à chave `title` da tabela hash de objetos JSON endereçada pelo filtro Hash.
* O ponto `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` refere-se ao valor `256` que corresponde à chave `length` da tabela hash de objetos JSON endereçada pelo filtro Hash.
