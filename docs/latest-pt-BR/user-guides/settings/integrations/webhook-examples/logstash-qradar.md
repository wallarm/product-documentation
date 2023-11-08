Mantenha o mesmo tom de polidez na tradução e garanta que o arquivo resultante tenha exatamente as mesmas URLs do arquivo original:
../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png
#logstash-configuration
#qradar-configuration-optional
https://my.wallarm.com
#configuration-of-logstash-integration
https://en.wikipedia.org/wiki/Syslog
https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html
https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf
../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png
../../../../images/user-guides/settings/integrations/add-logstash-integration.png
../logstash.md
../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png
../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png

Tradução do artigo de documentação do Wallarm.com do inglês para o português do Brasil:

# IBM QRadar via Logstash

Estas instruções fornecem a você um exemplo de integração do Wallarm com o coletor de dados Logstash para encaminhar eventos para o sistema SIEM QRadar.

--8<-- "../include-pt-BR/integrations/webhook-examples/overview.md"

![Fluxo do Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## Recursos utilizados

* [Logstash 7.7.0](#logstash-configuration) instalado no Debian 11.x (bullseye) e disponível em `https://logstash.example.domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) instalado no Linux Red Hat e disponível com o endereço IP `https://109.111.35.11:514`
* Acesso de administrador ao Console Wallarm na [nuvem da EU](https://my.wallarm.com) para [configurar a integração do Logstash](#configuration-of-logstash-integration)

--8<-- "../include-pt-BR/cloud-ip-by-request.md"

Como os links para os serviços Logstash e QRadar são citados como exemplos, eles não respondem.

### Configuração do Logstash

Como o Wallarm envia logs para o coletor de dados intermediário Logstash via webhooks, a configuração do Logstash deve atender aos seguintes requisitos:

* Aceitar as solicitações POST ou PUT
* Aceitar solicitações HTTPS
* Possuir URL pública
* Encaminhar logs para IBM Qradar, este exemplo utiliza o plugin `syslog` para encaminhar logs

O Logstash é configurado no arquivo `logstash-sample.conf`:

* O processamento do webhook de entrada é configurado na seção `input`:
    * O tráfego é enviado para a porta 5044
    * Logstash é configurado para aceitar apenas conexões HTTPS
    * Certificado TLS do Logstash assinado por uma CA de confiança pública está localizado no arquivo `/etc/server.crt`
    * A chave privada para o certificado TLS está localizada no arquivo `/etc/server.key`
* O encaminhamento de logs para o QRadar e a saída de log são configurados na seção `output`:
    * Todos os logs de eventos são encaminhados do Logstash para o QRadar no endereço IP `https://109.111.35.11:514`
    * Os logs são encaminhados do Logstash para o QRadar no formato JSON de acordo com o padrão [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * A conexão com o QRadar é estabelecida via TCP
    * Os logs do Logstash são impressos adicionalmente na linha de comando (15ª linha de código). A configuração é usada para verificar que os eventos são registrados via Logstash

```bash linenums="1"
input {
  http { # plugin de entrada para tráfego HTTP e HTTPS
    port => 5044 # porta para solicitações de entrada
    ssl => true # processamento de tráfego HTTPS
    ssl_certificate => "/etc/server.crt" # Certificado TLS do Logstash
    ssl_key => "/etc/server.key" # chave privada para o certificado TLS
  }
}
output {
  syslog { # plugin de saída para encaminhar logs do Logstash via Syslog
    host => "109.111.35.11" # Endereço IP para encaminhar logs para
    port => "514" # porta para encaminhar logs para
    protocol => "tcp" # protocolo de conexão
    codec => json # formato dos logs encaminhados
  }
  stdout {} # plugin de saída para imprimir logs do Logstash na linha de comando
}
```

Uma descrição mais detalhada dos arquivos de configuração está disponível na [documentação oficial do Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "Testando a configuração do Logstash"
    Para verificar se os logs do Logstash são criados e encaminhados para o QRadar, a solicitação POST pode ser enviada para o Logstash.

    **Exemplo de solicitação:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logs do Logstash:**
    ![Logs no Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **Logs no QRadar:**
    ![Logs no QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **Carga útil do log do QRadar:**
    ![Carga útil do log no QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### Configuração do QRadar (opcional)

No QRadar, a fonte de log é configurada. Isso ajuda a encontrar facilmente os logs do Logstash na lista de todos os logs no QRadar, e também pode ser usado para filtrar logs adicionais. A fonte de log é configurada da seguinte maneira:

* **Nome da fonte de log**: `Logstash`
* **Descrição da fonte de log**: `Logs do Logstash`
* **Tipo de fonte de log**: tipo de analisador de logs de entrada usado com o padrão Syslog `Universal LEEF`
* **Configuração de protocolo**: padrão de encaminhamento de logs `Syslog`
* **Identificador de fonte de log**: endereço IP do Logstash
* Outras configurações padrão

Uma descrição mais detalhada da configuração da fonte de log do QRadar está disponível na [documentação oficial da IBM](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![Configuração da fonte de log do QRadar para o Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Configuração da integração do Logstash

--8<-- "../include-pt-BR/integrations/webhook-examples/create-logstash-webhook.md"

![Integração de webhook com o Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Mais detalhes sobre a configuração da integração do Logstash](../logstash.md)

## Exemplo de teste

--8<-- "../include-pt-BR/integrations/webhook-examples/send-test-webhook.md"

O Logstash registrará o evento da seguinte maneira:

![Log sobre novo usuário no QRadar a partir do Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

Os seguintes dados no formato JSON serão exibidos na carga útil do log do QRadar:

![Cartão de novo usuário no QRadar a partir do Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)