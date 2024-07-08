# Exemplos de gatilhos

Aprenda exemplos reais de [gatilhos Wallarm](triggers.md) para entender melhor este recurso e configurar gatilhos adequadamente.

## Coloque na lista cinza um IP se 4 ou mais cargas úteis maliciosas forem detectadas em 1 hora

Se 4 ou mais diferentes cargas úteis maliciosas forem enviadas para o recurso protegido de um endereço IP, este endereço IP será colocado na lista cinza por 1 hora para todos os aplicativos em uma conta Wallarm.

Se você criou recentemente a conta Wallarm, este [gatilho já está criado e habilitado](triggers.md#pre-configured-triggers-default-triggers). Você pode editar, desativar, excluir ou copiar este gatilho, bem como os gatilhos criados manualmente.

![Gatilho de listagem cinza](../../images/user-guides/triggers/trigger-example-graylist.png)

**Para testar o gatilho:**

1. Envie as seguintes solicitações ao recurso protegido:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    Existem 4 cargas úteis maliciosas dos tipos [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) e [Path Traversal](../../attacks-vulns-list.md#path-traversal).
1. Abra o Console Wallarm → **Listas de IP** → **Lista cinza** e verifique que o endereço IP de onde as solicitações se originaram está na lista cinza por 1 hora.
1. Abra a seção **Eventos** e verifique se os ataques estão exibidos na lista:

    ![Três cargas úteis maliciosas na interface do usuário](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    Para procurar ataques, você pode usar os filtros, por exemplo: `sqli` para os ataques [SQLi](../../attacks-vulns-list.md#sql-injection), `xss` para os ataques [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), `ptrav` para os ataques [Path Traversal](../../attacks-vulns-list.md#path-traversal). Todos os filtros estão descritos nas [instruções de uso de pesquisa](../../user-guides/search-and-filters/use-search.md).

O gatilho é liberado em qualquer modo de filtragem de nó, para que ele coloque os IPs na lista cinza, independentemente do modo do nó. No entanto, o nó analisa a lista cinza apenas no modo **bloqueio seguro**. Para bloquear solicitações maliciosas originadas de IPs listados em cinza, mude o modo [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) do nó para bloqueio seguro aprendendo suas características primeiro.

## Coloque na lista de negação um IP se 4 ou mais cargas úteis maliciosas forem detectadas em 1 hora

Se 4 ou mais diferentes [cargas úteis maliciosas](../../glossary-en.md#malicious-payload) forem enviadas ao recurso protegido de um endereço IP, este endereço IP será colocado na lista de negação por 1 hora para todos os aplicativos em uma conta Wallarm.

![Gatilho padrão](../../images/user-guides/triggers/trigger-example-default.png)

**Para testar o gatilho:**

1. Envie as seguintes solicitações ao recurso protegido:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    Existem 4 cargas úteis maliciosas dos tipos [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) e [Path Traversal](../../attacks-vulns-list.md#path-traversal).
2. Abra Console Wallarm → **Listas de IP** → **Lista de negação** e verifique que o endereço IP de onde as solicitações se originaram está bloqueado por 1 hora.
1. Abra a seção **Eventos** e verifique se os ataques estão exibidos na lista:

    ![Três cargas úteis maliciosas na interface do usuário](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    Para procurar ataques, você pode usar os filtros, por exemplo: `sqli` para os ataques [SQLi](../../attacks-vulns-list.md#sql-injection), `xss` para os ataques [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), `ptrav` para os ataques [Path Traversal](../../attacks-vulns-list.md#path-traversal). Todos os filtros estão descritos nas [instruções de uso de pesquisa](../../user-guides/search-and-filters/use-search.md).

Se um endereço IP foi colocado na lista de negação por este gatilho, o nó de filtragem bloquearia todas as solicitações maliciosas e legítimas que se originaram deste IP. Para permitir solicitações legítimas, você pode configurar o [gatilho de listagem cinza](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

## Marque as solicitações como um ataque de força bruta se 31 ou mais solicitações forem enviadas ao recurso protegido

Para marcar solicitações como um ataque de força bruta regular, o gatilho com a condição **Força bruta** deve ser configurado.

Se 31 ou mais solicitações forem enviadas para `https://example.com/api/v1/login` em 30 segundos, essas solicitações serão marcadas como [ataque de força bruta](../../attacks-vulns-list.md#brute-force-attack) e o endereço IP de onde as solicitações se originaram será adicionado à lista de negação.

![Gatilho de força bruta com contador](../../images/user-guides/triggers/trigger-example6.png)

[Detalhes sobre a configuração de proteção contra força bruta e teste de gatilho →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Marque as solicitações como um ataque de navegação forçada se o código 404 for retornado para 31 ou mais solicitações

Para marcar solicitações como um ataque de navegação forçada, o gatilho com a condição **Navegação forçada** deve ser configurado.

Se o endpoint `https://example.com/**.**` retornar o código de resposta 404 31 ou mais vezes em 30 segundos, as solicitações apropriadas serão marcadas como um ataque de [navegação forçada](../../attacks-vulns-list.md#forced-browsing) e um endereço IP de origem dessas solicitações será bloqueado.

Exemplos de endpoints que correspondem ao valor URI são `https://example.com/config.json`, `https://example.com/password.txt`.

![Gatilho de navegação forçada](../../images/user-guides/triggers/trigger-example5.png)

[Detalhes sobre a configuração de proteção contra força bruta e teste de gatilho →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Marque as solicitações como o ataque BOLA

Se 31 ou mais solicitações forem enviadas para `https://example.com/shops/{shop_id}/financial_info` em 30 segundos, essas solicitações serão marcadas como o [ataque BOLA](../../attacks-vulns-list.md#broken-object-level-authorization-bola) e o endereço IP de onde as solicitações se originaram será adicionado à lista de negação.

![Gatilho BOLA](../../images/user-guides/triggers/trigger-example7.png)

[Detalhes sobre a configuração da proteção BOLA e teste de gatilho →](../../admin-en/configuration-guides/protecting-against-bola.md)

## Detectar JWTs fracos

Se uma quantidade significativa de solicitações recebidas processadas pelo nó 4.4 ou acima contiver JWTs fracos, registre a vulnerabilidade correspondente[correspondente](../vulnerabilities.md).

JWTs fracos são aqueles que são:

* Não criptografados - não há algoritmo de assinatura (o campo `alg` é `none` ou está ausente).
* Assinado usando chaves secretas comprometidas

Se você criou recentemente a conta Wallarm, este [gatilho já está criado e habilitado](triggers.md#pre-configured-triggers-default-triggers). Você pode editar, desativar, excluir ou copiar este gatilho, bem como os gatilhos criados manualmente.

![Exemplo de gatilho para JWTs fracos](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**Para testar o gatilho:**

1. Gere um JWT assinado usando uma [chave secreta comprometida](https://github.com/wallarm/jwt-secrets), por exemplo:

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
1. Gere algum tráfego com solicitações autenticadas usando um JWT comprometido.
1. Se uma quantidade significativa de solicitações recebidas processadas pelo nó 4.4 ou acima contiver JWTs fracos, a Wallarm registrará a vulnerabilidade, por exemplo:

    ![Exemplo de vulnerabilidade JWT](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)

## Notificação de Opsgenie se 2 ou mais incidentes forem detectados em um segundo

Se 2 ou mais incidentes com o servidor de aplicativos ou banco de dados forem detectados em um segundo, a notificação sobre este evento será enviada ao Opsgenie.

![Exemplo de um gatilho que envia dados para o Splunk](../../images/user-guides/triggers/trigger-example3.png)

**Para testar o gatilho**, é necessário enviar um ataque explorando uma vulnerabilidade ativa ao recurso protegido. A seção Console Wallarm → **Vulnerabilidades** exibe as vulnerabilidades ativas detectadas em seus aplicativos e os exemplos de ataques que exploram essas vulnerabilidades.

Se o exemplo de ataque for enviado ao recurso protegido, a Wallarm registrará o incidente. Dois ou mais incidentes registrados irão acionar o envio da seguinte notificação para Opsgenie:

```
[Wallarm] Gatilho: O número de incidentes excedeu o limite

Tipo de notificação: incidentes_excedidos

O número de incidentes detectados excedeu 1 em 1 segundo.
Esta notificação foi disparada pelo gatilho "Notificação sobre incidentes".

Cláusulas adicionais do gatilho:
Alvo: servidor, banco de dados.

Ver eventos:
https://my.wallarm.com/search?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Cliente: TestCompany
Nuvem: EU
```

* `Notificação sobre incidentes` é o nome do gatilho
* `TestCompany` é o nome da conta da sua empresa no Console Wallarm
* `EU` é a Nuvem Wallarm onde a sua conta da empresa está registrada

!!! info "Protegendo o recurso da exploração de vulnerabilidade ativa"
    Para proteger o recurso da exploração da vulnerabilidade ativa, recomendamos corrigir a vulnerabilidade em tempo hábil. Se a vulnerabilidade não puder ser corrigida do lado do aplicativo, por favor, configure um [patch virtual](../rules/vpatch-rule.md) para bloquear ataques que explorem essa vulnerabilidade.

## Notificação para URL do Webhook se o endereço IP for adicionado à lista de negação

Se um endereço IP foi adicionado à lista de negação, o webhook sobre este evento será enviado para a URL do Webhook.

![Exemplo de gatilho para IP na lista de negação](../../images/user-guides/triggers/trigger-example4.png)

**Para testar o gatilho:**

1. Abra o Console Wallarm → **Listas de IP** → **Lista de negação** e adicione o endereço IP à lista de negação. Por exemplo:

    ![Adicionando IP à lista de negação](../../images/user-guides/triggers/test-ip-blocking.png)
2. Verifique que o seguinte webhook foi enviado para a URL do Webhook:

    ```
    [
        {
            "summary": "[Wallarm] Gatilho: Novo endereço IP foi colocado na lista de negação",
            "description": "Tipo de notificação: ip_bloqueado\n\nEndereço IP 1.1.1.1 foi colocado na lista de negação até 2021-06-10 02:27:15 +0300 pelos motivos Produz muitos ataques. Você pode revisar os endereços IP bloqueados na seção \"Lista de negação\" do Console Wallarm.\nEsta notificação foi ativada pelo gatilho \"Notificação sobre IP na lista de negação\". O IP está bloqueado para o aplicativo Application #8.\n\nCliente: TestCompany\nNuvem: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Notificação sobre IP na lista de negação",
            "application": "Application #8",
            "reason": "Produz muitos ataques",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Notificação sobre IP na lista de negação` é o nome do gatilho
    * `TestCompany` é o nome da conta da sua empresa no Console Wallarm
    * `EU` é a Nuvem Wallarm onde a sua conta da empresa está registrada

## Agrupar acertos originados do mesmo IP em um ataque

Se mais de 50 [hits](../../about-wallarm/protecting-against-attacks.md#hit) do mesmo endereço IP forem detectados em 15 minutos, os próximos hits do mesmo IP serão agrupados em um ataque na [lista de eventos](../events/check-attack.md).

Se você criou recentemente a conta Wallarm, este [gatilho já está criado e habilitado](triggers.md#pre-configured-triggers-default-triggers). Você pode editar, desativar, excluir ou copiar este gatilho, bem como os gatilhos criados manualmente.

![Exemplo de um gatilho de agrupamento de hits](../../images/user-guides/triggers/trigger-example-group-hits.png)

**Para testar o gatilho**, envie 51 ou mais hits da seguinte forma:

* Todos os hits são enviados em 15 minutos
* Os endereços IP das fontes de hit são os mesos
* Hits têm diferentes tipos de ataque ou parâmetros com cargas úteis maliciosas ou endereços aos quais os hits são enviados (para que os hits não sejam [agrupados](../../about-wallarm/protecting-against-attacks.md#attack) em um ataque pelo método básico)
* Os tipos de ataque são diferentes de Força Bruta, Navegação Forçada, Excedendo o limite do recurso, Bomba de Dados e Patch Virtual

Exemplo:

* 10 hits para `example.com`
* 20 hits para `test.com`
* 40 hits para `example-domain.com`

Os primeiros 50 acertos aparecerão na lista de eventos como acertos individuais. Todos os acertos seguintes serão agrupados em um ataque, por exemplo:

![Acertos agrupados por IP em um ataque](../../images/user-guides/events/attack-from-grouped-hits.png)

O botão [**Marcar como falso positivo**](../events/false-attack.md#mark-an-attack-as-a-false-positive) e a opção de [verificação ativa](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) não estarão disponíveis para o ataque.

## Novos pontos de extremidade no seu inventário da API

As mudanças podem ocorrer na sua API. Elas serão descobertas pelo módulo [**API Discovery**](../../api-discovery/overview.md). Possíveis [mudanças](../../api-discovery/exploring.md#tracking-changes-in-api) são:

* Um novo ponto de extremidade é descoberto
* Um ponto de extremidade tem mudanças (novos parâmetros ou parâmetros excluídos)
* Um ponto de extremidade é marcado como não usado

Para receber notificações sobre algumas ou todas essas mudanças no seu e-mail ou mensageiro, o gatilho com a condição **Mudanças na API** deve ser configurado.

Neste exemplo, se novos pontos de extremidade para o host da API `example.com` forem descobertos pelo módulo API Discovery, a notificação sobre isso será enviada para o seu canal Slack configurado.

![Gatilho de mudanças na API](../../images/user-guides/triggers/trigger-example-changes-in-api.png)

**Para testar o gatilho:**

1. Em **Integrações**, configure a [integração com o Slack](../../user-guides/settings/integrations/slack.md).
1. Em **Gatilhos**, crie um gatilho como mostrado acima.
1. Envie várias solicitações para o ponto de extremidade `example.com/users` para obter a resposta `200` (`OK`).
1. Na seção **API Discovery**, verifique se o seu ponto de extremidade foi adicionado com a marca **Novo**.
1. Verifique as mensagens no seu canal Slack, como:
    ```
    [wallarm] Um novo ponto de extremidade foi descoberto na sua API

    Tipo de notificação: mudança_de_estrutura_da_API

    O novo endpoint GET example.com/users foi descoberto na sua API.

        Cliente: Cliente 001
        Nuvem: US

        Detalhes:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```
