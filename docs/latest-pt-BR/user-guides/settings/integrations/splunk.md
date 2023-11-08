[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

Você pode configurar o Wallarm para enviar alertas para o Splunk.

##  Configurando a integração

Na interface do usuário do Splunk:

1. Abra **Configurações** ➝ **Adicionar Dados** ➝ **Monitorar**.
2. Selecione a opção **HTTP Event Collector**, insira um nome para a integração e clique em **Próximo**.
3. Pule a escolha do tipo de dados na página de **Configurações de entrada** e continue em **Rever Configurações**.
4. Revise e **Envie** as configurações.
5. Copie o token fornecido.

Na interface do usuário do Wallarm:

1. Abra a seção **Integrações**.
1. Clique no bloco **Splunk** ou clique no botão **Adicionar integração** e escolha **Splunk**.
1. Insira um nome para a integração.
1. Cole o token copiado no campo **Token HEC**.
1. Cole o URI do HEC e o número da porta de sua instância Splunk no campo **HEC URI:PORT**. Por exemplo: `https://hec.splunk.com:8088`.
1. Selecione os tipos de eventos para acionar notificações.

    ![Integração Splunk](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include-pt-BR/integrations/advanced-events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade da Cloud Wallarm e o formato de notificação.

    Teste de notificação Splunk no formato JSON:

    ```json
    {
        summary:"[Mensagem de teste] [Parceiro de teste(EUA)] Nova vulnerabilidade detectada",
        description:"Tipo de notificação: vuln

                    Uma nova vulnerabilidade foi detectada no seu sistema.

                    ID: 
                    Título: Teste
                    Domínio: exemplo.com
                    Caminho: 
                    Método: 
                    Descoberto por: 
                    Parâmetro: 
                    Tipo: Info
                    Ameaça: Médio

                    Mais detalhes: https://us1.my.wallarm.com/object/555


                    Cliente: TesteEmpresa
                    Nuvem: EUA
                    ",
        details:{
            client_name:"TesteEmpresa",
            cloud:"EUA",
            notification_type:"vuln",
            vuln_link:"https://us1.my.wallarm.com/object/555",
            vuln:{
                domain:"exemplo.com",
                id:null,
                method:null,
                parameter:null,
                path:null,
                title:"Teste",
                discovered_by:null,
                threat:"Médio",
                type:"Info"
            }
        }
    }
    ```

1. Clique em **Adicionar integração**.

--8<-- "../include-pt-BR/cloud-ip-by-request.md"

## Organizando eventos em um painel

--8<-- "../include-pt-BR/integrations/application-for-splunk.md"


## Configurando alertas adicionais

--8<-- "../include-pt-BR/integrations/integrations-trigger-setup.md"

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include-pt-BR/integrations/integration-not-working.md"
