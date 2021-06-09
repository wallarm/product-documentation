# IBM QRadar via Logstash

## Example overview

--8<-- "../include/integrations/webhook-examples/overview.md"

In the provided example, events are sent via webhooks to the Logstash log collector and forwarded to the QRadar SIEM system.

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## Used resources

* [Logstash 7.7.0](#logstash-configuration) installed on Debian 10.4 (Buster) and available on `https://logstash.example.domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) installed on Linux Red Hat and available with the IP address `https://109.111.35.11:514`
* Administrator access to Wallarm Console in [EU cloud](https://my.wallarm.com) to [configure the webhook integration](#configuration-of-webhook-integration)

Since the links to the Logstash and QRadar services are cited as examples, they do not respond.

### Logstash configuration

Logstash is configured in the `logstash-sample.conf` file:

* Incoming webhook processing is configured in the `input` section:
    * Traffic is sent to port 5044
    * Logstash is configured to accept only HTTPS connections
    * Logstash TLS certificate signed by a publicly trusted CA is located within the file `/etc/server.crt`
    * Private key for TLS certificate is located within the file `/etc/server.key`
* Forwarding logs to QRadar and log output are configured in the `output` section:
    * All event logs are forwarded from Logstash to QRadar at the IP address `https://109.111.35.11:514`
    * Logs are forwarded from Logstash to QRadar in the JSON format according to the [Syslog](https://en.wikipedia.org/wiki/Syslog) standard
    * Connection with QRadar is established via TCP
    * Logstash logs are additionally printed on the command line (15th code line). The setting is used to verify that events are logged via Logstash

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
    host => "109.111.35.11" # IP address to forward logs to
    port => "514" # port to forward logs to
    protocol => "tcp" # connection protocol
    codec => json # format of forwarded logs
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

A more detailed description of the configuration files is available in the [official Logstash documentation](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "Testing Logstash configuration"
    To check that Logstash logs are created and forwarded to QRadar, the POST request can be sent to Logstash.

    **Request example:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash logs:**
    ![!Logs in Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadar logs:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadar log payload:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadar configuration (optional)

In QRadar, the log source is configured. It helps to easily find Logstash logs in the list of all logs in QRadar, and can also be used for further log filtering. The log source is configured as follows:

* **Log Source Name**: `Logstash`
* **Log Source Description**: `Logs from Logstash`
* **Log Source Type**: type of incoming logs parser used with Syslog standard `Universal LEEF`
* **Protocol Configuration**: standard of logs forwarding `Syslog`
* **Log Source Identifier**: Logstash IP address
* Other default settings

A more detailed description of the QRadar log source setup is available in the [official IBM documentation](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![!QRadar log source setup for Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Configuration of webhook integration

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![!Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/add-webhook-integration.png)

## Example testing

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash will log the event as follows:

![!Log about new user in QRadar from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

The following data in JSON format will be displayed in the QRadar log payload:

![!New user card in QRadar from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)
