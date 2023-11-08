# Micro Focus ArcSight Logger via Logstash

Estas instruções fornecem a você um exemplo de integração do Wallarm com o coletor de dados Logstash para encaminhamento adicional dos eventos para o sistema ArcSight Logger.

--8<-- "../include-pt-BR/integrations/webhook-examples/overview.md"

![Fluxo de Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "Integração com a versão corporativa do ArcSight ESM"
    Para configurar o encaminhamento de logs do Logstash para a versão corporativa do ArcSight ESM, é recomendado configurar o Syslog Connector no lado do ArcSight e, depois, encaminhar os logs do Logstash para a porta do conector. Para obter uma descrição mais detalhada dos conectores, faça o download do **Guia do usuário do SmartConnector** na [documentação oficial do ArcSight SmartConnector](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## Recursos usados

* [ArcSight Logger 7.1](#arcsight-logger-configuration) com a URL WEB `https://192.168.1.73:443` instalada no CentOS 7.8
* [Logstash 7.7.0](#logstash-configuration) instalado no Debian 11.x (bullseye) e disponível em `https://logstash.example.domain.com`
* Acesso de administrador ao Wallarm Console em [nuvem da UE](https://my.wallarm.com) para [configurar a integração do Logstash](#configuration-of-logstash-integration)

--8<-- "../include-pt-BR/cloud-ip-by-request.md"

Como os links para os serviços ArcSight Logger e Logstash são citados como exemplos, eles não respondem.

### Configuração do ArcSight Logger

ArcSight Logger tem um receptor de logs `Wallarm Logstash logs` configurado da seguinte forma:

* Logs são recebidos via UDP (`Type = UDP Receiver`)
* A porta de escuta é `514`
* Os eventos são analisados com o analisador de syslog
* Outras configurações padrão

![Configuração do receptor no ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

Para obter uma descrição mais detalhada da configuração do receptor, faça o download do **Guia de instalação do Logger** da versão apropriada na [documentação oficial do ArcSight Logger](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### Configuração do Logstash

Como o Wallarm envia logs para o coletor de dados intermediário Logstash via webhooks, a configuração do Logstash deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Ter URL pública
* Encaminha logs para ArcSight Logger, este exemplo usa o plugin `syslog` para encaminhar logs

Logstash está configurado no arquivo `logstash-sample.conf`:

* O processamento de webhook de entrada é configurado na seção `input`:
    * O tráfego é enviado para a porta 5044
    * Logstash está configurado para aceitar apenas conexões HTTPS
    * O certificado TLS Logstash assinado por uma CA de confiança pública está localizado no arquivo `/etc/server.crt`
    * A chave privada para o certificado TLS está localizada no arquivo `/etc/server.key`
* O encaminhamento de logs para o ArcSight Logger e a saída de log são configurados na seção `output`:
    * Todos os logs de eventos são encaminhados do Logstash para o ArcSight Logger no endereço IP `https://192.168.1.73:514`
    * Os logs são encaminhados do Logstash para o ArcSight Logger no formato JSON de acordo com o padrão [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * A conexão com o ArcSight Logger é estabelecida via UDP
    * Logs do Logstash também são impressos na linha de comando (linha de código 15). A configuração é usada para verificar se os eventos estão sendo registrados via Logstash

```bash linenums="1"
input {
  http { # input plugin for HTTP and HTTPS traffic
    port => 5044 # port for incoming requests
    ssl => true # HTTPS traffic processing
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  syslog { # output plugin to forward logs from Logstash via Syslog
    host => "192.168.1.73" # IP address to forward logs to
    port => "514" # port to forward logs to
    protocol => "udp" # connection protocol
    codec => json # format of forwarded logs
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

Uma descrição mais detalhada dos arquivos de configuração está disponível na [documentação oficial do Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "Testando a configuração do Logstash"
    Para verificar que os logs do Logstash são criados e encaminhados para o ArcSight Logger, pode-se enviar uma solicitação POST para o Logstash.

    **Exemplo de solicitação:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logs do Logstash:**
    ![Logs do Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **Evento no ArcSight Logger:**
    ![Evento no ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Configuração da integração Logstash

--8<-- "../include-pt-BR/integrations/webhook-examples/create-logstash-webhook.md"

![Integração de webhook com Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Mais detalhes sobre a configuração de integração do Logstash](../logstash.md)

## Teste do exemplo

--8<-- "../include-pt-BR/integrations/webhook-examples/send-test-webhook.md"

Logstash registrará o evento da seguinte forma:

![Novo registro de usuário no ArcSight Logger do Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

A seguinte entrada será exibida nos eventos ArcSight Logger:

![Cartão de novo usuário no ArcSight Logger do Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)
