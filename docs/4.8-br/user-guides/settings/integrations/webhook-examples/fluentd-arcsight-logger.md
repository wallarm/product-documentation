# Micro Focus ArcSight Logger via Fluentd

Estas instruções fornecem um exemplo de integração da Wallarm com o coletor de dados Fluentd para o encaminhamento de eventos para o sistema ArcSight Logger.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Fluxo de Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! informação "Integração com a versão Enterprise do ArcSight ESM"
    Para configurar o encaminhamento de logs do Fluentd para a versão Enterprise do ArcSight ESM, recomenda-se configurar o Syslog Connector no lado do ArcSight e, em seguida, encaminhar logs do Fluentd para a porta do conector. Para obter uma descrição mais detalhada dos conectores, baixe o **Guia do Usuário do SmartConnector** da [documentação oficial do ArcSight SmartConnector](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## Recursos utilizados

* [ArcSight Logger 7.1](#arcsight-logger-configuration) com a URL WEB `https://192.168.1.73:443` instalado no CentOS 7.8
* [Fluentd](#fluentd-configuration) instalado no Debian 11.x (bullseye) e disponível em `https://fluentd-example-domain.com`
* Acesso de administrador ao Wallarm Console no [cloud EU](https://my.wallarm.com) para [configurar a integração Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

Como os links para os serviços ArcSight Logger e Fluentd são citados como exemplos, eles não respondem.

### Configuração do ArcSight Logger

O ArcSight Logger tem o receptor de logs `Wallarm Fluentd logs` configurado da seguinte maneira:

* Logs são recebidos via UDP (`Tipo = Receptor UDP`)
* A porta de escuta é `514`
* Os eventos são analisados com o parser syslog
* Outras configurações padrão

![Configuração do receptor no ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

Para obter uma descrição mais detalhada da configuração do receptor, baixe o **Guia de Instalação do Logger** da versão adequada da [documentação oficial do ArcSight Logger](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### Configuração do Fluentd

Como a Wallarm envia logs para o coletor de dados intermediário Fluentd via webhooks, a configuração do Fluentd deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Ter URL pública
* Encaminhar logs para ArcSight Logger, este exemplo usa o plugin `remote_syslog` para encaminhar logs

Fluentd é configurado no arquivo `td-agent.conf`:

* O processamento de webhook de entrada é configurado na diretiva `source`:
     * O tráfego é enviado para a porta 9880
     * O Fluentd está configurado para aceitar apenas conexões HTTPS
     * O certificado TLS Fluentd assinado por uma CA de confiança pública está localizado no arquivo `/etc/ssl/certs/fluentd.crt`
     * A chave privada para o certificado TLS está localizada no arquivo `/etc/ssl/private/fluentd.key`
* O encaminhamento de logs para ArcSight Logger e a saída de logs são configurados na diretiva `match`:
    * Todos os logs de eventos são copiados do Fluentd e encaminhados para o ArcSight Logger no endereço IP `https://192.168.1.73:514`
    * Logs são encaminhados do Fluentd para o ArcSight Logger no formato JSON de acordo com o padrão [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * A conexão com o ArcSight Logger é estabelecida via UDP
    * Os logs Fluentd também são impressos na linha de comando no formato JSON (linhas de código 19-22). A configuração é usada para verificar que eventos são registrados via Fluentd

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
      @type remote_syslog # plugin de saída para encaminhar logs do Fluentd via Syslog
      host 192.168.1.73 # endereço IP para encaminhar logs para
      port 514 # porta para encaminhar logs para
      protocol udp # protocolo de conexão
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
    Para verificar que os logs do Fluentd são criados e encaminhados para o ArcSight Logger, a solicitação PUT ou POST pode ser enviada para o Fluentd.

    **Exemplo de solicitação:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logs do Fluentd:**
    ![Logs no Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **Evento no ArcSight Logger:**
    ![Logs no ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Configuração da integração Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Integração Webhook com Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Mais detalhes sobre a configuração da integração Fluentd](../fluentd.md)

## Testando o exemplo

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

O Fluentd registrará o evento da seguinte maneira:

![Log do Fluentd sobre o novo usuário](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

A seguinte entrada será exibida nos eventos do ArcSight Logger:

![Eventos no Logger ArcSight](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)