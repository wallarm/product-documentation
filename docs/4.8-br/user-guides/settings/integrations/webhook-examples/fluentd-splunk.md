[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk Enterprise via Fluentd

Estas instruções fornecem a você um exemplo de integração do Wallarm com o coletor de dados Fluentd para encaminhar eventos adicionais para o sistema SIEM Splunk.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Fluxo do Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## Recursos Utilizados

* [Splunk Enterprise](#splunk-enterprise-configuration) com URL WEB `https://109.111.35.11:8000` e URL API `https://109.111.35.11:8088`
* [Fluentd](#fluentd-configuration) instalado no Debian 11.x (bullseye) e disponível em `https://fluentd-example-domain.com`
* Acesso de administrador ao Console Wallarm na [nuvem da UE](https://my.wallarm.com) para [configurar a integração Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

Como os links para os serviços Splunk Enterprise e Fluentd são citados como exemplos, eles não respondem.

### Configuração do Splunk Enterprise

Os registros do Fluentd são enviados para o Controlador de Eventos HTTP do Splunk com o nome `Registros do Fluentd do Wallarm` e outras configurações padrão:

![Configuração do Controlador de Eventos HTTP](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

Para acessar o Controlador de Eventos HTTP, o token gerado `f44b3179-91aa-44f5-a6f7-202265e10475` será usado.

Uma descrição mais detalhada da configuração do Controlador de Eventos HTTP do Splunk está disponível na [documentação oficial do Splunk](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### Configuração do Fluentd

Como o Wallarm envia logs para o coletor de dados intermediário Fluentd via webhooks, a configuração do Fluentd deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Ter URL pública
* Encaminhar logs para o Splunk Enterprise, este exemplo usa o plugin `splunk_hec` para encaminhar logs

O Fluentd é configurado no arquivo `td-agent.conf`:

* O processamento do webhook de entrada é configurado na diretiva `source`:
    * O tráfego é enviado para a porta 9880
    * O Fluentd é configurado para aceitar apenas conexões HTTPS
    * O certificado TLS do Fluentd assinado por uma CA confiável publicamente está localizado dentro do arquivo `/etc/ssl/certs/fluentd.crt`
    * A chave privada para o certificado TLS está localizada dentro do arquivo `/etc/ssl/private/fluentd.key`
* O encaminhamento de logs para o Splunk e a saída de log são configurados na diretiva `match`:
    * Todos os logs de eventos são copiados do Fluentd e encaminhados para o Controlador de Eventos HTTP do Splunk por meio do plugin de saída [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)
    * Os logs do Fluentd também são impressos na linha de comando no formato JSON (linhas de código 19-22). Essa configuração é usada para verificar que os eventos são registrados via Fluentd

```bash linenums="1"
<source>
  @type http # plugin de entrada para tráfego HTTP e HTTPS
  port 9880 # porta para solicitações de entrada
  <transport tls> # configuração para manipulação de conexões
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # plugin de saída fluent-plugin-splunk-hec para encaminhar logs para a API do Splunk via Controlador de Eventos HTTP
      hec_host 109.111.35.11 # host do Splunk
      hec_port 8088 # porta da API do Splunk
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # token do Controlador de Eventos HTTP
    <format>
      @type json # formato dos logs encaminhados
    </format>
  </store>
  <store>
     @type stdout # plugin de saída para imprimir logs do Fluentd na linha de comando
     output_type json # formato dos logs impressos na linha de comando
  </store>
</match>
```

Uma descrição mais detalhada dos arquivos de configuração está disponível na [documentação oficial do Fluentd](https://docs.fluentd.org/configuration/config-file).

!!! info "Testando a configuração do Fluentd"
    Para verificar se os logs do Fluentd estão sendo criados e encaminhados para o Splunk, pode-se enviar uma solicitação PUT ou POST ao Fluentd.

    **Exemplo de solicitação:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logs do Fluentd:**
    ![Logs no Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Logs do Splunk:**
    ![Logs no Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Configuração da integração Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Integração de webhook com Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Mais detalhes sobre a configuração da integração Fluentd](../fluentd.md)

## Teste do exemplo

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

O Fluentd registrará o evento da seguinte forma:

![Log sobre novo usuário no Splunk através do Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

A seguinte entrada será exibida nos eventos Splunk:

![Cartão do novo usuário no Splunk a partir do Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Recebendo eventos no Splunk Enterprise organizados em um painel

--8<-- "../include/integrations/application-for-splunk.md"
