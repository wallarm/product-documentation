[link-http]:                    parsers/http.md
[link-uri]:                     parsers/http.md#uri-filter
[link-path]:                    parsers/http.md#path-filter
[link-actionname]:              parsers/http.md#action_name-filter
[link-actionext]:               parsers/http.md#action_ext-filter
[link-get]:                     parsers/http.md#get-filter
[link-header]:                  parsers/http.md#header-filter
[link-post]:                    parsers/http.md#post-filter
[link-formurlencoded]:          parsers/form-urlencoded.md
[link-multipart]:               parsers/multipart.md
[link-cookie]:                  parsers/cookie.md
[link-xml]:                     parsers/xml.md
[link-xmlcomment]:              parsers/xml.md#xml_comment-filter
[link-xmldtd]:                  parsers/xml.md#xml_dtd-filter
[link-xmldtdentity]:            parsers/xml.md#xml_dtd_entity-filter
[link-xmlpi]:                   parsers/xml.md#xml_pi-filter
[link-xmltag]:                  parsers/xml.md#xml_tag-filter
[link-xmltagarray]:             parsers/xml.md#xml_tag_array-filter
[link-xmlattr]:                 parsers/xml.md#xml_attr-filter
[link-jsondoc]:                 parsers/json.md
[link-jsonobj]:                 parsers/json.md#jsonobj-filter
[link-jsonarray]:               parsers/json.md#jsonarray-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# Como Construir um Ponto
Vamos relembrar a lista de analisadores FAST DSL e filtros disponíveis para uso no ponto.
* [Analisador HTTP][link-http]:
    * [Filtro URI][link-uri];
    * [Filtro de caminho][link-path];
    * [Filtro Action_name][link-actionname];
    * [Filtro Action_ext][link-actionext];
    * [Filtro Get][link-get];
    * [Filtro de cabeçalho][link-header];
    * [Filtro Post][link-post];
* [Analisador Form_urlencoded][link-formurlencoded];
* [Analisador Multipart][link-multipart];
* [Analisador de Cookie][link-cookie];
* [Analisador XML][link-xml]:
    * [Filtro Xml_comentário][link-xmlcomment];
    * [Filtro Xml_dtd][link-xmldtd];
    * [Filtro Xml_dtd_entidade][link-xmldtdentity];
    * [Filtro Xml_pi][link-xmlpi];
    * [Filtro Xml_tag][link-xmltag];
    * [Filtro Xml_tag_array][link-xmltagarray];
    * [Filtro Xml_attr][link-xmlattr];
* [Analisador Json_doc][link-jsondoc]:
    * [Filtro Json_obj][link-jsonobj];
    * [Filtro Json_array][link-jsonarray];
* [Analisador GZIP][link-gzip];
* [Analisador Base64][link-base64];
* [Filtro de array][link-array];
* [Filtro Hash][link-hash].

Recomenda-se que os pontos sejam montados da direita para a esquerda para facilitar o entendimento de quais analisadores e filtros devem ser incluídos no ponto. Mova-se de partes menores para maiores da requisição ao construir um ponto.

!!! informação "Divisor de partes do ponto"
    As partes do ponto devem ser divididas usando o símbolo `_`.

## Exemplo 1 

Suponhamos que você precise construir um ponto que se refere ao valor decodificado do parâmetro `uid` na seguinte requisição:

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

onde `MDEyMzQ=` é a string `01234` codificada em Base64.

1.   Porque o ponto deve se referir ao *valor* do elemento da solicitação, precisamos incluir a palavra de serviço `value` no ponto.

    Estado atual do ponto: `value`.

2.   O ponto deve se referir ao valor decodificado, mas o valor desejado está codificado com a codificação *Base64* na solicitação. O nome do analisador `BASE64` deve ser adicionado ao lado esquerdo do ponto para decodificar o valor.
       
    Estado atual do ponto: `BASE64_value`.

3.   O ponto deve se referir ao valor do parâmetro *`uid`*. Adicione o nome do parâmetro `uid` ao lado esquerdo do ponto para se referir ao valor do parâmetro desejado. 
    
    Estado atual do ponto: `uid_BASE64_value`.

4.   O ponto deve se referir ao valor do parâmetro que é passado na *string de consulta* da solicitação básica. Adicione o nome do filtro `GET` ao lado esquerdo do ponto para se referir ao valor do parâmetro da string de consulta. 
    
    Estado atual do ponto: `GET_uid_BASE64_value`.



Para atender às condições do exemplo, o ponto obtido na quarta etapa pode ser adicionado à extensão de uma das seguintes maneiras:
* não cercado por qualquer um dos símbolos de serviço.
* cercado por apóstrofos (`'GET_uid_BASE64_value'`).
* cercado por aspas (`"GET_uid_BASE64_value"`).



## Exemplo 2

Suponha que você precise construir um ponto que se refere ao valor `01234` do parâmetro `passwd` na 

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

solicitação com o

```
username=admin&passwd=01234.
```

corpo.

1.   Porque o ponto deve se referir ao *valor* do elemento da solicitação, precisamos incluir a palavra de serviço `value` no ponto.
    
    Estado atual do ponto: `value`.

2.   O ponto deve se referir ao valor do parâmetro *`passwd`*. Adicione o nome do parâmetro `passwd` ao lado esquerdo do ponto para se referir ao valor do parâmetro desejado. 
    
    Estado atual do ponto: `passwd_value`.

3.   O ponto deve se referir ao valor do parâmetro que é passado no formato *form-urlencoded*. Isso pode ser derivado do valor do cabeçalho Content-Type na solicitação básica. Adicione o nome do analisador Form_urlencoded em maiúsculas ao lado esquerdo do ponto para se referir ao valor do parâmetro passado no valor form-urlencoded. 
    
    Estado atual do ponto: `FORM_URLENCODED_passwd_value`.

4.   O ponto deve se referir ao valor do parâmetro que é passado no *corpo da solicitação*. Adicione o nome do analisador `POST` ao lado esquerdo do ponto para se referir ao valor do parâmetro do corpo da solicitação.
    
    Estado atual do ponto: `POST_FORM_URLENCODED_passwd_value`.



Para atender às condições do exemplo, o ponto obtido na quarta etapa pode ser adicionado à extensão de uma das seguintes maneiras:
* não cercado por qualquer um dos símbolos de serviço.
* cercado por apóstrofos (`'POST_FORM_URLENCODED_passwd_value'`).
* cercado por aspas (`"POST_FORM_URLENCODED_passwd_value"`).



## Exemplo 3

Suponhamos que você precise construir um ponto que se refere ao valor `abcde` do cookie `secret-word` na seguinte requisição:

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.   Porque o ponto deve se referir ao *valor* do elemento da solicitação, precisamos incluir a palavra de serviço `value` no ponto.

    Estado atual do ponto: `value`.

2.   O ponto deve se referir ao valor do *cookie* `secret-word`. Adicione o nome `secret-word` do cookie ao lado esquerdo do ponto para se referir ao valor do cookie desejado.
    
    Estado atual do ponto: `secret-word_value`.

3.   O ponto deve se referir ao valor do *cookie*. Adicione o nome do analisador `COOKIE` ao lado esquerdo do ponto para se referir ao valor do cookie.
    
    Estado atual do ponto: `COOKIE_secret-word_value`.

4.   O ponto deve se referir ao valor que é passado no *Cabeçalho do Cookie*. Adicione o nome do cabeçalho `Cookie` ao lado esquerdo do ponto para se referir ao cabeçalho chamado Cookie. 
    
    Estado atual do ponto: `Cookie_COOKIE_secret-word_value`.

5.   O ponto deve se referir ao valor que é passado no *cabeçalho*. Adicione o nome do filtro `HEADER` ao lado esquerdo do ponto para se referir ao valor do cabeçalho.
    
    Estado atual do ponto: `HEADER_Cookie_COOKIE_secret-word_value`.



Para atender às condições do exemplo, o ponto obtido na quarta etapa pode ser adicionado à extensão de uma das seguintes maneiras:
* não cercado por qualquer um dos símbolos de serviço.
* cercado por apóstrofos (`'HEADER_Cookie_COOKIE_secret-word_value'`).
* cercado por aspas (`"HEADER_Cookie_COOKIE_secret-word_value"`).