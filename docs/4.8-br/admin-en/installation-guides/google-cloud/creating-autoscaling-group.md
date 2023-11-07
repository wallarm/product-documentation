[img-creating-instance-group]:          ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]:    ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]:         ../../../images/cloud-node-status.png

[link-cpu-usage-policy]:                            https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]:                  https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]:        https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]:                     https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]:                      load-balancing-guide.md

# Criando um grupo de instâncias gerenciado com auto scaling habilitado

Para criar um grupo de instâncias gerenciado e configurar o auto scaling, siga os passos abaixo:

1. Navegue até a página **Grupos de instâncias** na seção **Máquina de Computação** do menu e clique no botão **Criar grupo de instâncias**.

    ![Criando um grupo de instâncias][img-creating-instance-group]

2. Digite o nome do grupo de instâncias no campo **Nome**.

3. Selecione **Grupo de instâncias gerenciadas** na configuração de **Tipo de grupo**.

4. Habilite o auto scaling para o grupo de instâncias selecionando a opção **On** na lista suspensa **Auto scaling**.

5. Selecione a política de scaling necessária na lista suspensa da **Política de auto scaling**.
    
    As políticas de scaling contêm regras para aumentar e diminuir o tamanho do grupo de instâncias. O sistema determina quando deve adicionar ou remover uma instância do grupo para manter a métrica em que a política se baseia no nível alvo definido pelo usuário.
    
    É possível selecionar uma das seguintes políticas:
    
    1. Uso de CPU: O tamanho do grupo é controlado para manter a carga média do processador das máquinas virtuais do grupo no nível exigido ([documentação da política de uso de CPU][link-cpu-usage-policy]).
    2. Uso de Balanceamento de Carga HTTP: O tamanho do grupo é controlado para manter a carga do balanceador de tráfego HTTP no nível necessário ([documentação da política de uso do balanceamento de carga HTTP][link-http-load-balancing-policy]).
    3. Métrica de Monitoramento Stackdriver: O tamanho do grupo é controlado para manter a métrica selecionada do instrumento de Monitoramento Stackdriver no nível necessário ([documento da política de métrica de monitoramento Stackdriver][link-stackdriver-monitoring-metric-policy]).
    4. Múltiplas métricas: A decisão de alterar o tamanho do grupo é baseada em várias métricas ([documentação da política de várias métricas][link-multiple-metrics-policy]). 
    
    Este guia utiliza a política de **Uso de CPU** para demonstrar os princípios do funcionamento do mecanismo de auto scaling.
    
    Para aplicar esta política, especificar o nível de carga média exigido dos processadores no campo **Uso de CPU alvo** (em percentagens).
    
    !!! info "Exemplo"
        A configuração a seguir descreve o controle do tamanho do grupo de instâncias para manter a carga média dos processadores da máquina virtual no nível de 60 por cento.
        ![Exemplo: criando um grupo de instâncias][img-create-instance-group-example]

6. Especifique o tamanho mínimo do grupo de instâncias no campo **Número mínimo de instâncias** (por exemplo, duas instâncias).

7. Especifique o tamanho máximo do grupo de instâncias no campo **Número máximo de instâncias** (por exemplo, 10 instâncias).

8. Especifique o período durante o qual os valores métricos não devem ser registrados na instância recém-adicionada, no campo **Período de arrefecimento** (por exemplo, 60 segundos). Isto pode ser necessário se observar saltos no consumo de recursos após a adição de uma nova instância.

    !!! info "Requisitos de período de arrefecimento"
        O período de arrefecimento deve ser mais longo que o tempo necessário para a inicialização da instância.

9. Certifique-se de que todos os parâmetros do grupo de instâncias estão corretamente configurados e, em seguida, clique no botão **Criar**.

O número especificado de instâncias será automaticamente lançado após a criação bem-sucedida do grupo de auto scaling.

É possível verificar se o grupo de auto scaling foi criado corretamente, vendo o número de instâncias lançadas no grupo e comparando este ponto de dados com o número de nós de filtragem conectados ao Wallarm Cloud.

Isto pode ser feito usando o Console Wallarm. Por exemplo, se duas instâncias com nós de filtro estiverem operando simultaneamente, o Console Wallarm mostrará esse número para o respectivo nó Wallarm na seção **Nós**.

![A aba **Nós** na interface web Wallarm][img-checking-nodes-operation]

Agora você pode prosseguir com a [criação e configuração do balanceador de carga][link-creating-load-balancer].