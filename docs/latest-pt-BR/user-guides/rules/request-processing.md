# Análise e interpretação de solicitações

Para uma análise efetiva de solicitações, a Wallarm segue os princípios:

* Trabalha com os mesmos dados que a aplicação protegida. Por exemplo:
    Se uma aplicação fornece uma API JSON, então os parâmetros processados também serão codificados no formato JSON. Para obter os valores dos parâmetros, a Wallarm usa um interpretador JSON. Existem também casos mais complexos onde os dados são codificados várias vezes — por exemplo, de JSON para Base64 para JSON. Tais casos requerem decodificação com vários interpretadores.

* Considera o contexto do processamento de dados. Por exemplo:

    O parâmetro `nome` pode ser passado na criação de solicitações tanto como o nome do produto e como um nome de usuário. No entanto, o código de processamento para tais solicitações pode ser diferente. Para definir o método de análise de tais parâmetros, a Wallarm pode usar a URL da qual as solicitações foram enviadas ou outros parâmetros.

## Identificando e interpretando as partes da solicitação

Começando do nível mais alto da solicitação HTTP, o nó de filtragem tenta aplicar sequencialmente cada um dos interpretadores adequados para cada parte. A lista de interpretadores aplicados depende da natureza dos dados e dos resultados do treinamento anterior do sistema.

A saída dos interpretadores se torna um conjunto adicional de parâmetros que tem que ser analisado de maneira similar. Às vezes, a saída do interpretador se torna uma estrutura complexa como JSON, array, ou matriz associativa.

!!! info "Etiquetas do interpretador"
    Cada interpretador possui um identificador (etiqueta). Por exemplo, `header` para o interpretador de cabeçalhos de solicitação. O conjunto de etiquetas utilizadas na análise da solicitação é exibido no Console Wallarm dentro dos detalhes do evento. Esses dados demonstram a parte da solicitação com o ataque detectado e os interpretadores que foram utilizados.

    Por exemplo, se um ataque foi detectado no cabeçalho `SOAPACTION`:

    ![Exemplo de etiqueta](../../images/user-guides/rules/tags-example.png)

### URL

Cada solicitação HTTP contém uma URL. Para encontrar ataques, o nó de filtragem analisa tanto o valor original quanto seus componentes individuais: **caminho**, **nome_da_ação**, **ext_da_ação**, **consulta**.

As seguintes etiquetas correspondem ao interpretador de URL:

* **uri** para o valor original da URL sem o domínio (por exemplo, `/blogs/123/index.php?q=aaa` para a solicitação enviada para `http://example.com/blogs/123/index.php?q=aaa`).
* **caminho** para um array com partes da URL separadas pelo símbolo `/` (a última parte da URL não está incluída no array). Se houver apenas uma parte na URL, o array estará vazio.
* **nome_da_ação** para a última parte da URL após o símbolo `/` e antes do primeiro ponto (`.`). Esta parte da URL sempre está presente na solicitação, mesmo que seu valor seja uma string vazia.
* **ext_da_ação** para a parte da URL após o último ponto (`.`). Pode estar faltando na solicitação.

    !!! alerta "Fronteira entre **nome_da_ação** e **ext_da_ação** quando há vários pontos"
        Se houver vários pontos (`.`) na última parte da URL após o símbolo `/`, podem ocorrer problemas com a fronteira entre **nome_da_ação** e **ext_da_ação**, como:
        
        * Fronteira definida com base no **primeiro** ponto, por exemplo:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `nome_da_ação` — `cb-common`
            * `ext_da_ação` — `ffc63abe.chunk.js.map`

        * Alguns elementos estão faltando após a interpretação, por exemplo:

            * `nome_da_ação` — `cb-common`
            * `ext_da_ação` — `ffc63abe`
        
        Para corrigir isso, edite manualmente os pontos **nome_da_ação** e **ext_da_ação** no [formulário de edição avançada](rules.md#advanced-edit-form) do construtor de URI.

* **consulta** para [parâmetros da string de consulta](#query-string-parameters) após o símbolo `?`.

Exemplo:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[caminho, 0]` — `blogs`
* `[caminho, 1]` — `123`
* `[nome_da_ação]` — `index`
* `[ext_da_ação]` — `php`
* `[consulta, 'q']` — `aaa`

### Parâmetros da string de consulta

Os parâmetros da string de consulta são passados para a aplicação na URL de solicitação após o caractere `?` no formato `chave=valor`. A etiqueta **consulta** corresponde ao interpretador.

Exemplo de solicitação | Parâmetros da string de consulta e valores
---- | -----
`/?q=um+texto&check=sim` | <ul><li>`[consulta, 'q']` — `um texto`</li><li>`[consulta, 'check']` — `sim`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[consulta, 'p1', hash, 'x']` — `1`</li><li>`[consulta, 'p1', hash, 'y']` — `2`</li><li>`[consulta, 'p2', array, 0]` — `aaa`</li><li>`[consulta, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[consulta, 'p3', array, 0]` — `1`</li><li>`[consulta, 'p3', array, 1]` — `2`</li><li>`[consulta, 'p3', poluição]` — `1,2`</li></ul>

### Endereço IP de origem da solicitação

O ponto de solicitação para um endereço IP de origem da solicitação nas regras Wallarm é `remote_addr`. Este ponto é usado apenas na regra [**Definir limite de taxa**](rate-limiting.md) para limitar solicitações por IPs.

### Cabeçalhos

Os cabeçalhos são apresentados na solicitação HTTP e em alguns outros formatos (por exemplo, **multipart**). A etiqueta **header** corresponde ao interpretador. Os nomes dos cabeçalhos são sempre convertidos para maiúsculas.

Exemplo:

```
GET / HTTP/1.1
Host: example.com
X-Test: aaa
X-Test: bbb
```

* `[header, 'HOST']` — `example.com`
* `[header, 'X-TEST', array, 0]` — `aaa`
* `[header, 'X-TEST', array, 1]` — `aaa`
* `[header, 'X-TEST', poluição]` — `aaa,bbb`

### Metadados

As seguintes etiquetas correspondem ao interpretador para metadados da solicitação HTTP:

* **post** para o corpo da solicitação HTTP
* **method** para o método da solicitação HTTP: `GET`, `POST`, `PUT`, `DELETE`
* **proto** para a versão do protocolo HTTP
* **scheme**: http/https
* **application** para o ID da aplicação

### Interpretadores adicionais

Partes complexas da solicitação podem requerer interpretação adicional (por exemplo, se os dados estão codificados em Base64 ou apresentados no formato de array). Nesses casos, os interpretadores listados abaixo são aplicados adicionalmente às partes da solicitação.

#### base64

Decodifica dados codificados em Base64, e pode ser aplicado a qualquer parte da solicitação.

#### gzip

Decodifica dados codificados em GZIP, e pode ser aplicado a qualquer parte da solicitação.

#### htmljs

Converte símbolos HTML e JS para o formato de texto, e pode ser aplicado a qualquer parte da solicitação.

Exemplo: `&#x22;&#97;&#97;&#97;&#x22;` será convertido para `"aaa"`.

#### json_doc

Interpreta os dados no formato JSON, e pode ser aplicado a qualquer parte da solicitação.

Filtros:

* **json_array** ou **array** para o valor do elemento do array
* **json_obj** ou **hash** para o valor da chave do array associativo (`chave:valor`)

Exemplo:

```
{"p1":"valor","p2":["v1","v2"],"p3":{"umachave":"umvalor"}}
```

* `[..., json_doc, hash, 'p1']` — `valor`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'umachave']` — `umvalor`

#### xml

Interpreta os dados no formato XML, e pode ser aplicado a qualquer parte da solicitação.

Filtros:

* **xml_comment** para um array com comentários no corpo de um documento XML
* **xml_dtd** para o endereço da esquema DTD externo sendo usado
* **xml_dtd_entity** para um array definido no documento DTD Entity
* **xml_pi** para um array de instruções a processar
* **xml_tag** ou **hash** para um array associativo de tags
* **xml_tag_array** ou **array** para um array de valores de tag
* **xml_attr** para um array associativo de atributos; só pode ser usado após o filtro **xml_tag**

O interpretador XML não diferencia entre o conteúdo da tag e o primeiro elemento no array de valores para a tag. Ou seja, os parâmetros `[..., xml, xml_tag, 't1']` e `[..., xml, xml_tag, 't1', array, 0]` são idênticos e intercambiáveis.

Exemplo:

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- teste -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

* `[..., xml, xml_dtd_entity, 0]` — name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]` — name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` teste `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

Interpreta dados de array. Pode ser aplicado a qualquer parte da solicitação.

Exemplo:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[consulta, 'p2', array, 0]` — `aaa`
* `[consulta, 'p2', array, 1]` — `bbb`

#### hash

Interpreta a array associativa de dados (`chave:valor`), e pode ser aplicado a qualquer parte da solicitação.

Exemplo:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[consulta, 'p1', hash, 'x']` — `1`
* `[consulta, 'p1', hash, 'y']` — `2`

#### poluição

Combina os valores dos parâmetros com o mesmo nome, e pode ser aplicado a qualquer parte da solicitação no formato inicial ou decodificado.

Exemplo:

```
/?p3=1&p3=2
```

* `[consulta, 'p3', poluição]` — `1,2`

#### percentual

Decodifica os símbolos da URL, e pode ser aplicado apenas ao componente **uri** da URL.

#### cookie

Interpreta os parâmetros do Cookie da solicitação, e pode ser aplicado apenas aos cabeçalhos da solicitação.

Exemplo:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

Interpreta o corpo da solicitação enviado no formato `application/x-www-form-urlencoded`, e pode ser aplicado apenas ao corpo da solicitação.

Exemplo:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, form_urlencoded, 'p1']` — `1`
* `[post, form_urlencoded, 'p2', hash, 'a']` — `2`
* `[post, form_urlencoded, 'p2', hash, 'b']` — `3`
* `[post, form_urlencoded, 'p3', array, 0]` — `4`
* `[post, form_urlencoded, 'p3', array, 1]` — `5`
* `[post, form_urlencoded, 'p4', array, 0]` — `6`
* `[post, form_urlencoded, 'p4', array, 1]` — `7`
* `[post, form_urlencoded, 'p4', poluição]` — `6,7`

#### grpc <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

Interpreta solicitações de API gRPC, e pode ser aplicado apenas ao corpo da solicitação.

Suporta o filtro **protobuf** para os dados do Protocol Buffers.

#### multipart

Interpreta o corpo da solicitação enviado no formato `multipart`, e pode ser aplicado apenas ao corpo da solicitação.

Suporta o filtro **header** para os cabeçalhos no corpo da solicitação.

Exemplo:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, multipart, 'p1']` — `1`
* `[post, multipart, 'p2', hash, 'a']` — `2`
* `[post, multipart, 'p2', hash, 'b']` — `3`
* `[post, multipart, 'p3', array, 0]` — `4`
* `[post, multipart, 'p3', array, 1]` — `5`
* `[post, multipart, 'p4', array, 0]` — `6`
* `[post, multipart, 'p4', array, 1]` — `7`
* `[post, multipart, 'p4', poluição]` — `6,7`

Se um nome de arquivo estiver especificado no cabeçalho `Content-Disposition`, então o arquivo é considerado carregado neste parâmetro. O parâmetro será assim:

* `[post, multipart, 'umparam', file]` — conteúdo do arquivo

#### viewstate

Projetado para analisar o estado da sessão. A tecnologia é usada pelo Microsoft ASP.NET, e pode ser aplicada apenas ao corpo da solicitação.

Filtros:

* **viewstate_array** para um array
* **viewstate_pair** para um array
* **viewstate_triplet** para um array
* **viewstate_dict** para um array associativo
* **viewstate_dict_key** para uma string
* **viewstate_dict_value** para uma string
* **viewstate_sparse_array** para um array associativo

#### jwt

Interpreta tokens JWT e pode ser aplicado a qualquer parte da solicitação.

O interpretador JWT retorna o resultado nos seguintes parâmetros conforme a estrutura JWT detectada:

* `jwt_prefix`: um dos prefixos de valor JWT suportados - lsapi2, mobapp2, bearer. O interpretador lê o valor do prefixo em qualquer registro.
* `jwt_header`: Cabeçalho JWT. Ao obter o valor, a Wallarm também costuma aplicar os interpretadores [`base64`](#base64) e [`json_doc`](#json_doc) a ele.
* `jwt_payload`: Carga JWT. Ao obter o valor, a Wallarm também costuma aplicar os interpretadores [`base64`](#base64) e [`json_doc`](#json_doc) a ele.

Os JWTs podem ser passados em qualquer parte da solicitação. Portanto, antes de aplicar o interpretador `jwt`, a Wallarm usa o interpretador específico da parte da solicitação, por exemplo, [`consulta`](#query-string-parameters) ou [`header`](#headers).

Exemplo do JWT passado no cabeçalho `Authentication`:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

Ao definir um elemento de solicitação a [regra](rules.md) é aplicada a:

* Escolha primeiro o interpretador da parte da solicitação contendo o JWT
* Especifique um dos parâmetros `jwt_*` listados como o valor do interpretador `jwt`, por exemplo, para o valor do parâmetro `name` na carga JWT:

![Descrição do parâmetro JWT em uma regra](../../images/user-guides/rules/request-element-desc.png)

### Normas

As normas são aplicadas aos interpretadores para tipos de dados de array e chave. Normas são usadas para definir os limites da análise de dados. O valor da norma é indicado na etiqueta do interpretador. Por exemplo: **hash_all**, **hash_name**.

Se a norma não for especificada, então o identificador da entidade que requer processamento é passado para o interpretador. Por exemplo: o nome do objeto JSON ou outro identificador é passado após **hash**.

#### all

Usado para obter valores de todos os elementos, parâmetros ou objetos. Por exemplo:

* **path_all** para todas as partes do caminho URL
* **query_all** para todos os valores de parâmetro da string de consulta
* **header_all** para todos os valores do cabeçalho
* **array_all** para todos os valores de elementos de array
* **hash_all** para todos os valores de objeto JSON ou atributos XML
* **jwt_all** para todos os valores JWT

#### name

Usado para obter os nomes de todos os elementos, parâmetros ou objetos. Por exemplo:

* **query_name** para todos os nomes de parâmetros da string de consulta
* **header_name** para todos os nomes de cabeçalho
* **hash_name** para todos os nomes de objetos JSON ou atributos XML
* **jwt_name** para os nomes de todos os parâmetros com JWT
