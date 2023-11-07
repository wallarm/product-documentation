A partir da versão 3.6, você pode ajustar a detecção de ataque `overlimit_res` usando a regra no Console Wallarm.

Anteriormente, as seguintes opções eram usadas:

* As diretivas NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] e [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]
* Os parâmetros Envoy [`process_time_limit`][envoy-process-time-limit-docs] e [`process_time_limit_block`][envoy-process-time-limit-block-docs]

As diretivas e parâmetros listados são considerados obsoletos com o novo lançamento da regra e serão excluídos nas próximas versões.

Se as configurações de detecção de ataque `overlimit_res` forem personalizadas por meio dos parâmetros listados, recomenda-se transferi-los para a regra da seguinte maneira:

1. Abra o Console Wallarm → **Regras** e prossiga para a configuração da regra [**Ajustar a detecção de ataque overlimit_res**][overlimit-res-rule-docs].
1. Configure a regra como feito nos arquivos de configuração montados:

    * A condição da regra deve corresponder ao bloco de configuração NGINX ou Envoy com as diretivas `wallarm_process_time_limit` e `wallarm_process_time_limit_block` ou os parâmetros `process_time_limit` e `process_time_limit_block` especificados.
    * O limite de tempo para o nó processar uma única requisição (milissegundos): o valor de `wallarm_process_time_limit` ou `process_time_limit`.
    * Processamento de requisição: a opção **Parar processamento** é recomendada.
    
        !!! warning "Risco de esgotamento da memória do sistema"
            O alto limite de tempo e/ou a continuação do processamento após o limite ser ultrapassado pode acionar a exaustão da memória ou processamento fora do tempo da requisição.
    
    * Registar o ataque overlimit_res: a opção **Registar e exibir nos eventos** é recomendada.

        Se o valor de `wallarm_process_time_limit_block` ou `process_time_limit_block` for `off`, escolha a opção **Não criar evento de ataque**.
    
    * A regra não possui uma opção equivalente explícita para a diretiva `wallarm_process_time_limit_block` (`process_time_limit_block` no Envoy). Se a regra definir **Registrar e exibir nos eventos**, o nó bloqueará ou permitirá o ataque `overlimit_res` dependendo do [modo de filtragem do nó][waf-mode-instr]:

        * No modo **monitoramento**, o nó encaminha a solicitação original para o endereço do aplicativo. O aplicativo tem o risco de ser explorado pelos ataques incluídos nas partes da solicitação processadas e não processadas.
        * No modo **bloqueio seguro**, o nó bloqueia a solicitação se ela for originada do endereço IP [listado em cinza][graylist-docs]. Caso contrário, o nó encaminha a solicitação original para o endereço do aplicativo. O aplicativo tem o risco de ser explorado pelos ataques incluídos nas partes da requisição processadas e não processadas.
        * No modo **bloqueio**, o nó bloqueia a requisição.
1. Exclua as diretivas NGINX `wallarm_process_time_limit`, `wallarm_process_time_limit_block` e os parâmetros Envoy `process_time_limit`, `process_time_limit_block` do arquivo de configuração montado.

    Se a detecção de ataque `overlimit_res` for ajustada usando tanto os parâmetros quanto a regra, o nó processará as solicitações conforme a regra definir.