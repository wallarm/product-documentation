[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]: ../settings/applications.md

# Lista de endereços IP em graylist

**Graylist** é uma lista de endereços IP suspeitos processados pelo nó apenas no [modo de filtragem](../../admin-en/configure-wallarm-mode.md) **seguro de bloqueio** da seguinte forma: se a origem for um IP na graylist que solicita pedidos maliciosos, o nó os bloqueia enquanto permite solicitações legítimas.

As solicitações maliciosas originadas de IPs em graylist são aquelas que contêm sinais dos seguintes ataques:

* [Ataques de validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
* [Ataques do tipo vpatch](../rules/vpatch-rule.md)
* [Ataques identificados com base em expressões regulares](../rules/regex-rule.md)

Em contraste com a graylist, a [denylist](../ip-lists/denylist.md) se refere a endereços IP que não têm permissão para acessar suas aplicações de maneira alguma - o nó bloqueia até mesmo o tráfego legítimo produzido por fontes na denylist. A inclusão de IP na graylist é uma das opções voltadas para a redução de [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives).

O comportamento do nó de filtragem pode ser diferente se os endereços IP da graylist também estiverem na allowlist, [mais sobre prioridades de lista](overview.md#algorithm-of-ip-lists-processing).

Em Console Wallarm → **Listas de IP** → **Graylist**, você pode gerenciar os endereços IP em graylist da seguinte maneira:

--8<-- "../include-pt-BR/waf/features/ip-lists/common-actions-with-lists-overview.md"

![Graylist IP](../../images/user-guides/ip-lists/graylist.png)

!!! info "Nome antigo da lista"
    O nome antigo da lista de endereços IP é "IP address greylist".

## Exemplos de uso da graylist de IP

* Incluir na graylist os endereços IP dos quais vários ataques consecutivos se originaram.

    Um ataque pode incluir várias solicitações originadas de um endereço IP e contendo cargas maliciosas de diferentes tipos. Um dos métodos para bloquear a maioria das solicitações maliciosas e permitir solicitações legítimas originadas deste IP é incluí-lo na graylist. Você pode configurar a inclusão automática de origens de IP na graylist configurando o limite para tal e a reação apropriada no [gatilho](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

    A inclusão da origem de IP na graylist pode reduzir significativamente o número de [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives).
* Inclua na graylist endereços IP, países, regiões, data centers, redes (por exemplo, Tor) que normalmente produzem tráfego prejudicial. O nó Wallarm permitirá solicitações legítimas produzidas por objetos na graylist e bloqueará solicitações maliciosas.

## Adicionando um objeto à lista

Você pode permitir que o Wallarm coloque endereços IP na graylist **automaticamente se eles gerarem algum tráfego suspeito**, bem como incluir objetos na graylist **manualmente**.

!!! info "Adicionando um endereço IP à lista no nó multi-tenant"
    Se você instalou o [nó multi-tenant](../../installation/multi-tenant/overview.md), troque primeiro para a [conta de um tenant](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) para qual o endereço IP é adicionado à lista.

    Os gatilhos para inclusão automática do IP na graylist também devem ser configurados nos níveis do tenant.

### População automática da graylist (recomendado)

A funcionalidade [triggers](../../user-guides/triggers/triggers.md) permite a inclusão automática de IPs na graylist pelas seguintes condições:

* Solicitações maliciosas dos seguintes tipos: [`Força bruta`, `Navegação forçada`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md).
* `Número de cargas maliciosas` produzidas por um IP.
* Novas contas corporativas possuem um [gatilho pré-configurado (padrão)](../../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers), que inclui um IP na graylist quando origina mais de 3 tipos diferentes de cargas maliciosas dentro de 1 hora.

Os gatilhos que possuem reação de `Incluir IP na graylist` aos eventos listados incluem automaticamente IPs na graylist por um período especificado. Você pode configurar gatilhos em Console Wallarm → **Triggers**.

### População manual da graylist

Para adicionar um endereço IP, subnet ou grupo de endereços IP à lista manualmente:

1. Abra Console Wallarm → **Listas de IP** → **Graylist** e clique em **Adicionar objeto**.
2. Especifique um endereço IP ou grupo de endereços IP de um dos seguintes modos:

    * Insira um único **endereço IP** ou uma **subnet**

        !!! info "Subnet masks suportadas"
            A máscara de sub-rede máxima suportada é `/32` para endereços IPv6 e `/12` para endereços IPv4.
    
    * Selecione um **país** ou uma **região** (geolocalização) para adicionar todos os endereços IP registrados neste país ou região
    * Selecione o **tipo de fonte** para adicionar todos os endereços IP que pertencem a este tipo, por exemplo:
        * **Tor** para endereços IP da rede Tor
        * ***Proxy** para endereços IP de servidores proxy públicos ou na web
        * **Search Engine Spiders** para endereços IP de robôs de motores de busca
        * **VPN** para endereços IP de redes privadas virtuais
        * **AWS** para endereços IP registrados na Amazon AWS
        * **IPs maliciosos** para endereços IP que são bem conhecidos por atividades maliciosas, conforme mencionados em fontes públicas e verificados por análise de especialistas. Nós obtemos esses dados de uma combinação dos seguintes recursos:

            * [Rede de Segurança de Inteligência Coletiva](http://cinsscore.com/list/ci-badguys.txt)
            * [Regras de ameaças emergentes da Proofpoint](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [Repositório de ameaças da DigitalSide](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

3. Selecione as aplicações para as quais você permite ou restringe o acesso para os endereços IP especificados.
4. Selecione o período para o qual um endereço IP ou um grupo de endereços IP deve ser adicionado à lista. O valor mínimo é 5 minutos, o valor máximo é para sempre.
5. Especifique o motivo para adicionar um endereço IP ou um grupo de endereços IP à lista.

![Adicionar IP à lista (com aplicativo)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### Inclusão automática de IPs de bot na graylist

--8<-- "../include-pt-BR/waf/features/ip-lists/autopopulation-by-antibot.md"

--8<-- "../include-pt-BR/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
