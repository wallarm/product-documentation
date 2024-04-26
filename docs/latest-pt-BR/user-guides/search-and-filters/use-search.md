[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]:         ../../attacks-vulns-list.md#brute-force-attack
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]:          ../../attacks-vulns-list.md#data-bomb
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]:       ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]:     ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]:        ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]:           ../../attacks-vulns-list.md#overlimiting-of-computational-resources
[email-injection]:        ../../attacks-vulns-list.md#email-injection
[ssi-injection]:          ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]:            ../../attacks-vulns-list.md#unsafe-xml-header
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]:          ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# Utilizando a busca e filtros

O Wallarm fornece métodos convenientes para pesquisar ataques e incidentes detectados. Na seção **Eventos** do console do Wallarm, estão disponíveis os seguintes métodos de pesquisa:

* **Filtros** para selecionar critérios de filtragem
* **Campo de pesquisa** para inserir consultas de pesquisa com atributos e modificadores semelhantes à linguagem humana

Os valores definidos nos filtros são automaticamente duplicados no campo de pesquisa e vice-versa.

Qualquer consulta de pesquisa ou combinação de filtros pode ser salva clicando em **Salvar uma consulta**.

## Filtros

Os filtros disponíveis são apresentados no console do Wallarm de várias formas:

* Painel de filtros que é expandido e recolhido usando o botão **Filtro**
* Filtros rápidos para excluir ou mostrar apenas eventos com os valores de parâmetro específicos

![Filtros na interface do usuário](../../images/user-guides/search-and-filters/filters.png)

Quando os valores de diferentes filtros são selecionados, os resultados atenderão a todas essas condições. Quando diferentes valores para o mesmo filtro são especificados, os resultados atenderão a qualquer uma dessas condições.

## Campo de pesquisa

O campo de pesquisa aceita consultas com atributos e modificadores semelhantes à linguagem humana - o que torna a submissão de consultas intuitiva. Por exemplo:

* `ataques xss`: para pesquisar todos os [ataques XSS][al-xss]
* `ataques hoje`: para pesquisar todos os ataques que ocorreram hoje
* `xss 14/12/2020`: para pesquisar todas as suspeitas, ataques e incidentes de [cross-site scripting][al-xss] em 14 de Dezembro de 2020
* `p:xss 14/12/2020`: para pesquisar todas as suspeitas, ataques e incidentes de todos os tipos dentro do parâmetro de requisição HTTP xss (i.e. `http://localhost/?xss=attack-here`) em 14 de Dezembro de 2020
* `ataques 9-12/2020`: para pesquisar todos os ataques de Setembro a Dezembro de 2020
* `rce /catalogo/importar.php`: para pesquisar todos os [ataques e incidentes de RCE][al-rce] no caminho `/catalogo/importar.php` desde ontem

Quando os valores de diferentes parâmetros são especificados, os resultados atenderão a todas essas condições. Quando diferentes valores para o mesmo parâmetro são especificados, os resultados atenderão a qualquer uma dessas condições.

!!! info "Configurando o valor do atributo para NOT"
    Para negar o valor do atributo, por favor, use `!` antes do nome do atributo ou modificador. Por exemplo: `ataques !ip:111.111.111.111` para mostrar todas os ataques originados de qualquer endereço IP exceto `111.111.111.111`.

Abaixo, você encontrará a lista de atributos e modificações disponíveis para uso em consultas de pesquisa.

### Pesquisar por tipo de objeto

Especifique na string de pesquisa:

* `ataque`, `ataques`: para pesquisar apenas pelos ataques que *não* são direcionados a vulnerabilidades conhecidas.
* `incidente`, `incidentes`: para pesquisar apenas por incidentes (ataques que exploram uma vulnerabilidade conhecida).

### Pesquisar por tipo de ataque

Especifique na string de pesquisa:

* `sqli`: para pesquisar por ataques de [injeção de SQL][al-sqli].
* `xss`: para pesquisar por ataques de [Cross Site Scripting][al-xss].
* `rce`: para pesquisar por ataques de [Commanding OS][al-rce].
* `brute`: para pesquisar por ataques de [força bruta][al-brute-force] e requisições bloqueadas de IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) por causa dos ataques deste tipo.
* `ptrav`: para pesquisar por ataques de [travessia de caminho][al-path-traversal].
* `crlf`: para pesquisar por ataques de [injeção CRLF][al-crlf].
* `redir`: para pesquisar por ataques de [redirecionamento aberto][al-open-redirect].
* `nosqli`: para pesquisar por ataques de [injeção NoSQL][al-nosqli].
* `data_bomb`: para pesquisar por ataques de [bomba lógica][al-logic-bomb].
* `ssti`: para pesquisar por [Injeção de Template do Lado do Servidor][ssti-injection].
* `invalid_xml`: para pesquisar por [uso de cabeçalho XML inseguro][invalid-xml].
* `overlimit_res`: para pesquisar por ataques direcionados a [exceder o limite de recursos computacionais][al-overlimit].
* `xxe`: para pesquisar por ataques de [Entidade Externa XML][al-xxe].
* `vpatch`: para pesquisar por [patches virtuais][al-virtual-patch].
* `dirbust`: para pesquisar por ataques de [navegação forçada][al-forced-browsing] e requisições bloqueadas de IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) por causa dos ataques deste tipo.
* `ldapi`: para pesquisar por ataques de [injeção LDAP][al-ldapi].
* `scanner`: para pesquisar por ataques de [scanner de porta][al-port-scanner].
* `infoleak`: para pesquisar por ataques de [disclosure de informação][al-infoleak].
* `mail_injection`: para pesquisar por [Injeções de Email][email-injection].
* `ssi`: para pesquisar por [Injeções SSI][ssi-injection].
* `overlimit_res`: para pesquisar por ataques do tipo [excessivo uso de recursos][overlimit-res].
* `experimental`: para pesquisar por ataques experimentais detectados com base em [expressão regular personalizada](../rules/regex-rule.md).
* `bola`: para pesquisar por ataques que exploram a vulnerabilidade [BOLA (IDOR)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) e requisições bloqueadas de IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) por causa dos ataques deste tipo.
* `mass_assignment`: para pesquisar por tentativas de ataque de [Atribuição em Massa](../../attacks-vulns-list.md#mass-assignment).
* `api_abuse`: para pesquisar por [ataques a API realizados por bots](../../attacks-vulns-list.md#api-abuse).
* `ssrf`: para pesquisar por [Falsificação de Solicitação do Lado do Servidor (SSRF) e ataques](../../attacks-vulns-list.md#serverside-request-forgery-ssrf).
* `blocked_source`: para pesquisar por ataques de IPs [negados manualmente](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips).
* `multiple_payloads`: para pesquisar por ataques detectados pelo gatilho [Número de cargas úteis maliciosas](../../user-guides/triggers/triggers.md#step-1-choosing-a-condition) e requisições bloqueadas de IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) por causa dos ataques deste tipo.

O nome do ataque pode ser especificado em letras maiúsculas e minúsculas: `SQLI`, `sqli` e `SQLi` estão igualmente corretos.

### Pesquisar ataques associados com as principais ameaças OWASP

Você pode encontrar ataques associados às principais ameaças OWASP usando as tags de ameaças OWASP. O formato para buscar esses ataques é `owasp_api1_2023`.

Essas tags correspondem à numeração original de ameaças conforme definido pelo OWASP. Wallarm associa ataques com as principais ameaças API OWASP das versões 2019 e 2023.

### Pesquisar por ataques conhecidos (CVE e explorações bem conhecidas)

* `known`: para buscar por requisições que precisamente atacam, pois exploram vulnerabilidades do CVE ou outros tipos de vulnerabilidade bem conhecidos.

    Para filtrar ataques por um certo CVE ou outro tipo de vulnerabilidade bem conhecido, você pode passar a tag apropriada além da tag `known` ou separadamente dela. Por exemplo: `known:CVE-2004-2402 CVE-2018-6008` ou `CVE-2004-2402 CVE-2018-6008` para pesquisar ataques que exploram as vulnerabilidades [CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) e [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008).
* `!known`: possíveis falsos positivos. Estas requisições podem conter explorações pouco conhecidas ou o contexto transformando as explorações em valores de parâmetros legítimos.

Para filtrar ataques por CVE e explorações bem conhecidas, os filtros rápidos por tipos de eventos e **CVE e explorações** podem ser usados.

### Pesquisar hits por protocolos API

Para filtrar hits por protocolos de API, use a tag `proto:` ou `protocol:`.

Essa tag permite os seguintes valores:

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### Pesquisar hits por protocolos de autenticação

Para filtrar hits por protocolos de autenticação que os atacantes usaram, use a tag `auth:`.

Esta tag permite os seguintes valores:

* `auth:none`
* `auth:api-key`
* `auth:aws`
* `auth:basic`
* `auth:bearer`
* `auth:cookie`
* `auth:digest`
* `auth:hawk`
* `auth:jwt`
* `auth:ntlm`
* `auth:oauth1`
* `auth:oauth2`
* `auth:scram`

### Pesquisa pelo alvo de ataque

Especifique na string de pesquisa:

* `cliente`: para pesquisar por ataques de dados do cliente.
* `banco de dados`: para pesquisar por ataques ao banco de dados.
* `servidor`: para pesquisar por ataques ao servidor de aplicativos.

### Pesquisa por nível de risco

Especifique o nível de risco na string de pesquisa:

* `baixo`: nível de risco baixo.
* `médio`: nível de risco médio.
* `alto`: nível de risco alto.

### Pesquisa pelo tempo do evento

Especifique o período de tempo na string de pesquisa. Se o período não estiver especificado, a pesquisa é conduzida dentro dos eventos que ocorreram nas últimas 24 horas.

Existem os seguintes métodos para especificar o período:

* Por data: `10/11/2020-14/11/2020`
* Por data e hora (segundos são desconsiderados): `10/11/2020 11:11`, `11:30-12:22`, `10/11/2020 11:12-14/01/2020 12:14`
* Em relação a um certo momento de tempo: `>10/11/20`
* Usando aliases de string:
    * `ontem` igual à data de ontem
    * `hoje` igual à data de hoje
    * `último <unidade>` igual ao período do início da última unidade até a data e hora atual

        `semana`, `mês`, `ano` ou o número dessas unidades pode ser usado como `<unidade>`. Por exemplo: `última semana`, `últimos 3 meses`.
    
    * `este <unidade>` igual à unidade atual

        `semana`, `mês`, `ano` podem ser usados como `<unidade>`. Por exemplo: `esta semana` retornará eventos detectados na segunda-feira, terça-feira e quarta-feira desta semana, se hoje for quarta-feira.

O formato de data e hora depende das configurações especificadas no seu [perfil](../settings/account.md):

* MM/DD/YYYY se **MDY** estiver selecionado
* DD/MM/YYYY se **DMY** estiver selecionado
* `13:00` se **24 horas** estiver marcado
* `1pm` se **24 horas** estiver desmarcado

O mês pode ser especificado como número e nome: `01`, `1`, `Janeiro`, `Jan` para Janeiro. O ano pode ser especificado tanto na forma completa (`2020`) quanto na forma abreviada (`20`). Se o ano não estiver especificado na data, o ano atual será usado.

### Pesquisa por endereço IP

Para pesquisar por endereço IP, use o prefixo `ip:`, após o qual você pode especificar
* Um endereço IP específico, por exemplo `192.168.0.1` - nesse caso, todos os ataques e incidentes serão encontrados para os quais o endereço de origem do ataque corresponde a este endereço IP.
* Uma expressão descrevendo um intervalo de endereços IP.
* Um total de endereços IP relacionados a um ataque ou incidente.

#### Pesquisa por intervalo de endereços IP

Para definir um intervalo de endereços IP necessário, você pode usar
*   Um intervalo explícito de endereços IP:
    *   `192.168.0.0-192.168.63.255`
    *   `10.0.0.0-10.255.255.255`
*   Uma parte de um endereço IP:
    *   `192.168.`—equivale a `192.168.0.0-192.168.255.255`. Formato redundante com o modificador `*` é permitido—`192.168.*`
    *   `192.168.0.`—equivale a `192.168.0.0-192.168.0.255`
*   Um endereço IP ou parte dele com um intervalo de valores dentro do último octeto na expressão:
    *   `192.168.1.0-255`—equivale a `192.168.1.0-192.168.1.255`
    *   `192.168.0-255`—equivale a `192.168.0.0-192.168.255.255`
    
    !!! warning "Importante"
        Ao usar um intervalo de valores dentro de um octeto, um ponto não é definido no final.

*   Prefixos de sub-rede ([notação CIDR](https://tools.ietf.org/html/rfc4632)):
    *   `192.168.1.0/24`—equivale a `192.168.1.0-192.168.1.255`
    *   `192.168.0.0/17`—equivale a `192.168.0.1-192.168.127.255`

!!! note
    Você pode combinar os métodos acima para definir intervalos de endereços IP. Para fazer isso, liste todos os intervalos necessários com o prefixo ip: separadamente.
    
    **Exemplo**: `ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### Pesquisa por número de endereços IP

É possível pesquisar pelo número total de endereços IP que estão relacionados a um ataque ou um incidente (apenas para ataques e incidentes):
*   `ip:1000+ último mês`—pesquisar por ataques e incidentes no mês passado para os quais o número de endereços IP únicos é mais do que 1000 (equivale a `ataques incidentes ip:1000+ último mês`).
*   `xss ip:100+`—pesquisar por todos os ataques e incidentes de cross-site scripting. O resultado da pesquisa estará vazio se o número de endereços IP atacantes (com o tipo de ataque XSS) for menor que 100.
*   `xss p:id ip:100+`—pesquisar por todos os ataques XSS e incidentes relacionados ao parâmetro id (`?id=aaa`). Isso retornará resultados apenas se o número de diferentes endereços IP exceder 100.

### Pesquisa pelo centro de dados ao qual o endereço IP pertence

Para pesquisar pelo centro de dados, ao qual o endereço IP original dos ataques pertence, use o prefixo `source:`.

O valor deste atributo pode ser:

* `tor` para a rede Tor
* `proxy` para o servidor publico ou web proxy
* `vpn` para VPN
* `aws` para Amazon
* `azure` para Microsoft Azure
* `gce` para Google Cloud Platform
* `ibm` para IBM Cloud
* `alibaba` para Alibaba Cloud
* `huawei` para Huawei Cloud
* `rackspace` para Rackspace Cloud
* `plusserver` para PlusServer
* `hetzner` para Hetzner
* `oracle` para Oracle Cloud
* `ovh` para OVHcloud
* `tencent` para Tencent
* `linode` para Linode
* `docean` para Digital Ocean

### Pesquisa pelo país ou região no qual o endereço IP está registrado

Para pesquisar pelo país ou pela região, no qual o endereço IP original dos ataques está registrado, use o prefixo `country:`.

O nome do país/região deve ser passado ao atributo no formato correspondente ao padrão [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) em letras maiúsculas ou minúsculas. Por exemplo: `country:CN` or `country:cn` para ataques originados da China.

### Pesquisa por eventos originados de IPs maliciosos conhecidamente perigosos

Wallarm varre recursos públicos em busca de endereços IP que são amplamente reconhecidos como sendo associados a atividades maliciosas. Em seguida, validamos essas informações para garantir sua precisão, facilitando ações necessárias, como incluir esses IPs na lista de negação.

Para pesquisar por eventos originados desses endereços IP maliciosos, use a tag `source:malicious`. Isso significa **IPs maliciosos** e é assim nomeado na lista de negação, na seção para bloquear por tipo de origem.

Nós coletamos os dados para este objeto a partir de uma combinação dos seguintes recursos:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### Pesquisa pelo status de resposta do servidor

Para pesquisar pelo status de resposta do servidor, especifique o prefixo `statuscode:`.

O status de resposta pode ser especificado como:
* um número de 100 a 999.
* «N–M» intervalo, onde N e M são números de 100 a 999.
* «N+» e «N-» intervalos, onde N é um número de 100 a 999.

### Pesquisa pelo tamanho da resposta do servidor

Para pesquisar pelo tamanho da resposta do servidor, use o prefixo `s:` ou `size:`.

Você pode pesquisar por qualquer valor inteiro. Números acima de 999 podem ser especificados sem um prefixo. Os intervalos «N–M», «N+» e «N-» podem ser especificados, onde números acima de 999 também podem ser especificados sem um prefixo.

### Pesquisa pelo método de requisição HTTP

Para pesquisar pelo método de requisição HTTP, especifique o prefixo `method:`.

Para pesquisar por `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`: se maiúsculas forem usadas, então a string de pesquisa pode ser especificada sem um prefixo. Para todos os outros valores, um prefixo deve ser especificado.

### Pesquisa por número de hits dentro do ataque / incidente

Para pesquisar ataques e incidentes por número de hits, especifique o prefixo `N:`.

Por exemplo, você pode pesquisar ataques que têm mais de 100 hits: `ataques N:>100`. Ou pesquisar por ataques com menos de 10 hits com `ataques N:<10`.

### Pesquisa por domínio

Para pesquisar pelo domínio, use o prefixo `d:` ou `domain:`.

Qualquer string que possa ser um domínio de segundo ou nível mais alto pode ser especificada sem um prefixo. Qualquer string pode ser especificada com um prefixo. 

Você pode usar máscaras dentro de um domínio. O símbolo `*` substitui qualquer número de caracteres; o símbolo `?` substitui qualquer caractere simples.

### Pesquisa por caminho

Para pesquisar por caminho, você pode:

* Usar o prefixo `u:` ou `url:` e especificar o caminho entre aspas começando com `/`, por exemplo: `url:"/api/users"`, ou
* Iniciar a entrada com `/` sem nenhum prefixo, por exemplo: `/api/users`

### Pesquisa por aplicação

Para pesquisar pela aplicação à qual o ataque foi enviado, use o prefixo `application:` ou `app:` (o antigo prefixo `pool:` ainda é suportado, mas não é recomendado).

O valor do atributo é o nome da aplicação definida na aba **Aplicações**, na seção **Configurações**. Por exemplo: `application:'Exemplo de aplicação'`.

### Pesquisa por parâmetro ou parser

Para pesquisar por parâmetro ou parser, use o prefixo `p:`, `param:`, ou `parameter:`, ou o sufixo `=`. Se usar o sufixo, uma string que não começa com `/` é considerada um parâmetro (onde o caractere `=` final não está incluído no valor).

Valores de atributo possíveis:

* Nome do parâmetro visado.

    Por exemplo, se você precisa encontrar ataques direcionados ao parâmetro `xss`, mas não aos ataques XSS (por exemplo, ataque de injeção SQL tendo `xss` no parâmetro GET), então especifique `attacks sqli p:xss` na string de pesquisa.
* Nome do [parser](../rules/request-processing.md) usado pelo nó Wallarm para ler o valor do parâmetro. O nome deve estar em maiúsculas.

    Por exemplo, `attacks p:*BASE64` para encontrar ataques direcionados a qualquer parâmetro analisado pelo parser base64.
* Sequência de parâmetros e parsers.

    Por exemplo: `ataques p:"POST_JSON_DOC_HASH_from"` para encontrar ataques enviados no parâmetro `from` no corpo JSON de uma requisição.

Você pode usar máscaras dentro de um valor. O símbolo `*` substitui qualquer número de caracteres; o símbolo `?` substitui qualquer caractere simples.

### Buscar por anomalias em ataques

Para buscar por anomalias em ataques, use o prefixo `a:` ou `anomaly:`.

Para refinar uma pesquisa de anomalias, use os seguintes parâmetros:

* `tamanho`
* `statuscode`
* `tempo`
* `stamps`
* `impression`
* `vector`

Exemplo:

`ataques sqli an:tamanho` irá buscar por todos os ataques de injeção SQL, que têm anomalias de tamanho de resposta em suas requisições.

### Pesquisa pelo identificador de requisição

Para pesquisar por ataques e incidentes pelo identificador de requisição, especifique o prefixo `request_id`. 
O parâmetro `request_id` tem a seguinte forma de valor: `a79199bcea606040cc79f913325401fb`. Para facilitar a leitura, este parâmetro foi substituído pela abreviatura do espaço reservado `<requestId>` nos exemplos abaixo.

Exemplos:
*   `ataques incidentes request_id:<requestId>`: para pesquisar um ataque ou incidente com o `request_id` igual a `<requestId>`.
*   `ataques incidentes !request_id:<requestId>`: para pesquisar ataques e incidentes com o `request_id` diferente de `<requestId>`.
*   `ataques incidentes request_id`: para pesquisar ataques e incidentes com qualquer `request_id`.
*   `ataques incidentes !request_id`: para pesquisar ataques e incidentes sem qualquer `request_id`.

### Pesquisa por hits amostrados

Para pesquisar pelo [hits amostrados](../events/analyze-attack.md#sampling-of-hits), adicione `amostrado` à string de pesquisa.

### Pesquisa pelo UUID do nó

Para pesquisar por ataques detectados por um nó específico, especifique o prefixo `node_uuid`, seguido do UUID do nó.

Exemplos:

* `ataques incidentes hoje node_uuid:<UUID DO NÓ>`: para pesquisar todos os ataques e incidentes de hoje encontrados pelo nó com este `<UUID DO NÓ>`.
* `ataques hoje !node_uuid:<UUID DO NÓ>`: para pesquisar todos os ataques de hoje encontrados por qualquer nó exceto o nó com este `<UUID DO NÓ>`.

!!! info "Pesquisa apenas por novos ataques"
    Apenas ataques detectados após 31 de Maio de 2023 serão exibidos ao pesquisar por UUID do nó.

Você pode encontrar o UUID do nó na seção **Nós**, [detalhes do nó](../../user-guides/nodes/nodes.md#viewing-details-of-a-node). Clique em UUID para copiá-lo ou clique em **Ver eventos deste nó no dia** (alternar para a seção **Eventos**).

### Pesquisa por regra de cliente baseada em regex

Para obter a lista de ataques detectados por [regras de cliente baseadas em regex](../../user-guides/rules/regex-rule.md), no campo de pesquisa especifique `custom_rule`.

Para qualquer desses ataques, em seus detalhes, são apresentados os links para as regras correspondentes (pode haver mais de uma). Clique no link para acessar os detalhes da regra e editá-los, se necessário.

![Ataque detectado por regra baseada em regex - edição de regra](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

Você pode usar `!custom_rule` para obter a lista de ataques não relacionados a qualquer regra de cliente baseada em regex.