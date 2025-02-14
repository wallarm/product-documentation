[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

# Trabalhando com as métricas do nó de filtro no Nagios

Verifique se o Nagios está monitorando com sucesso o status do serviço criado anteriormente:
1. Faça login na interface web do Nagios.
2. Vá para a página de serviços clicando no link “Services”.
3. Certifique-se de que o serviço `wallarm_nginx_abnormal` está sendo exibido e tem o status “OK”:

   ![Status do serviço][img-nagios-service-status]

    
   !!! info "Forçar verificação de serviço"
       Se o serviço não tiver o status "OK", você pode forçar uma verificação do serviço para confirmar seu status.
       
       Para fazer isso, clique no nome do serviço na coluna "Service", execute a verificação selecione "Reschedule the next check of this service" na lista "Service Commands" e inserindo os parâmetros necessários.
    

4. Visualize informações detalhadas sobre o serviço clicando no link com seu nome na coluna “Status”:

   ![Informações detalhadas sobre serviço][img-nagios-service-details]

   Verifique se o valor da métrica exibido no Nagios (linha "Performance Data") corresponde à saída `wallarm-status` no nó de filtro:

   --8<-- "../include-pt-BR/monitoring/wallarm-status-check-latest.md"
 
5. Realize um ataque de teste a uma aplicação protegida pelo nó de filtro. Para fazer isso, você pode enviar uma solicitação maliciosa à aplicação com a utilidade curl ou um navegador.

   --8<-- "../include-pt-BR/monitoring/sample-malicious-request.md"
    
6. Certifique-se de que o valor "Performance Data" no Nagios aumentou e corresponde ao valor exibido por `wallarm-status` no nó de filtro:

   --8<-- "../include-pt-BR/monitoring/wallarm-status-output-latest.md"

   ![Valor atualizado do Performance Data][img-nagios-service-perfdata-updated]

Agora os valores da métrica `wallarm_nginx/gauge-abnormal` do nó de filtro são exibidos nas informações do estado do serviço no Nagios.

!!! info "Visualização de dados do Nagios"
    Por padrão, o Nagios Core apenas suporta o rastreamento do status do serviço (`OK`, `WARNING`, `CRITICAL`). Para armazenar e visualizar valores de métricas contidos em "Performance Data", você pode usar utilitários de terceiros, por exemplo, o [PNP4Nagios][link-PNP4Nagios].
