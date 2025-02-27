# Wallarm Cloud está inativo

Se o Wallarm Cloud estiver inativo, os nós Wallarm continuam a mitigação de ataques com algumas limitações. Para saber mais, use este guia de solução de problemas.

## Como o nó Wallarm opera se o Wallarm Cloud está inativo?

O Wallarm Cloud é um serviço extremamente estável e escalável. Além disso, todos os dados da conta da sua empresa são protegidos por [backups](#how-does-wallarm-protect-its-cloud-data-from-loss).

No entanto, se em raros casos o Wallarm Cloud ficar temporariamente inativo (por exemplo, ao pausar para manutenção), um nó Wallarm continua operando, embora com algumas limitações.

!!! info "Verificando o status do Wallarm Cloud"
    Para verificar o status do Wallarm Cloud, visite [status.wallarm.com](https://status.wallarm.com/). Para se manter informado, inscreva-se para receber atualizações.

O que continua a funcionar:

* Processamento de tráfego no [modo] configurado(../admin-en/configure-wallarm-mode.md#available-filtration-modes) usando as regras carregadas no nó durante a última [sincronização](../admin-en/configure-cloud-node-synchronization-en.md) bem-sucedida entre o Cloud e o nó. O nó pode continuar a funcionar, pois as últimas versões dos seguintes elementos são carregadas do Cloud de acordo com a programação e armazenadas no nó localmente:

    * [Conjunto de regras personalizado](../user-guides/rules/rules.md)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)

* As [listas de IP](../user-guides/ip-lists/overview.md) também são carregadas no nó e armazenadas dentro dele. Os endereços carregados continuarão a ser tratados, mas apenas até a data/horário de expiração.

    Essas datas/horas não serão atualizadas até que o Cloud seja restaurado e sincronizado; também não haverá novos endereços removidos até a restauração/sincronização do Cloud.

    Observe que a expiração de alguns endereços IP nas listas leva ao cessar da proteção contra os [ataques de força bruta](../admin-en/configuration-guides/protecting-against-bruteforce.md) relacionados a esses endereços.

O que para de funcionar:

* O nó coleta, mas não pode enviar dados sobre ataques detectados e vulnerabilidades para o Cloud. Observe que o módulo [postanalytics](../admin-en/installation-postanalytics-en.md) do seu nó tem um armazenamento na memória (Tarantool) onde os dados coletados são temporariamente armazenados antes de serem enviados para o Cloud. Assim que o Cloud for restaurado, os dados armazenados em buffer serão enviados para ele.

    !!! warning "Limitação de armazenamento na memória do nó"
        O tamanho do buffer é [limitado](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) e, quando excedido, os dados mais antigos são excluídos. Portanto, o tempo em que o Cloud estava inativo e a quantidade de informações coletadas durante esse tempo podem levar à situação em que você recebe no Console Wallarm apenas alguns dados após a restauração do Cloud.

* O nó coleta, mas não pode enviar [métricas](../admin-en/configure-statistics-service.md) para o tráfego processado para o Cloud.
* A varredura dos [ativos expostos](../user-guides/scanner.md) e [vulnerabilidades típicas](../user-guides/vulnerabilities.md) será interrompida.
* [Gatilhos](../user-guides/triggers/triggers.md) deixarão de funcionar e, portanto:
    * [Listas de IP](../user-guides/ip-lists/overview.md) param de ser atualizadas.
    * [Notificações baseadas em gatilhos](../user-guides/triggers/triggers.md) não aparecerão.
* [Descoberta de inventário de API](../api-discovery/overview.md) não funcionará.
* A [verificação de ameaças ativas](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) será interrompida.
* [Ataques de força bruta](../admin-en/configuration-guides/protecting-against-bruteforce.md) não serão detectados.
* As integrações serão interrompidas, incluindo que:
    * [Notificações instantâneas e por e-mail](../user-guides/settings/integrations/integrations-intro.md) não aparecerão.
    * O relatório será interrompido.
* Sem acesso ao Console Wallarm.
* [Wallarm API](../api/overview.md) não responderá.

Note que além do estado inativo total descrito acima, às vezes apenas serviços específicos podem estar temporariamente inacessíveis, enquanto os outros continuam funcionando. Se este for o caso, o serviço [status.wallarm.com](https://status.wallarm.com/) fornecerá a você as informações correspondentes.

## O que acontece após a restauração do Cloud?

Após a restauração do Cloud:

* O acesso ao Console Wallarm é restaurado.
* O nó envia informações armazenadas em buffer para o Cloud (considerar as limitações acima).
* Os gatilhos reagem aos novos dados enviando notificações e atualizando IPs.
* Se houver alguma alteração nos IPs, eles são enviados para o nó durante a próxima sincronização.
* Se houver uma construção de [conjunto de regras personalizado inacabado](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down), ela é reiniciada.
* O Cloud e o nó de filtragem sincronizam na programação de uma maneira usual.

## Existe um caso em que o nó não recebeu as configurações salvas no Console Wallarm antes do Cloud Wallarm estar inativo?

Sim, isso é possível. Por exemplo, vamos considerar que o intervalo de [sincronização](../admin-en/configure-cloud-node-synchronization-en.md) é de 3 minutos e:

1. A última construção do conjunto de regras personalizado foi concluída no Cloud há 21 minutos e foi carregada para o nó há 20 minutos.
2. Durante as próximas 6 sincronizações nada foi retirado do Cloud, pois não havia nada de novo.
3. Então as regras foram alteradas no Cloud e uma nova construção começou - a construção precisou de 4 minutos para terminar, mas em 2 minutos o Cloud foi inativado.
4. Um nó só pega a construção terminada, então dentro de 2 minutos de sincronizações não haverá nada para carregar para o nó.
5. Em mais 1 minuto, o nó vem com a nova solicitação de sincronização, mas o Cloud não responde.
6. O nó continuará a filtrar de acordo com o conjunto de regras personalizado com uma idade de 24 minutos e essa idade aumentará enquanto o Cloud estiver inativo.

## Como o Wallarm protege seus dados do Cloud contra perda?

O Wallarm Cloud salva **todos os dados** fornecidos por um usuário no Console Wallarm e carregados para ele a partir dos nós. Como mencionado acima, o Wallarm Cloud ficar temporariamente inativo é um caso extremamente raro. Mas se isso acontecer, a chance é significativamente baixa de que o estado inativo afete os dados salvos. Isso significa que, após a restauração, você continuará trabalhando imediatamente com todos os seus dados.

Para lidar com a baixa chance de que os discos rígidos que armazenam dados atuais do Wallarm Cloud são destruídos, o Wallarm cria backups automaticamente e restaura a partir deles, se necessário:

* RPO: o backup é criado a cada 24 horas
* RTO: o sistema estará disponível novamente em no máximo 48 horas
* Os 14 backups mais recentes são armazenados

!!! info "Parâmetros de proteção e disponibilidade RPO/RTO"
    * **RPO (objetivo do ponto de recuperação)** é usado para determinar a frequência do backup de dados: define a quantidade máxima de tempo pelo qual os dados podem ser perdidos.
    * **RTO (objetivo do tempo de recuperação)** é a quantidade de tempo real que uma empresa tem para restaurar seus processos a um nível de serviço aceitável após um desastre para evitar consequências intoleráveis associadas à interrupção.

Para obter mais informações sobre o plano de recuperação de desastres (DR) da Wallarm e suas peculiaridades para sua empresa, [entre em contato com o suporte da Wallarm](mailto:support@wallarm.com).