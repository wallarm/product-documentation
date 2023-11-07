A partir da versão 3.6, você pode ajustar com precisão a detecção de ataque `overlimit_res` usando a regra no Wallarm Console.

Anteriormente, as diretivas NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] e [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] foram usadas. As diretivas listadas são consideradas obsoletas com o lançamento da nova regra e serão excluídas em lançamentos futuros.

Se as configurações de detecção de ataque `overlimit_res` são personalizadas através das diretivas listadas, recomenda-se transferi-las para a regra da seguinte maneira:

1. Abra o Wallarm Console → **Regras** e prossiga para a configuração da regra [**Ajustar a detecção de ataque overlimit_res**][overlimit-res-rule-docs].
1. Configure a regra como feito através das diretivas NGINX:

    * A condição da regra deve corresponder ao bloco de configuração NGINX com as diretivas `wallarm_process_time_limit` e `wallarm_process_time_limit_block` especificadas.
    * O tempo limite para o nodo processar uma única solicitação (milissegundos): o valor de `wallarm_process_time_limit`.
    * Processamento de solicitação: a opção **Parar o processamento** é recomendada.

        !!! aviso "Risco de esgotamento de memória do sistema"
            O alto limite de tempo e/ou a continuação do processamento de solicitações após o limite ter sido excedido podem provocar exaustão de memória ou processamento de solicitação fora do tempo.
    
    * Registre o ataque overlimit_res: a opção **Registrar e exibir nos eventos** é recomendada.

        Se o valor de `wallarm_process_time_limit_block` ou `process_time_limit_block` for `off`, escolha a opção **Não criar evento de ataque**.
    
    * A regra não possui a opção equivalente explícita para a diretiva `wallarm_process_time_limit_block`. Se a regra define **Registrar e exibir nos eventos**, o nó irá bloquear ou passar o ataque `overlimit_res` dependendo do [modo de filtragem do nó][waf-mode-instr]:

        * No modo **monitoramento**, o nó encaminha a solicitação original para o endereço da aplicação. A aplicação tem o risco de ser explorada pelos ataques incluídos nas partes da solicitação processadas e não processadas.
        * No modo **bloqueio seguro**, o nó bloqueia a solicitação se ela for originada do endereço IP [listado em cinza][graylist-docs]. Caso contrário, o nó encaminha a solicitação original para o endereço da aplicação. A aplicação tem o risco de ser explorada pelos ataques incluídos nas partes da solicitação processadas e não processadas.
        * No modo **bloqueio**, o nó bloqueia a solicitação.
1. Exclua as diretivas NGINX `wallarm_process_time_limit` e `wallarm_process_time_limit_block` do arquivo de configuração `values.yaml`.

    Se a detecção de ataque `overlimit_res` for ajustada usando as diretivas e a regra, o nó irá processar as solicitações como a regra determina.