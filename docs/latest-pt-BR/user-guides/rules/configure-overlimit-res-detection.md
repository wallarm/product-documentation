# Ajuste fino na detecção de ataques `overlimit_res`

O nó Wallarm gasta um tempo limitado no processamento de uma única requisição recebida e, se o limite de tempo é excedido, marca a requisição como o ataque de [sobrecarga de recursos (`overlimit_res`)](../../attacks-vulns-list.md#overlimiting-of-computational-resources). A regra ** Ajuste fino na detecção de ataques overlimit_res** permite personalizar o limite de tempo alocado para o processamento de uma única requisição e o comportamento padrão do nó quando o limite é excedido.

Limitar o tempo de processamento da requisição impede ataques de bypass direcionados aos nós Wallarm. Em alguns casos, as requisições marcadas como `overlimit_res` podem indicar recursos insuficientes alocados para os módulos do nó Wallarm resultando em longo processamento de requisições.

## Comportamento padrão do nó

Por padrão, o nó Wallarm é configurado para gastar no máximo **1.000 milissegundos** no processamento de uma única requisição recebida.

Se o limite de tempo for excedido, o nó Wallarm:

1. Interrompe o processamento da requisição.
1. Marca a requisição como ataque `overlimit_res` e envia detalhes do ataque para o Cloud Wallarm.

    Se a parte da requisição processada também contiver outros [tipos de ataques](../../attacks-vulns-list.md), o nó Wallarm também envia detalhes sobre eles para o Cloud.

    Ataques dos tipos correspondentes serão exibidos na [lista de eventos](../events/check-attack.md) no console Wallarm.
1. <a name="request-blocking"></a>No [modo](../../admin-en/configure-wallarm-mode.md) **monitoramento**, o nó encaminha a requisição original para o endereço do aplicativo. O aplicativo corre o risco de ser explorado pelos ataques incluídos nas partes processadas e não processadas da requisição.

    No modo **safe blocking**, o nó bloqueia a requisição se ela se originar do endereço IP [listado como suspeito](../ip-lists/graylist.md). Caso contrário, o nó encaminha a requisição original para o endereço do aplicativo. O aplicativo corre o risco de ser explorado pelos ataques incluídos nas partes processadas e não processadas da requisição.

    No modo **block**, o nó bloqueia a requisição.

!!! info "Processamento de requisições no modo "Desativado""
    No [modo](../../admin-en/configure-wallarm-mode.md) **desativado**, o nó não analisa o tráfego recebido e, consequentemente, não detecta os ataques direcionados à sobrecarga de recursos.

## Alterando o comportamento padrão do nó

!!! warning "Risco de bypass de proteção ou esgotamento de memória do sistema"
    * É recomendado alterar o comportamento padrão do nó apenas nos locais estritamente específicos onde é realmente necessário, por exemplo, onde o envio de arquivos grandes é realizado e onde não há risco de bypass de proteção e exploração de vulnerabilidades.
    * O alto limite de tempo e/ou a continuação do processamento da requisição após o limite ser excedido podem desencadear o esgotamento de memória ou o processamento fora do tempo da requisição.

A regra **Ajuste fino na detecção de ataques overlimit_res** permite alterar o comportamento padrão do nó da seguinte maneira:

* Definir um limite personalizado para o processamento de uma única requisição
* Parar ou continuar o processamento da requisição quando o limite de tempo é excedido

    Se o nó continuar o processamento da requisição após o limite de tempo ter sido excedido, ele envia dados sobre ataques detectados para o Cloud somente após o processamento da requisição estar totalmente concluído.

    Se a regra estiver definida para interromper o processamento, o nó interrompe o processamento da requisição assim que o limite de tempo é excedido. Em seguida, ele encaminha a requisição, a menos que esteja configurado para registrar um ataque e esteja no modo de bloqueio. Nesse caso, o nó bloqueia a requisição e registra o ataque `overlimit_res`.
* Registrar o ataque `overlimit_res` quando o limite de tempo de processamento da requisição é excedido ou não

    Se o nó estiver configurado para registrar o ataque, ele [bloqueia a requisição ou a encaminha para o endereço do aplicativo](#request-blocking) dependendo do modo de filtração.

    Se o nó não estiver configurado para registrar o ataque e a requisição não contiver outros tipos de ataques, o nó encaminha a requisição original para o endereço do aplicativo. Se a requisição contiver outros tipos de ataques, o nó bloqueia a requisição ou a encaminha para o endereço do aplicativo dependendo do modo de filtração

A regra NÃO permite:

* Definir o modo de bloqueio para ataques `overlimit_res` separadamente de outras configurações. Se a opção **Registrar e exibir nos eventos** for escolhida, o nó bloqueia o ataque `overlimit_res` ou o encaminha para o endereço do aplicativo, dependendo do [modo de filtração](../../admin-en/configure-wallarm-mode.md) definido para o endpoint correspondente.

## Exemplo de regra

* A regra aumenta o limite de tempo para processar cada requisição POST para `https://example.com/upload` até 1.020 milissegundos. O endpoint especificado realiza o envio de arquivos grandes.
* Outros parâmetros do comportamento do nó permanecem padrão - se o nó processa a requisição por mais de 1.020 milissegundos, ele interrompe o processamento da requisição e registra o ataque `overlimit_res`.

![Exemplo da regra "Registrar e exibir nos eventos"](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)