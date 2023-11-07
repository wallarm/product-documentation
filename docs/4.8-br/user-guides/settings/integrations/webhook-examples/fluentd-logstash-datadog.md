# Datadog via Fluentd/Logstash

Você pode configurar o Wallarm para enviar notificações de eventos detectados para o Datadog através do coletor de dados intermediário Fluentd ou Logstash.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Enviando notificações do Wallarm para o Datadog via coletor de dados](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Integração nativa com o Datadog"
    O Wallarm também suporta a [integração nativa com o Datadog via API do Datadog](../datadog.md). A integração nativa não requer que o coletor de dados intermediário seja utilizado.

## Recursos utilizados

* O serviço Fluentd ou Logstash disponível na URL pública
* O serviço Datadog disponível na URL pública
* Acesso de administrador ao Console Wallarm na [nuvem da UE](https://my.wallarm.com) para [configurar a integração Fluentd/Logstash](#configurando-a-integração-com-fluentd-ou-logstash)

--8<-- "../include/cloud-ip-by-request.md"

## Requisitos

Como o Wallarm envia logs para o coletor de dados intermediário via webhooks, a configuração do Fluentd ou Logstash deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Ter URL pública
* Encaminhar logs para o Datadog via o plugin `datadog_logs` do Logstash ou o plugin `fluent-plugin-datadog` do Fluentd

=== "Exemplo de configuração do Logstash"
    1. [Instale o plugin `datadog_logs`](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it) para encaminhar logs para o Datadog.
    1. Configure o Logstash para ler solicitações de entrada e encaminhar logs para o Datadog.

    Exemplo de arquivo de configuração `logstash-sample.conf`:

    ```bash linenums="1"
    input {
      http { # plugin de entrada para tráfego HTTP e HTTPS
        port => 5044 # porta para solicitações de entrada
        ssl => true # processamento de tráfego HTTPS
        ssl_certificate => "/etc/server.crt" # certificado TLS do Logstash
        ssl_key => "/etc/server.key" # chave privada para certificado TLS
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # filtro de mutação adicionando o campo fonte ao registro de log do Datadog para filtragem futura de logs do Wallarm
        }
      }
    }
    output {
      stdout {} # plugin de saída para imprimir logs do Logstash na linha de comando
      datadog_logs { # plugin de saída para encaminhar os logs do Logstash para o Datadog
          api_key => "XXXX" # chave API gerada para a organização no Datadog
          host => "http-intake.logs.datadoghq.eu" # endpoint do Datadog (depende da região de inscrição)
      }
    }
    ```

    * [Documentação sobre a estrutura do arquivo de configuração do Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [Documentação sobre o plugin `datadog_logs`](https://docs.datadoghq.com/integrations/logstash/)
=== "Exemplo de configuração do Fluentd"
    1. [Instale o plugin `fluent-plugin-datadog`](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements) para encaminhar logs para o Datadog.
    1. Configure o Fluentd para ler solicitações de entrada e encaminhar logs para o Datadog.

    Exemplo de arquivo de configuração `td-agent.conf`:

    ```bash linenums="1"
    <source>
      @type http # plugin de entrada para tráfego HTTP e HTTPS
      port 9880 # porta para solicitações de entrada
      <transport tls> # configuração para tratamento de conexões
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # plugin de saída para encaminhar logs do Fluentd para o Datadog
      @id awesome_agent
      api_key XXXX # chave API gerada para a organização no Datadog
      host 'http-intake.logs.datadoghq.eu' # endpoint do Datadog (depende da região de inscrição)
    
      # Opcional
      include_tag_key true
      tag_key 'tag'
    
      # Tags opcionais
      dd_source 'wallarm' # adicionando o campo fonte ao registro de log do Datadog para filtragem futura de logs do Wallarm
      dd_tags 'integration:fluentd'
    
      <buffer>
              @type memory
              flush_thread_count 4
              flush_interval 3s
              chunk_limit_size 5m
              chunk_limit_records 500
      </buffer>
    </match>
    ```

    * [Documentação sobre a estrutura do arquivo de configuração do Fluentd](https://docs.fluentd.org/configuration/config-file)
    * [Documentação sobre o plugin `fluent-plugin-datadog`](https://docs.datadoghq.com/integrations/fluentd)

## Configurando a integração com Fluentd ou Logstash

1. Prossiga para a configuração de integração do Datadog no Console Wallarm → **Integrações** → **Fluentd**/**Logstash**.
1. Insira o nome da integração.
1. Especifique a URL do Fluentd ou Logstash de destino (URL do Webhook).
1. Se necessário, configure as configurações avançadas:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Escolha os tipos de evento para acionar o envio de notificações para a URL especificada. Se os eventos não forem escolhidos, as notificações não serão enviadas.
1. [Teste a integração](#testando-a-integração) e certifique-se de que as configurações estão corretas.
1. Clique em **Adicionar integração**.

Exemplo de integração com o Fluentd:

![Adicionando integração com o Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## Testando a integração

--8<-- "../include/integrations/test-integration-advanced-data.md"

O log de teste no coletor de dados intermediário Fluentd ou Logstash:

```json
[
    {
        summary:"[Mensagem de teste] [Parceiro de teste (US)] Nova vulnerabilidade detectada",
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
                threat:"Média",
                type:"Info"
            }
        }
    }
]
```

O log de teste no Datadog:

![O log de teste no Datadog](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

Para encontrar os logs do Wallarm entre outros registros, você pode usar a tag de busca `source:wallarm_cloud` no serviço Datadog Logs.
