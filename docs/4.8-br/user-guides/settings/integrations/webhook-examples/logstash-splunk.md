[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk Enterprise via Logstash

Estas instruções fornecem a você o exemplo de integração do Wallarm com o coletor de dados Logstash para encaminhar eventos posteriores ao sistema SIEM de Splunk.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Fluxo do Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## Recursos utilizados

* [Splunk Enterprise](#splunk-enterprise-configuration) com WEB URL `https://109.111.35.11:8000` e API URL `https://109.111.35.11:8088`
* [Logstash 7.7.0](#logstash-configuration) instalado no Debian 11.x (bullseye) e disponível em `https://logstash.example.domain.com`
* Acesso de administrador ao Console Wallarm na [nuvem EU](https://my.wallarm.com) para [configurar a integração do Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

Como os links para os serviços Splunk Enterprise e Logstash são citados como exemplos, eles não respondem.

### Configuração do Splunk Enterprise

Os logs do Logstash são enviados para o Splunk HTTP Event Controller com o nome `Wallarm Logstash logs` e outras configurações padrão:

![Configuração do coletor de eventos HTTP](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

Para acessar o HTTP Event Controller, o token gerado `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb` será usado.

Uma descrição mais detalhada da configuração do Splunk HTTP Event Controller está disponível na [documentação oficial do Splunk](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### Configuração do Logstash

Como o Wallarm envia logs para o coletor de dados intermediário Logstash via webhooks, a configuração do Logstash deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Ter URL pública
* Encaminhar logs para Splunk Enterprise, este exemplo usa o plug-in `http` para encaminhar logs

O Logstash é configurado no arquivo `logstash-sample.conf`:

* O processamento de webhook de entrada é configurado na seção `input`:
    * O tráfego é enviado para a porta 5044
    * Logstash está configurado para aceitar apenas conexões HTTPS
    * O certificado TLS Logstash assinado por uma CA publicamente confiável está localizado dentro do arquivo `/etc/server.crt`
    * A chave privada para o certificado TLS está localizada dentro do arquivo `/etc/server.key`
* O encaminhamento de logs para Splunk e a saída de log são configurados na seção `output`:
    * Os logs são encaminhados do Logstash para o Splunk no formato JSON
    * Todos os logs de eventos são encaminhados do Logstash para o endpoint da API Splunk `https://109.111.35.11:8088/services/collector/raw` via solicitações POST. Para autorizar solicitações, o token HTTPS Event Collector é usado
    * Os logs Logstash são impressos adicionalmente na linha de comando (15ª linha de código). A configuração é usada para verificar que os eventos são registrados via Logstash

```bash linenums="1"
input {
  http { # plugin de entrada para tráfego HTTP e HTTPS
    port => 5044 # port for incoming requests
    ssl => true # processing of HTTPS traffic
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  http { # output plugin to forward logs from Logstash via HTTP/HTTPS protocol
    format => "json" # format of forwarded logs
    http_method => "post" # HTTP method used to forward logs
    url => "https://109.111.35.11:8088/services/collector/raw" # endpoint to forward logs to
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # HTTP headers to authorize requests
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

Uma descrição mais detalhada dos arquivos de configuração está disponível na [documentação oficial do Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "Testando a configuração do Logstash"
    Para verificar que os logs do Logstash são criados e encaminhados para Splunk, a solicitação POST pode ser enviada para o Logstash.

    **Exemplo de solicitação:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logs do Logstash:**
    ![Logs do Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Eventos Splunk:**
    ![Eventos Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Configuração da integração do Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Integração do Webhook com o Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Mais detalhes sobre a configuração da integração do Logstash](../logstash.md)

## Teste de exemplo

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash registrará o evento da seguinte forma:

![Registro sobre novo usuário no Splunk de Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

A seguinte entrada será exibida nos eventos do Splunk:

![Novo cartão de usuário no Splunk de Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## Organizando eventos em um painel

--8<-- "../include/integrations/application-for-splunk.md"