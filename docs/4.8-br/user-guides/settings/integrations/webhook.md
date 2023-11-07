# Webhook

Você pode configurar o Wallarm para enviar notificações instantâneas para qualquer sistema que aceite webhooks recebidos via protocolo HTTPS.

## Formato de notificação

As notificações são enviadas no formato JSON. O conjunto de objetos JSON depende do evento para o qual a notificação é enviada. Por exemplo:

* Hit detectado

    ```json
    [
        {
            "summary": "[Wallarm] Novo hit detectado",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "new_hits",
            "hit": {
                "domain": "www.example.com",
                "heur_distance": 0.01111,
                "method": "POST",
                "parameter": "SOME_value",
                "path": "/news/some_path",
                "payloads": [
                    "say ni"
                ],
                "point": [
                    "post"
                ],
                "probability": 0.01,
                "remote_country": "PL",
                "remote_port": 0,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": "",
                "tor": "none",
                "request_time": 1603834606,
                "create_time": 1603834608,
                "response_len": 14,
                "response_status": 200,
                "response_time": 5,
                "stamps": [
                    1111
                ],
                "regex": [],
                "stamps_hash": -22222,
                "regex_hash": -33333,
                "type": "sqli",
                "block_status": "monitored",
                "id": [
                    "hits_production_999_202010_v_1",
                    "c2dd33831a13be0d_AC9"
                ],
                "object_type": "hit",
                "anomaly": 0
                }
            }
        }
    ]
    ```
* Vulnerabilidade detectada

    ```json
    [
        {
            summary:"[Wallarm] Nova vulnerabilidade detectada",
            description:"Tipo de notificação: vuln

                        Uma nova vulnerabilidade foi detectada em seu sistema.

                        ID: 
                        Título: Teste
                        Domínio: example.com
                        Caminho: 
                        Método: 
                        Descoberto por: 
                        Parâmetro: 
                        Tipo: Info
                        Ameaça: Médio

                        Mais detalhes: https://us1.my.wallarm.com/object/555


                        Cliente: TestCompany
                        Nuvem: US
                        ",
            details:{
                client_name:"TestCompany",
                cloud:"US",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"example.com",
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
    ]
    ```

## Configurando a integração

1. Abra a interface do usuário Wallarm → **Integrações**.
1. Clique no bloco **Webhook** ou clique no botão **Adicionar integração** e escolha **Webhook**.
1. Insira um nome para a integração.
1. Insira a URL do Webhook destinatário.
1. Se necessário, configure as configurações avançadas:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![Exemplo de configurações avançadas](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. Escolha os tipos de eventos para acionar notificações.

    ![Integração de Webhook](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Exemplo de webhook de teste:

    ```json
    [
        {
            summary:"[Mensagem de teste] [Teste de parceiro (US)] Nova vulnerabilidade detectada",
            description:"Tipo de notificação: vuln

                        Uma nova vulnerabilidade foi detectada em seu sistema.

                        ID: 
                        Título: Teste
                        Domínio: example.com
                        Caminho: 
                        Método: 
                        Descoberto por: 
                        Parâmetro: 
                        Tipo: Info
                        Ameaça: Médio

                        Mais detalhes: https://us1.my.wallarm.com/object/555


                        Cliente: TestCompany
                        Nuvem: US
                        ",
            details:{
                client_name:"TestCompany",
                cloud:"US",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"example.com",
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
    ]
    ```

1. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Desativando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include/integrations/integration-not-working.md"