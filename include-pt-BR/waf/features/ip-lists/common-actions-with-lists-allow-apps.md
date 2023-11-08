[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## Analisando objetos adicionados à lista

O console Wallarm exibe os seguintes dados sobre cada objeto adicionado à lista:

* **Objeto** - Endereço IP, sub-rede, país/região ou fonte de IP adicionada à lista.
* **Aplicativo** - aplicativo ao qual a configuração de acesso do objeto é aplicada.
* **Razão** - razão para adicionar um endereço IP ou um grupo de endereços IP à lista. A razão é especificada manualmente ao adicionar objetos à lista ou gerada automaticamente quando os IPs são adicionados à lista por [gatilhos](../triggers/triggers.md).
* **Data de adição** - data e hora em que um objeto foi adicionado à lista.
* **Remover** - período de tempo após o qual um objeto será excluído da lista.

## Revisando o histórico de alterações na lista de IPs

Quando você escolhe datas específicas para examinar o conteúdo da lista de IPs, o sistema retorna um histórico detalhado de suas mudanças, incluindo o momento exato e o método de inclusão, seja manual ou automatizado. O relatório também fornece dados sobre os indivíduos responsáveis pelas alterações e os motivos de cada inclusão. Esses insights auxiliam na manutenção de um rastro de auditoria para conformidade e relatórios.

![Histórico da lista de IP](../../images/user-guides/ip-lists/ip-list-history.png)

Ao voltar para a guia **Agora**, você acessa o estado atual da lista de IPs, permitindo visualizar os objetos atualmente incluídos na lista.

## Filtrando a lista

Você pode filtrar os objetos na lista por:

* Endereço IP ou sub-rede especificado na linha de pesquisa
* Período para o qual você deseja obter um status da lista
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

!!! warning "Re-adicionando o endereço IP excluído"
    Após excluir manualmente o endereço IP adicionado à lista pelo [gatilho](../triggers/triggers.md), o gatilho funcionará novamente apenas depois de metade do tempo anterior em que o endereço IP estava na lista.

    Por exemplo:

    1. O endereço IP foi adicionado automaticamente à lista cinza por 1 hora porque 4 vetores de ataque diferentes foram recebidos deste endereço IP em 3 horas (como está configurado no [gatilho](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)).
    2. O usuário deletou este endereço IP da lista cinza via console Wallarm.
    3. Se 4 vetores de ataque diferentes são enviados a partir deste endereço IP dentro de 30 minutos, então este endereço IP não será adicionado à lista cinza.

## Chamadas de API para obter, popular e excluir objetos da lista de IPs

Para obter, popular e excluir objetos da lista de IPs, você pode [chamar a API Wallarm diretamente](../../api/overview.md) além de usar a interface do usuário do console Wallarm. Abaixo estão alguns exemplos das chamadas de API correspondentes.

### Parâmetros de solicitação da API

Parâmetros a serem passados nas solicitações da API para ler e alterar listas de IPs:

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

Para obter um ID de objeto, solicite o conteúdo da lista de IPs e copie `objects.id` do objeto requerido de uma resposta:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Tendo o ID do objeto, envie a seguinte solicitação para excluí-lo da lista:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Você pode excluir vários objetos de uma vez, passando seus IDs como uma array na solicitação de exclusão.