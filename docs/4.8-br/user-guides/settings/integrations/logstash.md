# Logstash

Você pode configurar o Wallarm para enviar notificações de eventos detectados para o Logstash.

## Formato de notificação

O Wallarm envia notificações para o Logstash via **webhooks** no formato JSON. O conjunto de objetos JSON depende do evento sobre o qual Wallarm está notificando.

Exemplo da notificação de um novo hit detectado:

```json
[
    {
        "summary": "[Wallarm] Novo hit detectado",
        "details": {
        "client_name": "TestCompany",
        "cloud": "UE",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.exemplo.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "ALGUM_valor",
            "path": "/news/some_path",
            "payloads": [
                "diga ni"
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

## Requisitos

A configuração do Logstash deve atender aos seguintes requisitos:

* Aceitar solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Possuir URL pública

Exemplo de confiração do Logstash:

```bash linenums="1"
input {
  http { # plugin de entrada para tráfego HTTP e HTTPS
    port => 5044 # porta para solicitações de entrada
    ssl => true # processamento de tráfego HTTPS
    ssl_certificate => "/etc/server.crt" # certificado TLS do Logstash
    ssl_key => "/etc/server.key" # chave privada para o certificado TLS
  }
}
output {
  stdout {} # plugin de saída para imprimir logs do Logstash na linha de comando
  ...
}
```

Você pode encontrar mais detalhes na [documentação oficial do Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

## Configurando a integração

1. Prossiga para a configuração da integração do Logstash no Console Wallarm → **Integrações** → **Logstash**.
1. Insira o nome da integração.
1. Especifique a URL do Logstash de destino (URL do webhook).
1. Se necessário, configure as configurações avançadas:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Escolha tipos de eventos para disparar notificações.

    ![Integração Logstash](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    Detalhes sobre os eventos disponíveis:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Cloud Wallarm e o formato da notificação.

    O log de teste do Logstash:

    ```json
    [
        {
            summary:"[Mensagem de teste] [Parceiro de teste (EUA)] Nova vulnerabilidade detectada",
            description:"Tipo de notificação: vuln

                        Uma nova vulnerabilidade foi detectada no seu sistema.

                        ID: 
                        Título: Teste
                        Domínio: exemplo.com
                        Caminho: 
                        Método: 
                        Descoberta por: 
                        Parâmetro: 
                        Tipo: Info
                        Ameaça: Média

                        Mais detalhes: https://us1.my.wallarm.com/object/555


                        Cliente: TestCompany
                        Nuvem: EUA
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
                    threat:"Média",
                    type:"Info"
                }
            }
        }
    ]
    ```

1. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Usando Logstash como coletor intermediário de dados

--8<-- "../include/integrations/webhook-examples/overview.md"

Por exemplo:

![Fluxo do Webhook](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

Para registrar eventos do Wallarm usando este esquema:

1. Configure o coletor de dados para ler os webhooks de entrada e encaminhar os logs para o próximo sistema. Wallarm envia eventos aos coletores de dados via webhooks.
1. Configure um sistema SIEM para obter e ler logs do coletor de dados.
1. Configure o Wallarm para enviar logs para o coletor de dados.

    Wallarm pode enviar logs a qualquer coletor de dados via webhooks.

    Para integrar o Wallarm com Fluentd ou Logstash, você pode utilizar os respectivos cartões de integração na interface de usuário do Console Wallarm.

    Para integrar Wallarm com outros coletores de dados, você pode utilizar o [cartão de integração de webhook](webhook.md) na interface de usuário do Console Wallarm.

Descrevemos alguns exemplos de como configurar a integração com os coletores de dados populares que encaminham logs para os sistemas SIEM:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm também suporta a [integração nativa com Datadog via API Datadog](datadog.md). A integração nativa não requer o uso do coletor de dados intermediário.

## Desativando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"
