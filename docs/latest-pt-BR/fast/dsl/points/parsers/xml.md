[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-xmltag-array]:        array.md#the-example-of-using-the-xmltag-filter-and-the-array-filter
[link-array]:               array.md

[anchor1]:      #xml_comment-filter
[anchor2]:      #xml_dtd-filter
[anchor3]:      #xml_dtd_entity-filter
[anchor4]:      #xml_pi-filter
[anchor5]:      #xml_tag-filter
[anchor6]:      #xml_tag_array-filter
[anchor7]:      #xml_attr-filter

# Analisador XML

O analisador **XML** é usado para trabalhar com dados no formato XML que podem estar em qualquer parte da solicitação. Seu nome deve ser especificado em um ponto ao usar os filtros fornecidos por ele.

Você pode usar o nome do analisador XML no ponto sem qualquer filtro fornecido por ele para trabalhar com o conteúdo do contêiner de dados XML de nível superior em seu formato bruto.

**Exemplo:**

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Texto de amostra.
</text>
```

corpo, o ponto `POST_XML_value` se refere aos seguintes dados no formato bruto:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- teste -->
<text>
    Texto de amostra.
</text>
```

O analisador XML constrói uma estrutura de dados complexa com base nos dados de entrada. Você pode usar os seguintes filtros para se referir aos elementos desta estrutura de dados:
* [Filtro Xml_comment][anchor1];
* [Filtro Xml_dtd][anchor2];
* [Filtro Xml_dtd_entity][anchor3];
* [Filtro Xml_pi][anchor4];
* [Filtro Xml_tag][anchor5];
* [Filtro Xml_tag_array][anchor6];
* [Filtro Xml_attr][anchor7].

Adicione os nomes do analisador XML e o filtro fornecido por ele em letras maiúsculas ao ponto para usar o filtro no ponto.


## Filtro Xml_comment
 
O filtro **Xml_comment** se refere ao array contendo comentários de dados em formato XML. Os elementos deste array precisam ser referenciados usando seus índices. A indexação do array começa com `0`.

!!! info "Expressões regulares em pontos"
    O índice no ponto pode ser uma expressão regular do [linguagem de programação Ruby][link-ruby].  

O filtro Xml_comment só pode ser usado no ponto em conjunto com o analisador XML.

**Exemplo:** 

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- primeiro -->
<text>
    Texto de amostra.
</text>
<!-- segundo -->
```

corpo, o Xml_comment aplicado em conjunto com o analisador XML se refere ao seguinte array:

| Índice | Valor    |
|--------|----------|
| 0      | primeiro |
| 1      | segundo  |

* O ponto `POST_XML_XML_COMMENT_0_value` se refere ao valor `primeiro` que corresponde ao índice `0` do array referenciado pelo filtro Xml_comment.
* O ponto `POST_XML_XML_COMMENT_1_value` se refere ao valor `segundo` que corresponde ao índice `1` do array referenciado pelo filtro Xml_comment.

## Filtro Xml_dtd

O filtro **Xml_dtd** se refere ao esquema DTD externo usado nos dados XML. Este filtro só pode ser usado no ponto junto com o analisador XML.

O filtro Xml_dtd se refere a um valor de string. Este filtro não pode se referir a estruturas de dados complexas (como arrays ou tabelas hash).

**Exemplo:** 

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- primeiro -->
<text>
    Texto de amostra.
</text>
```

corpo, o ponto `POST_XML_DTD_value` se refere ao valor `example.dtd`.

## Filtro Xml_dtd_entity

O filtro **Xml_dtd_entity** se refere ao array contendo as diretivas do esquema DTD definidas nos dados XML. Os elementos deste array precisam ser referenciados usando seus índices. A indexação do array começa com `0`. 

!!! info "Expressões regulares nos pontos"
    O índice no ponto pode ser uma expressão regular do [linguagem de programação Ruby][link-ruby].

O filtro Xml_dtd_entity só pode ser usado no ponto em conjunto com o analisador XML.

**Exemplo:** 

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o 

```
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe "aaaa">
<!ENTITY amostra "Este é um texto de amostra.">
]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- primeiro -->
<text>
    &xxe;
</text>
<text>
    &amostra;
</text>
```

corpo, o filtro Xml_dtd_entity aplicado ao corpo da solicitação junto com o analisador XML se refere ao seguinte array:

| Índice | Nome    | Valor                      |
|--------|---------|----------------------------|
| 0      | xxe     | aaaa                       |
| 1      | amostra | Este é um texto de amostra.|

Neste array, cada índice se refere ao par nome-valor que corresponde com o nome e o valor do esquema DTD.
* Adicione o sufixo `_name` ao final do ponto que usa o filtro Xml_dtd_entity para se referir ao nome da diretiva do esquema.
* Adicione o sufixo `_value` ao final do ponto que usa o filtro Xml_dtd_entity para se referir ao valor da diretiva do esquema.



* O ponto `POST_XML_XML_DTD_ENTITY_0_name` se refere ao nome da diretiva `xxe` que corresponde ao índice `0` do array referenciado pelo filtro Xml_dtd_entity.
* O ponto `POST_XML_XML_DTD_ENTITY_1_value` se refere ao valor da diretiva `Este é um texto de amostra.` que corresponde ao índice `1` do array referenciado pelo filtro Xml_dtd_entity.

## Filtro Xml_pi

O filtro **Xml_pi** se refere ao array das instruções de processamento definidas para os dados XML. Os elementos deste array precisam ser referidos usando seus índices. A indexação do array começa com `0`. 

!!! info "Expressões regulares nos pontos"
    O índice no ponto pode ser uma expressão regular do [linguagem de programação Ruby][link-ruby].  

O filtro Xml_pi só pode ser usado no ponto em conjunto com o analisador XML.

**Exemplo:** 

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<?last-edit user="João" date="2019-05-11"?>
<!-- primeiro -->
<text>
    Texto de amostra.
</text>
```

corpo, o filtro Xml_pi aplicado ao corpo da solicitação em conjunto com o analisador XML se refere ao seguinte array:

| Índice | Nome              | Valor                                     |
|--------|-------------------|-------------------------------------------|
| 0      | xml-stylesheet    | type="text/xsl" href="style.xsl"          |
| 1      | last-edit         | user="João" date="2019-05-11"             |

Neste array, cada índice se refere ao par nome-valor que corresponde com o nome e o valor da instrução de processamento de dados.
* Adicione o sufixo `_name` ao final do ponto que usa o filtro Xml_pi para se referir ao nome da instrução de processamento.
* Adicione o sufixo `_value` ao final do ponto que usa o filtro Xml_pi para se referir ao valor da instrução de processamento.



* O ponto `POST_XML_XML_PI_0_name` se refere ao nome da instrução `xml-stylesheet` que corresponde ao índice `0` do array referenciado pelo filtro Xml_pi.
* O ponto `POST_XML_XML_PI_1_value` se refere ao valor da instrução `user="João" date="2019-05-11"` que corresponde ao índice `1` do array referenciado pelo filtro Xml_pi.

## Filtro Xml_tag 

O filtro **Xml_tag** se refere à tabela de hash das tags XML dos dados XML. Os elementos desta tabela de hash precisam ser referenciados usando os nomes das tags. Este filtro só pode ser usado no ponto em conjunto com o analisador XML. 

!!! info "Expressões regulares nos pontos"
    O nome da tag no ponto pode ser uma expressão regular do [linguagem de programação Ruby][link-ruby].  

As tags dos dados XML também podem conter arrays de valores. Use o filtro [Array][link-xmltag-array] ou o [Xml_tag_array][anchor6] para se referir aos valores desses arrays.

**Exemplo:** 

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- primeiro -->
<text>
    Texto de amostra.
</text>
<amostra>
    &eee;
</amostra>
```

corpo, o filtro Xml_tag aplicado ao corpo da solicitação em conjunto com o analisador XML se refere à seguinte tabela de hash:

| Chave  | Valor           |
|--------|-----------------|
| text   | Texto de amostra|
| amostra| aaaa            |

* O ponto `POST_XML_XML_TAG_text_value` se refere ao valor `Texto de amostra` que corresponde à chave `text` da tabela de hash referenciada pelo filtro Xml_tag.
* O ponto `POST_XML_XML_TAG_amostra_value` se refere ao valor `aaaa` que corresponde à chave `amostra` da tabela de hash referenciada pelo filtro Xml_tag.

## Filtro Xml_tag_array 

O filtro **Xml_tag_array** se refere ao array dos valores de tag dos dados XML. Os elementos desse array precisam ser referenciados usando seus índices. A indexação do array começa com `0`. Esse filtro só pode ser usado no ponto em conjunto com o analisador XML. 

!!! info "Expressões regulares nos pontos"
    O índice no ponto pode ser uma expressão regular do [linguagem de programação Ruby][link-ruby].  

O filtro [Array][link-array] aplicado aos dados XML funciona de maneira semelhante ao Xml_tag_array.

!!! info "As formas de abordar o conteúdo da tag"
    O analisador XML não diferencia entre o valor da tag e o primeiro elemento no array de valores da tag.

Por exemplo, os pontos `POST_XML_XML_TAG_myTag_value` e `POST_XML_XML_TAG_myTag_ARRAY_0_value` se referem ao mesmo valor.

**Exemplo:**

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- primeiro -->
<text>
    Texto de amostra.
</text>
<text>
    &eee;
</text>
```

corpo, o Xml_tag_array aplicado à tag `text` no corpo da solicitação se refere ao seguinte array:

| Índice | Valor           |
|--------|-----------------|
| 0      | Texto de amostra|
| 1      | aaaa            |

* O ponto `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` se refere ao valor `Texto de amostra` que corresponde ao índice `0` do array de valores da tag texto referenciado pelo filtro Xml_tag_array.
* O ponto `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` se refere ao valor `aaaa` que corresponde ao índice `1` do array de valores da tag texto referenciado pelo filtro Xml_tag_array.

## Filtro Xml_attr 

O filtro **Xml_attr** se refere à tabela de hash dos atributos de tag dos dados XML. Os elementos desta tabela de hash precisam ser referidos usando os nomes dos atributos.

!!! info "Expressões regulares nos pontos"
    O nome do atributo no ponto pode ser uma expressão regular do [linguagem de programação Ruby][link-ruby].  

Este filtro só pode ser usado no ponto junto com o filtro Xml_tag.

**Exemplo:** 

Para o

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

solicitação com o

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- primeiro -->
<text category="informativo" font="12">
    Texto de amostra
</text>
```

corpo, o filtro Xml_attr aplicado à tag `text` no corpo da solicitação em conjunto com o analisador XML e o filtro Xml_tag se refere à seguinte tabela de hash:

| Chave       | Valor        |
|-------------|--------------|
| category    | informativo  |
| font        | 12           |

* O ponto `POST_XML_XML_TAG_text_XML_ATTR_category_value` se refere ao valor `informativo` que corresponde à chave `category` dos atributos da tag `text` na tabela hash referenciada pelo filtro Xml_attr.
* O ponto `POST_XML_XML_TAG_text_XML_ATTR_font_value` se refere ao valor `12` que corresponde à chave `font` dos atributos da tag `text` na tabela hash referenciada pelo filtro Xml_attr.
