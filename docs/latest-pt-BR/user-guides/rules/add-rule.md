[link-request-processing]:      request-processing.md
[link-regex]:                   https://github.com/yandex/pire
[link-filter-mode-rule]:        wallarm-mode-rule.md
[link-sensitive-data-rule]:     sensitive-data-rule.md
[link-virtual-patch]:           vpatch-rule.md
[link-regex-rule]:              regex-rule.md

[img-add-rule]:     ../../images/user-guides/rules/add-rule.png

# Adicionando Regras no Perfil da Aplicação

Para adicionar uma nova regra, vá para a aba *Rules*.

As regras podem ser adicionadas tanto a branches existentes quanto a novas branches. Elas podem ser criadas do zero ou baseadas em uma das branches existentes.

Para adicionar uma regra a uma branch existente, clique em *Add rule* (após passar o cursor do mouse sobre a linha de descrição da branch, o botão aparecerá no menu pop-up à direita). Você também pode realizar esta operação na página de regras desta branch.

Se necessário, é possível modificar a branch à qual uma regra será adicionada. Para isso, clique na cláusula *If request is* no formulário de adição de regra e faça alterações nas condições de descrição da branch. Se uma nova branch for criada, ela aparecerá na tela, e a visualização da estrutura da aplicação será atualizada.

![Adicionando uma nova regra][img-add-rule]


## Descrição da Branch

Uma descrição da branch consiste em um conjunto de condições para vários parâmetros que uma solicitação HTTP deve cumprir; caso contrário, as regras associadas a esta branch não serão aplicadas. Cada linha na seção *If request is* do formulário de adição de regra refere-se a uma condição separada composta por três campos: ponto, tipo e argumento de comparação. As regras descritas na branch só são aplicadas à solicitação se todas as condições forem cumpridas.

Para configurar o conjunto de condições, o **construtor de URI** e o **formulário de edição avançada** podem ser usados.

### Construtor de URI

#### Trabalhando com o Construtor de URI

O construtor de URI permite configurar as condições da regra especificando o método de solicitação e o endpoint em apenas uma linha:

* Para o método de solicitação, o construtor de URI fornece o seletor específico. Se o método não for selecionado, a regra será aplicada a solicitações com qualquer método.
* Para o endpoint da solicitação, o construtor de URI fornece o campo específico aceitando os seguintes formatos de valor:

    | Formato | Exemplos e valores do ponto da solicitação |
    | ------ | ------ |
    | URI completa incluindo os seguintes componentes:<ul><li>Esquema (o valor é ignorado, você pode especificar explicitamente o esquema usando o formulário avançado)</li><li>Domínio ou um endereço IP</li><li>Porta</li><li>Caminho</li><li>Parâmetros da string de consulta</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | URI com alguns componentes omitidos | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>``[header, 'HOST']` - qualquer valor</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | URI com `*` significando qualquer valor não vazio do componente | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - qualquer valor não vazio (oculto no formulário de edição avançada)</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - qualquer valor não vazio (oculto no formulário de edição avançada)</li><li>`[action_ext]` - qualquer valor não vazio (oculto no formulário de edição avançada)</li>O valor corresponde a `example.com/api/create/user.php`<br>e não corresponde a `example.com/create/user.php` e `example.com/api/create`.</ul>|
    | URI com `**` significando qualquer número de componentes, incluindo sua ausência | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>O valor corresponde a `example.com/api/create/user` e `example.com/api/user`.<br>O valor não corresponde a `example.com/user`, `example.com/api/user/index.php` e `example.com/api/user/?w=delete`.</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - qualquer valor não vazio (oculto no formulário de edição avançada)</li><li>`[action_ext]` - qualquer valor não vazio (oculto no formulário de edição avançada)</li>O valor corresponde a `example.com/api/create/user.php` e `example.com/api/user/create/index.php`<br>e não corresponde a `example.com/api`, `example.com/api/user` e `example.com/api/create/user.php?w=delete`.</ul> |
    | URI com [expressão regular](#condition-type-regex) para combinar certos valores de componente (regexp deve ser envolvido em `{{}}`) | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>O valor corresponde a `example.com/user/3445`<br>e não corresponde a `example.com/user/3445/888` e `example.com/user/3445/index.php`.</ul> |

A string especificada no construtor de URI é automaticamente analisada no conjunto de condições para os seguintes [pontos de solicitação](#points):

* `method`
* `header`. O construtor de URI permite especificar apenas o cabeçalho `HOST`.
* `path`, `action_name`, `action_ext`. Antes de confirmar a criação da regra, certifique-se de que os valores desses pontos de solicitação são analisados de uma das seguintes maneiras:
    * Valor explícito de determinado número `path` + `action_name` + `action_ext` (opcional)
    * Valor explícito de `action_name` + `action_ext` (opcional)
    * Valor explícito de determinado número `path` sem `action_name` e sem `action_ext`
* `query`

O valor especificado no construtor de URI pode ser completado por outros pontos de solicitação disponíveis apenas no [formulário de edição avançada](#advanced-edit-form).

#### Usando Curingas

Você pode usar curingas ao trabalhar com o construtor de URI no Wallarm? Não e sim. "Não" significa que você não pode usá-los [clássicamente](https://en.wikipedia.org/wiki/Wildcard_character), "sim" significa que você pode obter o mesmo resultado agindo assim:

* Dentro dos componentes analisados de sua URI, em vez de curingas, use expressões regulares.
* Coloque o símbolo `*` ou `**` no próprio campo URI para substituir um ou qualquer número de componentes (veja exemplos na seção [acima](#working-with-uri-constructor)).

**Alguns detalhes**

A sintaxe da expressão regular é diferente dos curingas clássicos, mas os mesmos resultados podem ser alcançados. Por exemplo, você quer obter uma máscara correspondente a:

* `something-1.example.com/user/create.com` e
* `anything.something-2.example.com/user/create.com`

...que em curingas clássicos você tentaria obter digitando algo como:

* `*.example.com/user/create.com`

Mas no Wallarm, seu `something-1.example.com/user/create.com` será analisado em:

![Exemplo de análise de URI em componentes](../../images/user-guides/rules/something-parsed.png)

...onde `something-1.example.com` é o ponto `header`-`HOST`. Nós mencionamos que o curinga não pode ser usado dentro do ponto, então, em vez disso, precisamos usar expressão regular: defina o tipo de condição como REGEX e então use a [sintaxe específica](#condition-type-regex) de expressão regular do Wallarm:

1. Não use `*` no sentido de "qualquer número de símbolos".
2. Coloque todos os `.` que queremos interpretar como "pontos reais" entre colchetes:

    `something-1[.]example[.]com`

3. Use `.` sem colchetes como substituto de "qualquer símbolo" e `*` depois dele como quantificador "0 ou mais repetições do precedente", então `.*` e:

    `.*[.]example[.]com`

4. Adicione `$` no final da expressão para dizer que o que criamos deve terminar nosso componente:

    `.*[.]example[.]com$`

    !!! informação "A maneira mais simples"
        Você pode omitir `.*` e deixar apenas `[.]example[.]com$`. Em ambos os casos, o Wallarm assumirá que qualquer caractere pode aparecer antes de `[.]example[.]com$` qualquer número de vezes.

    ![Usando expressão regular no componente de cabeçalho](../../images/user-guides/rules/wildcard-regex.png)

### Formulário de Edição Avançada

#### Pontos

O campo *ponto* indica qual valor do parâmetro deve ser extraído da solicitação para comparação. No momento, nem todos os pontos que podem ser analisados pelo nó de filtro são suportados.

Os seguintes pontos são atualmente suportados:

* **application**: ID da aplicação.
* **proto**: versão do protocolo HTTP (1.0, 1.1, 2.0,...).
* **scheme**: http ou https.
* **uri**: parte da URL da solicitação sem o domínio (por exemplo, `/blogs/123/index.php?q=aaa` para a solicitação enviada para `http://example.com/blogs/123/index.php?q=aaa`).
* **path**, **action_name**, **action_ext** é a sequência hierárquica de componentes URI onde: 

    * **path**: uma matriz com partes de URI separadas pelo símbolo `/` (a última parte da URI não está incluída na matriz). Se houver apenas uma parte na URI, a matriz estará vazia.
    * **action_name**: a última parte da URI após o símbolo `/` e antes do primeiro período (`.`). Esta parte da URI sempre é apresentada na solicitação, mesmo que seu valor seja uma string vazia.
    * **action_ext**: a parte da URI após o último período (`.`). Pode estar ausente na solicitação.
* **query**: parâmetros de string de consulta.
* **header**: cabeçalhos de solicitação. Ao inserir um nome de cabeçalho, os valores mais comuns são exibidos em uma lista suspensa. Por exemplo: `HOST`, `USER-AGENT`, `COOKIE`, `X-FORWARDED-FOR`, `AUTHORIZATION`, `REFERER`, `CONTENT-TYPE`.

    !!! informação "Gerenciando regras do cabeçalho `HOST` para FQDNs e endereços IP"
        Se o cabeçalho `HOST` estiver definido para um FQDN, as solicitações direcionadas para o endereço IP associado não serão afetadas pela regra. Para aplicar a regra a tais solicitações, defina o valor do cabeçalho `HOST` para o IP específico nas condições da regra, ou crie uma regra separada para o FQDN e seu IP.

        Quando colocado depois de um balanceador de carga que modifica o cabeçalho `HOST`, o nó Wallarm aplica as regras com base no valor atualizado, não no original. Por exemplo, se o balanceador mudar o `HOST` de um IP para um domínio, o nó segue as regras para aquele domínio.

* **method**: métodos de solicitação. Se o valor não for explicitamente especificado, a regra será aplicada a solicitações com qualquer método.

#### Tipo de Condição: EQUAL (`=`)

O valor do ponto deve corresponder exatamente ao argumento de comparação. Por exemplo, apenas `example` corresponde ao valor do ponto `example`.

!!! informação "Tipo de condição EQUAL para o valor do cabeçalho HOST"
    Para cobrir mais solicitações com as regras, restringimos o tipo de condição EQUAL para o cabeçalho HOST. Em vez do tipo EQUAL, recomendamos usar o tipo IEQUAL que permite valores de parâmetro em qualquer registro.
    
    Se você usou anteriormente o tipo EQUAL, ele será automaticamente substituído pelo tipo IEQUAL.

#### Tipo de Condição: IEQUAL (`Aa`)

O valor do ponto deve corresponder ao argumento de comparação em qualquer caso. Por exemplo: `example`, `ExAmple`, `exampLe` correspondem ao valor do ponto `example`.

#### Tipo de Condição: REGEX (`.*`)

O valor do ponto deve corresponder à expressão regular.

**Sintaxe da expressão regular**

Para combinar solicitações com expressões regulares, a biblioteca PIRE é usada. Na maior parte, a sintaxe das expressões é padrão, mas tem algumas especificidades como descrito abaixo e no arquivo README do [repositório PIRE][link-regex].

??? informação "Mostrar sintaxe de expressão regular"
    Caracteres que podem ser usados como estão:

    * Letras latinas minúsculas: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * Letras latinas maiúsculas: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * Dígitos: `0 1 3 4 5 6 7 8 9`
    * Caracteres especiais: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * Espaços em branco

    Caracteres que devem ser colocados entre colchetes `[]` ao invés de serem escapados com `\`:

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    Caracteres que devem ser convertidos para ASCII de acordo com ISO‑8859:

    * Caracteres UTF‑8 (por exemplo, o caractere `ʃ` convertido para ASCII é `Ê`)

    Grupos de caracteres:

    * `.` para qualquer caractere, exceto uma nova linha
    * `()` para agrupar expressões regulares, procurar símbolos presentes dentro `()` ou estabelecer uma ordem de precedência
    * `[]` para um único caractere presente dentro `[]` (sensível a maiúsculas e minúsculas); o grupo pode ser usado para os casos específicos:
        * para ignorar maiúsculas e minúsculas (por exemplo, `[cC]`)
        * `[a-z]` para combinar uma das letras latinas minúsculas
        * `[A-Z]` para combinar uma das letras latinas maiúsculas
        * `[0-9]` para combinar um dos dígitos
        * `[a-zA-Z0-9[.]]` para combinar uma das letras latinas minúsculas, ou maiúsculas, ou dígitos, ou ponto

    Caracteres lógicos:

    * `~` é igual a NOT. A expressão invertida e o caractere devem ser colocados em `()`,`<br>por exemplo: `(~(a))`
    * `|` é igual a OR 
    * `&` é igual a AND

    Caracteres para especificar limites de string:

    * `^` para o início da string
    * `$` para o final da string

    Quantificadores:

    * `*` para 0 ou mais repetições da expressão regular precedente
    * `+` para 1 ou mais repetições da expressão regular precedente
    * `?` para 0 ou 1 repetições da expressão regular precedente
    * `{m}` para `m` repetições da expressão regular precedente
    * `{m,n}` para `m` a `n` repetições da expressão regular precedente; omitir `n` especifica um limite superior infinito

    Combinções de caracteres que funcionam com especificidades:

    * `^.*$` é igual a `^.+$` (valores vazios não correspondem com `^.*$`)
    * `^.?$`, `^.{0,}$`, `^.{0,n}$` são iguais a `^.+$`

    Temporariamente não suportado:

    * Classes de caracteres como `\W` para não alfabéticos, `\w` para alfabéticos, `\D` para qualquer não-dígitos, `\d` para qualquer decimais, `\S` para não-espaços em branco, `\s` para espaços em branco

    Sintaxe não suportada:

    * Códigos octais de três dígitos `\NNN`, `\oNNN`, `\ONNN`
    * `\cN` passando caracteres de controle via `\c` (por exemplo, `\cC` para CTRL+C)
    * `\A` para o início da string
    * `\z` para o final da string
    * `\b` antes ou depois do caractere de espaço em branco no final da string
    * `??`, `*?`, `+?` quantificadores preguiçosos 
    * Condicionais

**Testando expressões regulares**

Para testar a expressão regular, você pode usar a utilidade **cpire** no Debian ou Ubuntu suportados:

1. Adicione o repositório Wallarm:

    === "Debian 10.x (buster)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 22.04 LTS (jammy)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
2. Instale a utilidade **cpire**:

    ```bash
    sudo apt -y install libcpire-utils
    ```
3. Execute a utilizade **cpire**:
    ```bash
    cpire-runner -R '<YOUR_REGULAR_EXPRESSION>'
    ```
4. Insira o valor a ser verificado se corresponde à expressão regular. A utilidade retornará o resultado:
    * `0` se o valor corresponder à expressão regular
    * `FAIL` se o valor não corresponder à expressão regular 
    * Mensagem de erro se a expressão regular for inválida

    !!! aviso "Especificidades do tratamento do caractere `\`"
        Se a expressão incluir `\`, por favor, escape-o com `[]` e `\` (por exemplo, `[\\]`).

**Exemplos de expressões regulares adicionadas via Wallarm Console**

* Para combinar qualquer string que inclua <code>/.git</code>

    ```
    /[.]git
    ```
* Para combinar qualquer string que inclua <code>.example.com</code>

    ```
    [.]example[.]com
    ```
* Para combinar qualquer string finalizada com <code>/.example.*.com</code> onde `*` pode ser qualquer símbolo repetido qualquer número de vezes

    ```
    /[.]example[.].*[.]com$
    ```
* Para combinar todos os endereços IP excluindo 1.2.3.4 e 5.6.7.8

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* Para combinar qualquer string que finaliza com <code>/.example.com.php</code>

    ```
    /[.]example[.]com[.]php$
    ```
* Para combinar qualquer string que inclui `sqlmap`com letras em minúsculas e maiúsculas: <code>sqLmAp</code>, <code>SqLMap</code>, etc

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* Para combinar qualquer string que inclui um ou vários valores: <code>admin\\.exe</code>, <code>admin\\.bat</code>, <code>admin\\.sh</code>, <code>cmd\\.exe</code>, <code>cmd\\.bat</code>, <code>cmd\\.sh</code>

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* Para combinar qualquer string que inclui um ou vários valores: <code>onmouse</code> com letras em minúsculas e maiúsculas, <code>onload</code> com letras em minúsculas e maiúsculas, <code>win\\.ini</code>, <code>prompt</code>

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* Para combinar qualquer string que comece com `Mozilla` mas não contenha a string `1aa875F49III`
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* Para combinar qualquer string com um dos valores: `python-requests/`, `PostmanRuntime/`, `okhttp/3.14.0`, `node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### Tipo de Condição: ABSENT (`∅`)

A solicitação não deve conter o ponto designado. Neste caso, o argumento de comparação não é usado.

## Regra

A regra de processamento de solicitação adicionada é descrita na seção *Then*.

As seguintes regras são suportadas:

* [Desativar/Habilitar parsers](disable-request-parsers.md)
* [Alterar cabeçalhos de resposta do servidor](add-replace-response-header.md)
* [Definir o modo de filtragem][link-filter-mode-rule]
* [Mascarar dados sensíveis][link-sensitive-data-rule]
* [Definir modo de verificação de ameaça ativa](../../vulnerability-detection/threat-replay-testing/setup.md#enable)
* [Reescrever ataque antes da verificação ativa](../../vulnerability-detection/active-threat-verification/setup.md#rewrites)
* [Aplicar um patch virtual][link-virtual-patch]
* [Regras de detecção definidas pelo usuário][link-regex-rule]
* [Ignorar certos tipos de ataques](ignore-attack-types.md)
* [Ignorar certos sinais de ataque nos dados binários](ignore-attacks-in-binary-data.md)
* [Ajustar a detecção do ataque overlimit_res](configure-overlimit-res-detection.md)
* [Definir modo de Prevenção de Abuso de API para URLs de destino específicos](api-abuse-url.md)