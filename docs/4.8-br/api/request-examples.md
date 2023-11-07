[access-wallarm-api-docs]: #your-own-client
[application-docs]:        ../user-guides/settings/applications.md

# Exemplos de solicitação de API da Wallarm

A seguir estão alguns exemplos do uso da API da Wallarm. Você também pode gerar exemplos de código por meio da interface de referência da API para a [nuvem nos EUA](https://apiconsole.us1.wallarm.com/) ou [nuvem na UE](https://apiconsole.eu1.wallarm.com/). Usuários experientes também podem usar o console do desenvolvedor do navegador ("Network" tab) para aprender rapidamente quais terminais e solicitações da API são usados ​​pela interface do usuário da sua conta Wallarm para buscar dados da API pública. Para obter informações sobre como abrir o console do desenvolvedor, você pode usar a documentação oficial do navegador ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## Obter os primeiros 50 ataques detectados nas últimas 24 horas

Substitua `TIMESTAMP` pela data de 24 horas atrás convertida para o formato [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-attacks-en.md"

## Obter grandes quantidades de ataques (100 ou mais)

Para conjuntos de ataques e hits contendo 100 ou mais registros, o ideal é recuperá-los em partes menores, em vez de buscar grandes conjuntos de dados de uma só vez, para otimizar o desempenho. Os terminais correspondentes da API Wallarm suportam paginação baseada em cursor com 100 registros por página.

Essa técnica envolve retorno de um ponteiro para um item específico no conjunto de dados e, em seguida, em solicitações subsequentes, o servidor retorna resultados após o ponteiro fornecido. Para habilitar a paginação do cursor, inclua `"paging": true` nos parâmetros de solicitação.

Os seguintes são exemplos de chamadas de API para recuperar todos os ataques detectados desde `<TIMESTAMP>` usando a paginação do cursor:

=== "Nuvem da UE"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "Nuvem dos EUA"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

Esta solicitação retorna informações sobre os últimos 100 ataques detectados, organizados do mais recente para o mais antigo. Além disso, a resposta inclui um parâmetro `cursor` que contém um ponteiro para o próximo conjunto de 100 ataques.

Para recuperar os próximos 100 ataques, use a mesma solicitação de antes, mas inclua o parâmetro `cursor` com o valor do ponteiro copiado da resposta da solicitação anterior. Isso permite que a API saiba de onde começar a retornar o próximo conjunto de 100 ataques, por exemplo:

=== "Nuvem da UE"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "Nuvem dos EUA"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

Para recuperar mais páginas de resultados, execute solicitações incluindo o parâmetro `cursor` com o valor copiado da resposta anterior.

Abaixo está o exemplo de código Python para recuperar ataques usando a paginação do cursor:

=== "Nuvem da UE"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```
=== "Nuvem dos EUA"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://us1.api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "X-WallarmAPI-Secret": "<YOUR_SECRET_KEY>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```

## Obter os primeiros 50 incidentes confirmados nas últimas 24 horas

A solicitação é muito semelhante ao exemplo anterior para uma lista de ataques; o termo `"!vulnid": null` é adicionado a esta solicitação. Este termo instrui a API para ignorar todos os ataques sem ID de vulnerabilidade especificado, e é assim que o sistema distingue entre ataques e incidentes.

Substitua `TIMESTAMP` pela data de 24 horas atrás convertida para o formato [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-incidents-en.md"

## Obter as primeiras 50 vulnerabilidades no status "active" nas últimas 24 horas

Substitua `TIMESTAMP` pela data de 24 horas atrás convertida para o formato [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## Obter todas as regras configuradas

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## Obter apenas as condições de todas as regras

--8<-- "../include/api-request-examples/get-conditions.md"

## Obter regras anexadas a uma condição específica

Para apontar para uma condição específica, use seu ID - você pode obtê-lo ao solicitar condições de todas as regras (veja acima).

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## Criar o patch virtual para bloquear todas as solicitações enviadas para `/my/api/*`

--8<-- "../include/api-request-examples/create-rule-en.md"

## Criar o patch virtual para um ID de instância de aplicativo específico para bloquear todas as solicitações enviadas para `/my/api/*`

Um aplicativo deve ser [configurado](../user-guides/settings/applications.md) antes de enviar esta solicitação. Especifique um ID de um aplicativo existente em `action.point[instance].value`.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## Criar uma regra para considerar as solicitações com um valor específico do cabeçalho `X-FORWARDED-FOR` como ataques

A seguinte solicitação criará o [indicador de ataque personalizado com base na expressão regular](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$`.

Se as solicitações para o domínio `MY.DOMAIN.COM` tiverem o cabeçalho HTTP `X-FORWARDED-FOR: 44.33.22.11`, o nó Wallarm as considerará como ataques de scanner e bloqueará os ataques se o [modo de filtragem](../admin-en/configure-wallarm-mode.md) correspondente tiver sido definido.

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## Criar a regra definindo o modo de filtragem para monitoramento para o aplicativo específico

A seguinte solicitação criará a [regra que define o nó para filtrar o tráfego](../user-guides/rules/wallarm-mode-rule.md) que vai para o [aplicativo](../user-guides/settings/applications.md) com ID `3` no modo de monitoramento.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## Excluir regra por seu ID

Você pode copiar o ID da regra a ser excluída ao [obter todas as regras configuradas](#get-all-configured-rules). Além disso, um ID de regra foi retornado em resposta à solicitação de criação de regra, no parâmetro de resposta `id`.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## Chamadas de API para obter, preencher e excluir objetos da lista de IPs

A seguir estão alguns exemplos de chamadas de API para obter, preencher e excluir objetos da [lista de IPs](../user-guides/ip-lists/overview.md).

### Parâmetros de solicitação de API

Parâmetros a serem passados ​​nas solicitações de API para ler e alterar listas de IPs:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### Adicionar à lista as entradas do arquivo `.csv`

Para adicionar à lista os IPs ou sub-redes do arquivo `.csv`, use o seguinte script bash:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Adicionar à lista um único IP ou sub-rede

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Adicionar à lista vários países

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Adicionar à lista vários serviços de proxy

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### Excluir um objeto da lista de IPs

Os objetos são excluídos das listas de IPs por seus IDs.

Para obter um ID de objeto, solicite o conteúdo da lista de IPs e copie `objects.id` do objeto necessário de uma resposta:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Tendo o ID do objeto, envie a seguinte solicitação para excluí-lo da lista:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Você pode excluir vários objetos de uma vez passando seus IDs como uma matriz na solicitação de exclusão.