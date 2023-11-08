# IBM QRadar via Fluentd

Estas instruções fornecem a você o exemplo de integração do Wallarm com o coletor de dados Fluentd para encaminhar eventos para o sistema SIEM do QRadar.

--8<-- "../include-pt-BR/integrations/webhook-examples/overview.md"

![Fluxo de Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## Recursos utilizados

* [Fluentd](#fluentd-configuration) instalado no Debian 11.x (bullseye) e disponível em `https://fluentd-example-domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) instalado no Linux Red Hat e disponível com o endereço IP `https://109.111.35.11:514`
* Acesso administrativo ao Console Wallarm na [nuvem UE](https://my.wallarm.com) para [configurar a integração Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include-pt-BR/cloud-ip-by-request.md"

Uma vez que os links para os serviços Fluentd e QRadar são citados como exemplos, eles não respondem.

### Configuração do Fluentd

Como o Wallarm envia logs para o coletor de dados intermediário Fluentd via webhooks, a configuração do Fluentd deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceite solicitações HTTPS
* Ter URL pública
* Encaminhar logs para o IBM Qradar, este exemplo usa o plugin `remote_syslog` para encaminhar logs

O Fluentd é configurado no arquivo `td-agent.conf`:

* O processamento do webhook recebido é configurado na diretiva `source`:
    * O tráfego é enviado para a porta 9880
    * O Fluentd está configurado para aceitar apenas conexões HTTPS
    * O certificado TLS do Fluentd assinado por uma CA publicamente confiável está localizado dentro do arquivo `/etc/ssl/certs/fluentd.crt`
    * A chave privada para o certificado TLS está localizada dentro do arquivo `/etc/ssl/private/fluentd.key`
* O encaminhamento de logs para o QRadar e a saída de log estão configurados na diretiva `match`:
    * Todos os logs de eventos são copiados do Fluentd e encaminhados para o QRadar no endereço IP `https://109.111.35.11:514`
    * Logs são encaminhados do Fluentd para o QRadar no formato JSON de acordo com o padrão [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * A conexão com o QRadar é estabelecida via TCP
    * Os logs do Fluentd também são impressos na linha de comando no formato JSON (linhas de código 19-22). A configuração é usada para verificar que os eventos são registrados via Fluentd

```bash linenums="1"
<source>
  @type http # plugin de entrada para tráfego HTTP e HTTPS
  port 9880 # porta para solicitações recebidas
  <transport tls> # configuração para manipulação de conexões
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # plugin de saída para encaminhar logs do Fluentd via Syslog
      host 109.111.35.11 # endereço IP para encaminhar logs para
      port 514 # porta para encaminhar logs para
      protocol tcp # protocolo de conexão
    <format>
      @type json # formato de logs encaminhados
    </format>
  </store>
  <store>
     @type stdout # plugin de saída para imprimir logs do Fluentd na linha de comando
     output_type json # formato de logs impressos na linha de comando
  </store>
</match>
```

Uma descrição mais detalhada dos arquivos de configuração está disponível na [documentação oficial do Fluentd](https://docs.fluentd.org/configuration/config-file).

!!! info "Testando a configuração Fluentd"
    Para verificar que os logs Fluentd estão sendo criados e encaminhados para o QRadar, a solicitação PUT ou POST pode ser enviada para o Fluentd.

    **Exemplo de solicitação:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logs do Fluentd:**
    ![Logs no Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **Logs do QRadar:**
    ![Logs no QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **Carga de log do QRadar:**
    ![Logs no QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### Configuração do QRadar (opcional)

No QRadar, a origem do log é configurada. Isso ajuda a encontrar facilmente os logs Fluentd na lista de todos os logs no QRadar e também pode ser usado para filtrar mais logs. A origem do log é configurada da seguinte forma:

* **Nome da fonte de log**: `Fluentd`
* **Descrição da fonte de log**: `Logs do Fluentd`
* **Tipo de fonte de log**: tipo de analisador de logs recebidos usados com o padrão Syslog `Universal LEEF`
* **Configuração do protocolo**: padrão de encaminhamento de logs `Syslog`
* **Identificador da fonte de log**: Endereço IP do Fluentd
* Outras configurações padrão

Uma descrição mais detalhada da configuração da origem do log do QRadar está disponível na [documentação oficial da IBM](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![Configuração da origem do log do QRadar para Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Configuração da integração Fluentd

--8<-- "../include-pt-BR/integrations/webhook-examples/create-fluentd-webhook.md"

![Integração de Webhook com Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Mais detalhes sobre a configuração da integração Fluentd](../fluentd.md)

## Teste de exemplo

--8<-- "../include-pt-BR/integrations/webhook-examples/send-test-webhook.md"

O Fluentd registrará o evento da seguinte forma:

![Log sobre novo usuário no QRadar do Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

Os seguintes dados no formato JSON serão exibidos no payload de log do QRadar:

![Novo cartão de usuário no QRadar do Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)