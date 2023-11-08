# Sumo Logic

Você pode configurar o Wallarm para enviar mensagens para o Sumo Logic.

## Configurar a integração

No Sumo Logic UI:

1. Configure um Coletor Hospedado seguindo as [instruções](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. Configure uma Fonte de Logs & Métricas HTTP seguindo as [instruções](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. Copie o **Endereço da Fonte HTTP (URL)** fornecido.

No Wallarm UI:

1. Abra a seção **Integrações**.
2. Clique no bloco **Sumo Logic** ou clique no botão **Adicionar integração** e escolha **Sumo Logic**.
3. Insira um nome para a integração.
4. Cole o valor copiado do Endereço da Fonte HTTP (URL) no campo **Endereço da Fonte HTTP (URL)**.
5. Escolha os tipos de eventos para disparar notificações.

    ![Integração do Sumo Logic](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include-pt-BR/integrations/advanced-events-for-integrations.md"

6. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Teste de notificação do Sumo Logic:

    ```json
    {
        summary:"[Mensagem de teste] [Parceiro de teste(EUA)] nova vulnerabilidade detectada",
        description:"Tipo de notificação: vuln

                    Uma nova vulnerabilidade foi detectada em seu sistema.

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


                    Cliente: TestCompany
                    Cloud: EUA
                    ",
        details:{
            client_name:"TestCompany",
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

7. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include-pt-BR/integrations/integrations-trigger-setup.md"

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros incorretos de integração

--8<-- "../include-pt-BR/integrations/integration-not-working.md"
