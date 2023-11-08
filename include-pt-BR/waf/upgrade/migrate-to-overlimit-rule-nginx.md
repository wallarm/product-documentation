A partir da versão 3.6, você pode ajustar a detecção de ataque `overlimit_res` usando a regra no Console Wallarm.

Anteriormente, as diretivas NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] e [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] eram usadas. As diretivas listadas são consideradas obsoletas com o novo lançamento da regra e serão excluídas em futuros lançamentos.

Se as configurações de detecção de ataque `overlimit_res` forem personalizadas por meio das diretivas listadas, é recomendado transferi-las para a regra da seguinte forma:

1. Abra o Console Wallarm → **Rules** e prossiga para a configuração da regra [**Ajuste fino da detecção de ataque overlimit_res**][overlimit-res-rule-docs].
1. Configure a regra da mesma maneira que as diretivas NGINX:

    * A condição da regra deve corresponder ao bloco de configuração NGINX com as diretivas `wallarm_process_time_limit` e `wallarm_process_time_limit_block` especificadas.
    * O limite de tempo para o nó processar uma única solicitação (milissegundos): o valor de `wallarm_process_time_limit`.
    * Processamento de solicitações: a opção **Parar processamento** é recomendada.
    
        !!! warning "Risco de esgotamento da memória do sistema"
            O limite de tempo alto e/ou continuação do processamento de solicitações após o limite ser excedido pode desencadear o esgotamento de memória ou o processamento de solicitações fora do tempo.
    
    * Registrar o ataque overlimit_res: a opção **Registrar e exibir nos eventos** é recomendada.

        Se o valor de `wallarm_process_time_limit_block` ou `process_time_limit_block` for `off`, escolha a opção **Não criar evento de ataque**.
    
    * A regra não possui opção explícita equivalente para a diretiva `wallarm_process_time_limit_block`. Se a regra definir **Registrar e exibir nos eventos**, o nó bloqueará ou passará o ataque `overlimit_res` dependendo do [modo de filtragem do nó][waf-mode-instr]:

        * No modo **monitoramento**, o nó encaminha a solicitação original para o endereço do aplicativo. O aplicativo tem o risco de ser explorado pelos ataques incluídos nas partes processadas e não processadas da solicitação.
        * No modo **bloqueio seguro**, o nó bloqueia a solicitação se ela for originada do endereço IP [graylisted][graylist-docs]. Caso contrário, o nó encaminha a solicitação original para o endereço do aplicativo. O aplicativo tem o risco de ser explorado pelos ataques incluídos nas partes processadas e não processadas da solicitação.
        * No modo **block**, o nó bloqueia a solicitação.
1. Exclua as diretivas NGINX `wallarm_process_time_limit` e `wallarm_process_time_limit_block` do arquivo de configuração NGINX.

    Se a detecção de ataque `overlimit_res` for ajustada usando tanto as diretivas quanto a regra, o nó processará as solicitações conforme a regra define.