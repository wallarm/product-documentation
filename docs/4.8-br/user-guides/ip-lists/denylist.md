# Lista de negação de endereços IP

**Lista de negação** é uma lista de endereços IP que não têm permissão para acessar seus aplicativos, mesmo que originem solicitações legítimas. O nó de filtragem em qualquer [modo](../../admin-en/configure-wallarm-mode.md) bloqueia todas as solicitações originadas de endereços IP na lista de negação (a menos que os IPs estejam duplicados na [allowlist](allowlist.md)).

No Console Wallarm → **Listas de IP** → **Lista de negação**, você pode gerenciar endereços IP bloqueados da seguinte maneira:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![Lista de negação de IP](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "Nome antigo da lista"
    O nome antigo da lista de negação de endereços IP é "lista de endereços IP na blacklist".

## Exemplos de uso da lista de negação de IP

* Bloquear endereços IP dos quais vários ataques consecutivos se originaram.

    Um ataque pode incluir várias solicitações originadas de um endereço IP e contendo cargas maliciosas de diferentes tipos. Um dos métodos para bloquear tais ataques é bloquear a origem das solicitações. Você pode configurar o bloqueio automático do IP de origem configurando o limite para bloqueio do IP de origem e a reação apropriada no [gatilho](../triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

* Bloquear ataques baseados em comportamento.

    O nó de filtragem Wallarm pode bloquear a maioria das solicitações de tráfego prejudiciais caso a caso se uma carga maliciosa for detectada. No entanto, para ataques baseados em comportamento quando cada solicitação individual é legítima (por exemplo, tentativas de login com pares de usuário/senha) o bloqueio por origem pode ser necessário.

    Por padrão, o bloqueio automático de fontes de ataques comportamentais está desativado. [Instruções sobre como configurar a proteção contra força bruta →](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

## Adicionando um objeto à lista

Você pode habilitar o Wallarm para listar automaticamente os endereços IP na **Lista de negação se eles produzirem algum tráfego suspeito**, bem como listar objetos **manualmente**.

!!! info "Adicionando um endereço IP à lista no nó multiusuário"
    Se você instalou o [nó multiusuário](../../installation/multi-tenant/overview.md), mude primeiro para a [conta do inquilino](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) para a qual o endereço IP é adicionado à lista.

### População automática da Lista de negação (recomendado)

A funcionalidade [gatilhos](../../user-guides/triggers/triggers.md) permite a inclusão automática de IPs na Lista de negação pelas seguintes condições:

* Solicitações maliciosas dos seguintes tipos: [`Força bruta`, `Navegação forçada`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md).
* `Número de cargas maliciosas` produzidos por um IP.

Gatilhos com a reação `Lista de negação de endereço IP` aos eventos listados colocam automaticamente os IPs na Lista de negação por um período de tempo especificado. Você pode configurar gatilhos no Console Wallarm → **Gatilhos**.

### População manual da Lista de negação

Para adicionar um endereço IP, sub-rede ou grupo de endereços IP à lista:

1. Abra Console Wallarm → **Listas de IP** → **Lista de negação** e clique no botão **Adicionar objeto**.
1. No menu suspenso, selecione a lista para adicionar o novo objeto.
2. Especifique um endereço IP ou grupo de endereços IP de uma das seguintes maneiras:

    * Digite um único **Endereço IP** ou uma **sub-rede**

        !!! info "Máscaras de sub-rede suportadas"
            A máscara de sub-rede máxima suportada é `/32` para endereços IPv6 e `/12` para endereços IPv4.
    
    * Selecione um **país** ou uma **região** (geolocalização) para adicionar todos os endereços IP registrados nesse país ou região
    * Selecione o **tipo de origem** para adicionar todos os endereços IP que pertencem a esse tipo, por exemplo:
        * **Tor** para endereços IP da rede Tor
        * **Proxy** para endereços IP de servidores proxy públicos ou web
        * **Motores de busca** para endereços IP de spiders de motores de busca
        * **VPN** para endereços IP de redes privadas virtuais
        * **AWS** para endereços IP registrados na Amazon AWS
        * **Endereços IP maliciosos** para endereços IP que são amplamente conhecidos por atividades maliciosas, conforme mencionado em fontes públicas, e verificado por análise de especialistas. Nós extraímos esses dados a partir de uma combinação dos seguintes recursos:

            * [Segurança de Rede de Inteligência Coletiva](http://cinsscore.com/list/ci-badguys.txt)
            * [Regras de Ameaças Emergentes da Proofpoint](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [Repositório de Ameaças do DigitalSide](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [Bloqueador de bot ruim definitivo do NGINX](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

3. Selecione os aplicativos para os quais você permite ou restringe o acesso para os endereços IP especificados.
4. Selecione o período para o qual um endereço IP ou um grupo de endereços IP deve ser adicionado à lista. O valor mínimo é de 5 minutos, o valor máximo é para sempre.
5. Especifique a razão para adicionar um endereço IP ou um grupo de endereços IP à lista.

![Adicionar IP à lista (com app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### Lista de negação automática de IPs de bots

--8<-- "../include/waf/features/ip-lists/autopopulation-by-antibot.md"

## Recebendo notificações sobre IPs na lista de negação

Você pode receber notificações sobre novos IPs na Lista de negação através dos mensageiros ou sistemas SIEM que você usa todos os dias. Para habilitar as notificações, configure o [gatilho](../triggers/triggers.md) apropriado, por exemplo:

![Exemplo de gatilho para IP na Lista de negação](../../images/user-guides/triggers/trigger-example4.png)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"