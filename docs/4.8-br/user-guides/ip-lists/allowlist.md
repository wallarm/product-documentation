# Lista de permissões de endereço IP

**Lista de permissões** é uma lista de endereços IP confiáveis que têm permissão para acessar seus aplicativos, mesmo se as solicitações originadas a partir deles contiverem sinais de ataque. A lista de permissões tem a mais alta prioridade entre outras listas, o nó de filtragem em qualquer [modo de filtragem](../../admin-en/configure-wallarm-mode.md) não bloqueará solicitações originárias de endereços IP da lista de permissões.

No Console Wallarm → **Listas de IP** → **Lista de permissões**, você pode gerenciar endereços IP da lista de permissões da seguinte maneira:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![Lista de permissões IP](../../images/user-guides/ip-lists/allowlist-apps.png)

!!! info "Nome antigo da lista"
    O nome antigo da lista de permissões de endereço IP é "lista de permissões de endereço IP".

## Exemplos de uso da lista de permissões de IP

Se você usa outras ferramentas confiáveis ​​que originam solicitações potencialmente maliciosas, é necessário adicionar manualmente os IPs originais dessas ferramentas à lista de permissões.

## Adicionando um objeto à lista

!!! info "Adicionando um endereço IP à lista no nó de vários inquilinos"
    Se você instalou o [nó de vários inquilinos](../../installation/multi-tenant/overview.md), mude primeiro para a [conta de um inquilino](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) para o qual o endereço IP está sendo adicionado à lista.

Para adicionar um endereço IP, sub-rede ou grupo de endereços IP à lista:

1. Abra o Console Wallarm → **Listas de IP** → **Lista de permissões** e clique no botão **Adicionar objeto**.
1. Na lista suspensa, selecione a lista para adicionar o novo objeto.
2. Especifique um endereço IP ou grupo de endereços IP de uma das seguintes maneiras:

    * Insira um único **endereço IP** ou uma **sub-rede**

        !!! info "Máscaras de sub-rede suportadas"
            A máscara de sub-rede máxima suportada é `/32` para endereços IPv6 e `/12` para endereços IPv4.
    
    * Selecione um **país** ou uma **região** (geolocalização) para adicionar todos os endereços IP registrados neste país ou região
    * Selecione o **tipo de fonte** para adicionar todos os endereços IP que pertencem a este tipo, por exemplo:
        * **Tor** para endereços IP da rede Tor
        * **Proxy** para endereços IP de servidores proxy públicos ou na web
        * **Search Engine Spiders** para endereços IP de spiders de mecanismos de busca
        * **VPN** para endereços IP de redes privadas virtuais
        * **AWS** para endereços IP registrados no Amazon AWS
        * **IPs maliciosos** para endereços IP bem conhecidos por atividades maliciosas, como mencionado em fontes públicas e verificado por análise de especialistas. Coletamos esses dados de uma combinação dos seguintes recursos:
        
            * [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
            * [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

3. Selecione os aplicativos aos quais você permite ou restringe o acesso para os endereços IP especificados.
4. Selecione o período pelo qual um endereço IP ou um grupo de endereços IP deve ser adicionado à lista. O valor mínimo é de 5 minutos, o valor máximo é para sempre.
5. Especifique o motivo para adicionar um endereço IP ou um grupo de endereços IP à lista.

![Adicione IP à lista (com aplicativo)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
