[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xmltag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter


# Filtro de Array

O **Array** filtro se refere ao array de valores em qualquer um dos elementos do pedido base que pode conter arrays.

O filtro de Array pode ser usado no ponto junto com os seguintes filtros e analisadores:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

Os elementos deste array precisam ser referidos usando os índices. A indexação do array começa com `0`.

!!! info "Expressões regulares em pontos"
    O índice no ponto pode ser uma [expressão regular da linguagem de programação Ruby][link-ruby].  

## Exemplo de Uso do Filtro Get com o Filtro Array

Para o

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

pedido, o filtro Array aplicado ao parâmetro `id` da sequência de consulta refere-se ao seguinte array:

| Índice  | Valor    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* O `GET_id_ARRAY_0_value` refere-se ao valor `01234` que corresponde ao índice `0` do array de valores do parâmetro `id` da sequência de consulta abordado pelo filtro de Array.
* O `GET_id_ARRAY_1_value` refere-se ao valor `56789` que corresponde ao índice `1` do array de valores do parâmetro `id` da sequência de consulta abordado pelo filtro de Array.

## Exemplo de Uso do Filtro de Cabeçalho com o Filtro Array

Para o

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

pedido, o filtro Array aplicado ao cabeçalho `X-Identifier` refere-se ao seguinte array:

| Índice  | Valor    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* O `HEADER_X-Identifier_ARRAY_0_value` refere-se ao valor `01234` que corresponde ao índice `0` do array de valores do cabeçalho `X-Identifier` abordado pelo filtro de Array.
* O `HEADER_X-Identifier_ARRAY_1_value` refere-se ao valor `56789` que corresponde ao índice `1` do array de valores do cabeçalho `X-Identifier` abordado pelo filtro de Array.

## Exemplo de Uso do Analisador Form_urlencoded e do Filtro Array

Para o

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

pedido com o

```
id[]=01234&id[]=56789
```

corpo, o filtro de Array aplicado ao parâmetro `id` do corpo do pedido no formato codificado url-refere-se ao seguinte array:

| Índice  | Valor    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* O `POST_FORM_URLENCODED_id_ARRAY_0_value` refere-se ao valor `01234` que corresponde ao índice `0` do array de valores do parâmetro `id` abordado pelo filtro de Array.
* O `POST_FORM_URLENCODED_id_ARRAY_1_value` refere-se ao valor `56789` que corresponde ao índice `1` do array de valores do parâmetro `id` abordado pelo filtro de Array.

## Exemplo de Uso do Analisador Multipart e do Filtro Array

Para o

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[]"

56789
```

pedido, o filtro de Array aplicado ao parâmetro `id` do corpo do pedido no formato multipart-referem-se ao seguinte array:

| Índice  | Valor    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* O `POST_MULTIPART_id_ARRAY_0_value` refere-se ao valor `01234` que corresponde ao índice `0` do array de valores do parâmetro `id` abordado pelo filtro de Array.
* O `POST_MULTIPART_id_ARRAY_1_value` refere-se ao valor `56789` que corresponde ao índice `1` do array de valores do parâmetro `id` abordado pelo filtro de Array.

## Exemplo de Uso do Filtro Xml_tag e o Filtro Array

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

pedido com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
Sample text.
</text>
<text>
    &eee;
</text>
```

corpo, o filtro Array aplicado à tag `text` do corpo do pedido no formato XML refere-se ao seguinte array:

| Índice  | Valor        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* O ponto `POST_XML_XML_TAG_text_ARRAY_0_value` refere-se ao valor `Sample text.` que corresponde ao índice `0` do array de valores da tag `text` abordado pelo filtro de Array.
* O ponto `POST_XML_XML_TAG_text_ARRAY_1_value` refere-se ao valor `aaaa` que corresponde ao índice `1` do array de valores da tag `text` abordado pelo filtro de Array.

## Exemplo de Uso do Filtro Json_obj e o Filtro Array

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

pedido com o

```
{
    "username": "user",
    "rights":["read","write"]
}
```

corpo, o filtro Array aplicado ao objeto JSON `rights` do corpo do pedido em conjunto com o analisador Json_doc e o filtro Json_obj refere-se ao seguinte array:

| Índice  | Valor    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* O ponto `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value` refere-se ao valor `read` que corresponde ao índice `0` do array de valores do objeto JSON `rights` abordado pelo Filtro Array.
* O ponto `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value` refere-se ao valor `write` que corresponde ao índice `1` do array de valores do objeto JSON `rights` abordado pelo Filtro Array.