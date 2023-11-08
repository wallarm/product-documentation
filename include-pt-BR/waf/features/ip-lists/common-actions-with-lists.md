## Adicionando um objeto à lista

Para adicionar um endereço IP, sub-rede ou grupo de endereços IP à lista:

1. Clique no botão **Adicionar objeto**.
2. Especifique um endereço IP ou grupo de endereços IP de uma das seguintes maneiras:

    * Insira um único **endereço IP** ou uma **sub-rede**
        
        !!! info "Máscaras de sub-rede suportadas"
            A máscara de sub-rede máxima suportada é `/32` para endereços IPv6 e `/12` para endereços IPv4.
    
    * Selecione um **país** ou uma **região** (geolocalização) para adicionar todos os endereços IP registrados nesse país/região
    * Selecione o **tipo de origem** para adicionar todos os endereços IP que pertencem a esse tipo, por exemplo:
        * **Tor** para endereços IP da rede Tor
        * **Proxy** para endereços IP de servidores proxy públicos ou web
        * **Search Engine Spiders** para endereços IP de spiders de motor de busca
        * **VPN** para endereços IP de redes privadas virtuais
        * **AWS** para endereços IP registrados na Amazon AWS
3. Selecione o período pelo qual um endereço IP ou um grupo de endereços IP deve ser adicionado à lista. O valor mínimo é 5 minutos, o valor máximo é para sempre.
4. Especifique o motivo para adicionar um endereço IP ou um grupo de endereços IP à lista.
5. Confirme a adição de um endereço IP ou um grupo de endereços IP à lista.

![Adicionar IP à lista (sem aplicativo)](../../images/user-guides/ip-lists/add-ip-to-list-without-app.png)

## Analisando objetos adicionados à lista

O Console Wallarm exibe os seguintes dados sobre cada objeto adicionado à lista:

* **Objeto** - endereço IP, sub-rede, país/região ou origem IP adicionado à lista.
* **Aplicação** - aplicação à qual a configuração de acesso do objeto é aplicada. Como a aplicação da [configuração de acesso do objeto a aplicações específicas é limitada](overview.md#known-caveats-of-ip-lists-configuration), essa coluna sempre exibe o valor **Todos**.
* **Motivo** - motivo para adicionar um endereço IP ou um grupo de endereços IP à lista. O motivo é especificado manualmente ao adicionar objetos à lista ou gerado automaticamente quando os IPs são adicionados à lista por [gatilhos](../triggers/triggers.md).
* **Data de inclusão** - data e hora em que um objeto foi adicionado à lista.
* **Remover** - período de tempo após o qual um objeto será excluído da lista.

## Filtrando a lista

Você pode filtrar os objetos na lista por:

* Endereço IP ou sub-rede especificados na string de pesquisa
* Período pelo qual você deseja obter um status da lista
* País/região em que um endereço IP ou uma sub-rede está registrado
* Fonte à qual um endereço IP ou uma sub-rede pertence

## Alterando o tempo que um objeto está na lista

Para alterar o tempo que um endereço IP está na lista:

1. Selecione um objeto da lista.
2. No menu do objeto selecionado, clique em **Alterar período de tempo**.
3. Selecione uma nova data para remover um objeto da lista e confirme a ação.

## Excluindo um objeto da lista

Para excluir um objeto da lista:

1. Selecione um ou vários objetos da lista.
2. Clique em **Excluir**.