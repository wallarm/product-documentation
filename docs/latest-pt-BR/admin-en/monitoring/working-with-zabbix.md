[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png

[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need

# Trabalhando com as Métricas do Nó de Filtro no Zabbix

Acesse `http://10.0.30.30` para abrir a página de login da interface web do Zabbix. Faça login na interface web com o login padrão (`Admin`) e senha (`zabbix`).

Para monitorar as métricas do nó de filtro `node.example.local`, execute as seguintes ações:

1. Crie um novo host seguindo as seguintes etapas:
    1. Acesse a aba *Configuração → Hosts* e clique no botão *Criar host*.
    2. No campo *Nome do host*, insira o nome de domínio completamente qualificado do host do nó de filtro (`node.example.local`).
    3. Selecione o grupo em que deseja incluir o host no campo *Grupos* (por exemplo, você pode utilizar o grupo “Servidores Linux” já definido ou criar um grupo dedicado).
    4. No grupo de parâmetros *Interfaces do agente*, insira o endereço IP do host do nó de filtro (`10.0.30.5`). Mantenha o valor da porta padrão (`10050`) inalterado.
        
        !!! info "Conectando-se através de um nome de domínio"
            Se necessário, você pode configurar um nome de domínio para conectar ao agente do Zabbix. Para isso, altere as configurações correspondentes.
        
    5. Configure outras definições, se necessário.
    6. Certifique-se de que a opção *Habilitado* esteja marcada.
    7. Conclua o processo de criação do host clicando no botão *Adicionar*.
    
    ![Configurando um host do Zabbix][img-zabbix-hosts]
   
2. Adicione as métricas que serão monitoradas para o host do nó de filtro. Para adicionar uma única métrica, siga as seguintes etapas:
    1. Clique no nome do host criado `node.example.local` na lista de hosts na aba *Configuração → Hosts*.
    2. Uma página com os dados do host será aberta. Vá para a aba *Itens* e clique no botão *Criar item*.
    3. No campo *Nome*, insira o nome de uma métrica (por exemplo, `Ataques Wallarm NGINX`).
    4. Mantenha inalterados os parâmetros *Tipo*, *Interface do host* e *Tipo de informação*.
    5. No campo *Chave*, insira o nome da chave da métrica (como especificado em `UserParameter=` na [configuração do agente do Zabbix][doc-zabbix-parameters]; por exemplo, `wallarm_nginx-gauge-abnormal`).
    6. Se necessário, ajuste a frequência de atualização do valor da métrica e outros parâmetros. 
    7. Certifique-se de que a opção *Habilitado* esteja marcada.
    8. Conclua o processo de adição de uma métrica clicando no botão *Adicionar*.
  
    ![Adicionando uma métrica][img-zabbix-items]

3. Configure a visualização das métricas adicionadas:
    1. Clique no logotipo do Zabbix no canto superior esquerdo da interface web para acessar o painel.
    2. Clique no botão *Editar painel* para fazer alterações no painel:
        1. Adicione um widget clicando no botão *Adicionar widget*.
        2. Selecione o tipo de widget desejado (por exemplo, “Texto simples”) na lista suspensa *Tipo*.
        3. No campo *Nome*, insira qualquer nome adequado.
        4. Adicione a métrica desejada à lista *Itens* (por exemplo, o recém-criado `Ataques Wallarm NGINX`).
        5. Certifique-se de que as opções *Mostrar texto como HTML* e *Itens Dinâmicos* estejam marcadas.
        6. Conclua o assistente *Adicionar widget* clicando no botão *Adicionar*.
        
        ![Adicionando o widget com a métrica][img-zabbix-widget]
      
    3. Salve as alterações feitas no painel clicando no botão *Salvar alterações*.

4. Verifique a operação de monitoramento: 
    1. Certifique-se de que o número atual de solicitações processadas no widget do Zabbix corresponde à saída de `wallarm-status` no nó de filtro.
    
        --8<-- "../include-pt-BR/monitoring/wallarm-status-check-padded-latest.md"

        ![Vendo o valor da métrica][img-global-view-0]

    2. Execute um ataque de teste em um aplicativo protegido pelo nó de filtro. Para isso, você pode enviar uma solicitação maliciosa para o aplicativo utilizando a ferramenta `curl` ou um navegador.
        
        --8<-- "../include-pt-BR/monitoring/sample-malicious-request.md"
       
    3. Certifique-se de que o contador de solicitações aumentou tanto na saída `wallarm-status` quanto no widget do Zabbix:
    
        --8<-- "../include-pt-BR/monitoring/wallarm-status-output-padded-latest.md"

        ![Vendo o valor da métrica alterada][img-global-view-16]

O painel do Zabbix agora exibe a métrica `wallarm_nginx/gauge-abnormal` do nó de filtro `node.example.local`.