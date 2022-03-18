# IBM QRadar via Fluentd

## Example overview

--8<-- "../include/integrations/webhook-examples/overview.md"

In the provided example, events are sent via webhooks to the Fluentd log collector and forwarded to the QRadar SIEM system.

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## Used resources

* [Fluentd](#fluentd-configuration) installed on Debian 10.4 (Buster) and available on `https://fluentd-example-domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) installed on Linux Red Hat and available with the IP address `https://109.111.35.11:514`
* Administrator access to Wallarm Console in [EU cloud](https://my.wallarm.com) to [configure the webhook integration](#configuration-of-webhook-integration)

--8<-- "../include/cloud-ip-by-request.md"

Since the links to the Fluentd and QRadar services are cited as examples, they do not respond.

### Fluentd configuration

Fluentd is configured in the `td-agent.conf` file:

* Incoming webhook processing is configured in the `source` directive:
    * Traffic is sent to port 9880
    * Fluentd is configured to accept only HTTPS connections
    * Fluentd TLS certificate signed by a publicly trusted CA is located within the file `/etc/ssl/certs/fluentd.crt`
    * Private key for TLS certificate is located within the file `/etc/ssl/private/fluentd.key`
* Forwarding logs to QRadar and log output are configured in the `match` directive:
    * All event logs are copied from Fluentd and forwarded to QRadar at the IP address `https://109.111.35.11:514`
    * Logs are forwarded from Fluentd to QRadar in the JSON format according to the [Syslog](https://en.wikipedia.org/wiki/Syslog) standard
    * Connection with QRadar is established via TCP
    * Fluentd logs are additionally printed on the command line in JSON format (19-22 code lines). The setting is used to verify that events are logged via Fluentd

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # output plugin to forward logs from Fluentd via Syslog
      host 109.111.35.11 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol tcp # connection protocol
    <format>
      @type json # format of forwarded logs
    </format>
  </store>
  <store>
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

A more detailed description of configuration files is available in the [official Fluentd documentation](https://docs.fluentd.org/configuration/config-file).

!!! info "Testing Fluentd configuration"
    To check that Fluentd logs are created and forwarded to QRadar, the PUT or POST request can be sent to Fluentd.

    **Request example:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd logs:**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadar logs:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadar log payload:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadar configuration (optional)

In QRadar, the log source is configured. It helps to easily find Fluentd logs in the list of all logs in QRadar, and can also be used for further log filtering. The log source is configured as follows:

* **Log Source Name**: `Fluentd`
* **Log Source Description**: `Logs from Fluentd`
* **Log Source Type**: type of incoming logs parser used with Syslog standard `Universal LEEF`
* **Protocol Configuration**: standard of logs forwarding `Syslog`
* **Log Source Identifier**: Fluentd IP address
* Other default settings

A more detailed description of QRadar log source setup is available in the [official IBM documentation](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![!QRadar log source setup for Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Configuration of webhook integration

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/add-webhook-integration.png)

## Example testing

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd will log the event as follows:

![!Log about new user in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

The following data in JSON format will be displayed in the QRadar log payload:

![!New user card in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)
