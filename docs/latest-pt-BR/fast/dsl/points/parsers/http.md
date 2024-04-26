[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded]:      form-urlencoded.md
[link-multipart]:           multipart.md
[link-xml]:                 xml.md
[link-json]:                json.md

[link-get-array]:           array.md#the-example-of-using-the-get-filter-with-the-array-filter
[link-get-hash]:            hash.md#the-example-of-using-the-get-filter-and-the-hash-filter
[link-header-array]:        array.md#the-example-of-using-the-header-filter-with-the-array-filter

[anchor1]:      #uri-filter
[anchor2]:      #path-filter
[anchor3]:      #action_name-filter
[anchor4]:      #action_ext-filter
[anchor5]:      #get-filter
[anchor6]:      #header-filter
[anchor7]:      #post-filter

# HTTP Parser

O **analizador HTTP** implícito realiza o processamento anual de solicitações. Seu nome não deve ser especificado em um ponto ao usar filtros fornecidos por ele.

O analisador HTTP constrói uma estrutura de dados complexa com base na solicitação original. Você pode usar os seguintes filtros para endereçar os elementos desta estrutura de dados:

* [URI][anchor1];
* [Caminho][anchor2];
* [Nome_da_ação][anchor3];
* [Ext_da_ação][anchor4];
* [Get][anchor5];
* [Cabeçalho][anchor6];
* [Post][anchor7].

!!! info "Usando filtros em pontos"
    Adicione o nome do filtro em letra maiúscula ao ponto para usar o filtro no ponto.

## Filtro URI

O filtro **URI** se refere ao caminho absoluto para o alvo da solicitação. O caminho absoluto começa com o símbolo `/` que segue o domínio ou o endereço IP do alvo.

O filtro URI se refere a um valor de string. Este filtro não pode se referir a estruturas de dados complexas (como arrays ou tabelas hash).

**Exemplo:** 

O ponto `URI_value` se refere à string `/login/index.php` na solicitação `GET http://example.com/login/index.php`.

## Filtro Caminho

O filtro **Caminho** se refere a um array contendo partes do caminho URI. Os elementos deste array precisam ser referenciados usando seus índices. A indexação do array começa com `0`.

!!! info "Expressões regulares em pontos"
    O índice no ponto pode ser uma expressão regular da [linguagem de programação Ruby][link-ruby].

**Exemplo:** 

Para a solicitação `GET http://example.com/main/login/index.php HTTP/1.1`, o filtro Caminho se refere ao seguinte array:

| Índice  | Valor    |
|--------|----------|
| 0      | main     |
| 1      | login    |

* O ponto `PATH_0_value` se refere ao valor `main` que está localizado no array endereçado pelo filtro Caminho com o índice `0`.
* O ponto `PATH_1_value` se refere ao valor `login` que está localizado no array endereçado pelo filtro Caminho com o índice `1`.

Se a URI da solicitação contiver apenas uma parte, o filtro Caminho se referirá a um array vazio.

**Exemplo:**

Para a solicitação `GET http://example.com/ HTTP/1.1`, o filtro Caminho se refere a um array vazio.

## Filtro Nome_da_ação

O filtro **Nome_da_ação** se refere à parte da URI que começa após o último símbolo `/` e termina com o ponto.

O filtro Nome_da_ação se refere a um valor de string. Este filtro não pode se referir a estruturas de dados complexas (como arrays ou tabelas hash).


**Exemplo:** 
* O ponto `ACTION_NAME_value` se refere ao valor `index` para a solicitação `GET http://example.com/login/index.php`.
* O ponto `ACTION_NAME_value` se refere ao valor vazio para a solicitação `GET http://example.com/login/`.

## Filtro Ext_da_ação

O filtro **Ext_da_ação** se refere à parte da URI que começa após o primeiro ponto após o último símbolo `/`. Se essa parte da URI estiver ausente na solicitação, o filtro Ext_da_ação não pode ser usado no ponto.

O filtro Ext_da_ação se refere a um valor de string. Este filtro não pode se referir a estruturas de dados complexas (como arrays ou tabelas hash).

**Exemplo:** 

* O ponto `ACTION_EXT_value` se refere ao valor `php` para a solicitação `GET http://example.com/main/login/index.php`.
* O filtro Ext_da_ação não pode ser usado no ponto que se refere à solicitação `GET http://example.com/main/login/`.

## Filtro Get

O filtro **Get** se refere à tabela hash que contém parâmetros da string de consulta da solicitação. Os elementos desta tabela hash precisam ser referenciados usando os nomes dos parâmetros.

!!! info "Expressões regulares em pontos"
    O nome do parâmetro no ponto pode ser uma expressão regular da [linguagem de programação Ruby][link-ruby].

Os parâmetros da string de consulta também podem conter as seguintes estruturas de dados complexas: arrays e tabelas hash. Use os filtros [Array][link-get-array] e [Hash][link-get-hash] respectivamente para endereçar os elementos nessas estruturas.

**Exemplo:** 

Para a solicitação `POST http://example.com/login?id=01234&username=admin`, o filtro Get se refere à seguinte tabela hash:

| Nome do parâmetro | Valor |
|----------------|-------|
| id             | 01234 |
| username       | admin |

* O ponto `GET_id_value` se refere ao valor `01234` que corresponde ao parâmetro `id` da tabela hash endereçada pelo filtro Get.
* O ponto `GET_username_value` se refere ao valor `admin` que corresponde ao parâmetro `username` da tabela hash endereçada pelo filtro Get.

## Filtro Cabeçalho

O filtro **Cabeçalho** se refere à tabela hash que contém nomes de cabeçalhos e valores. Os elementos desta tabela hash precisam ser referenciados usando os nomes dos cabeçalhos.

!!! info "Um nome de cabeçalho em um ponto"
    Um nome de cabeçalho pode ser especificado em um ponto de uma das seguintes maneiras:

    * Em maiúsculas
    * Da mesma forma que é especificado na solicitação

!!! info "Expressões regulares em pontos"
    O nome do cabeçalho no ponto pode ser uma expressão regular da [linguagem de programação Ruby][link-ruby].


O nome do cabeçalho também pode conter um array de valores. Use o filtro [Array][link-header-array] para endereçar os elementos deste array.

**Exemplo:** 

Para a solicitação

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

o filtro Cabeçalho se refere à seguinte tabela hash:

| Nome do cabeçalho | Valor       |
|-----------------|-------------|
| Connection      | keep-alive  |
| Host            | example.com |
| Accept-Encoding | gzip        |

* O ponto `HEADER_Connection_value` se refere ao valor `keep-alive` que corresponde ao cabeçalho `Connection` da tabela hash endereçada pelo filtro Cabeçalho.
* O ponto `HEADER_Host_value` se refere ao valor `example.com` que corresponde ao cabeçalho `Host` da tabela hash endereçada pelo filtro Cabeçalho.
* O ponto `HEADER_Accept-Encoding_value` se refere ao valor `gzip` que corresponde ao cabeçalho `Accept-Encoding` da tabela hash endereçada pelo filtro Cabeçalho.

## Filtro Post

O filtro **Post** se refere ao conteúdo do corpo da solicitação.

Você pode usar o nome do filtro Post no ponto para trabalhar com o conteúdo do corpo da solicitação em formato bruto.

**Exemplo:** 

Para a solicitação

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

com o corpo

```
Este é um texto corporal simples.
```

o ponto `POST_value` se refere ao valor `Este é um texto corporal simples.` do corpo da solicitação.

Você também pode trabalhar com um corpo de solicitação que contém estruturas de dados complexas. Use os seguintes filtros e analisadores no ponto após o filtro Post para endereçar os elementos das estruturas de dados correspondentes: 
* O analisador [Form_urlencoded][link-formurlencoded] para o corpo da solicitação no formato **form-urlencoded**
* O analisador [Multipart][link-multipart] para o corpo da solicitação no formato **multipart**
* Os [filtros fornecidos pelo analisador XML][link-xml] para o corpo da solicitação no formato **XML**
* Os [filtros fornecidos pelo analisador Json_doc][link-json] para o corpo da solicitação no formato **JSON**.