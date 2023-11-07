# Fluentd

Você pode configurar o Wallarm para enviar notificações de eventos detectados para o Fluentd, criando uma integração apropriada no Wallarm Console.

## Formato de notificação

O Wallarm envia notificações para o Fluentd via **webhooks** no formato JSON. O conjunto de objetos JSON depende do evento que o Wallarm notifica.

Exemplo de notificação de um novo hit detectado:

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
            "parameter": "ALGUM_valor",
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

## Requisitos

A configuração do Fluentd deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Ter URL pública

Exemplo de configuração Fluentd:

```bash linenums="1"
<source>
  @type http # plugin de entrada para tráfego HTTP e HTTPS
  port 9880 # porta para solicitações recebidas 
  <transport tls> # configuração para gerenciamento de conexões
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # plugin de saída para imprimir logs Fluentd na linha de comando
     output_type json # formato de logs impressos na linha de comando
  </store>
</match>
```

Você encontrará mais detalhes na [documentação oficial do Fluentd](https://docs.datadoghq.com/integrations/fluentd).

## Configuração da integração

1. Prossiga para a configuração de integração Fluentd no Console Wallarm → **Integrações** → **Fluentd**.
1. Insira o nome da integração.
1. Especifique a URL Fluentd de destino (URL do Webhook).
1. Se necessário, configure as configurações avançadas:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Escolha tipos de eventos para acionar notificações.

    ![Integração Fluentd](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato de notificação.

    Log de teste do Fluentd:

    ```json
    [
        {
            summary:"[Mensagem de teste] [Teste de parceiro(US)] Nova vulnerabilidade detectada",
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
                        Ameaça: Média

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
                    threat:"Medium",
                    type:"Info"
                }
            }
        }
    ]
    ```

1. Clique em **Adicionar integração**.

## Configuração de alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Usando o Fluentd como um coletor de dados intermediário

--8<-- "../include/integrations/webhook-examples/overview.md"

Por exemplo:

![Fluxo de Webhook](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

Para registrar eventos do Wallarm usando este esquema:

1. Configure o coletor de dados para ler os webhooks recebidos e encaminhar logs para o próximo sistema. O Wallarm envia eventos para coletores de dados via webhooks.
1. Configure um sistema SIEM para obter e ler logs do coletor de dados.
1. Configure o Wallarm para enviar logs para o coletor de dados.

    O Wallarm pode enviar logs para qualquer coletor de dados via webhooks.

    Para integrar o Wallarm com o Fluentd ou Logstash, você pode usar os cartões de integração correspondentes na interface do usuário do Wallarm Console.

    Para integrar o Wallarm com outros coletores de dados, você pode usar o [cartão de integração webhook](webhook.md) na interface do usuário do Wallarm Console.

Nós descrevemos alguns exemplos de como configurar a integração com coletores de dados populares que encaminham logs para os sistemas SIEM:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    O Wallarm também suporta a [integração nativa com o Datadog via Datadog API](datadog.md). A integração nativa não requer o uso do coletor de dados intermediário.

## Desabilitando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include/integrations/integration-not-working.md"
