# Splunk Enterprise via Fluentd

## Example overview

--8<-- "../include/integrations/webhook-examples/overview.md"

In the provided example, events are sent via webhooks to the Fluentd log collector and forwarded to the Splunk SIEM system.

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## Used resources

* [Splunk Enterprise](#splunk-enterprise-configuration) with WEB URL `https://109.111.35.11:8000` and API URL `https://109.111.35.11:8088`
* [Fluentd](#fluentd-configuration) installed on Debian 10.4 (Buster) and available on `https://fluentd‑example‑domain.com`
* Administrator access to Wallarm Console in [EU cloud](https://my.wallarm.com) to [configure the webhook integration](#configuration-of-webhook-integration)

### Splunk Enterprise configuration

Fluentd logs are sent to Splunk HTTP Event Controller with the name `Wallarm Fluentd logs` and other default settings:

![!HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

To access the HTTP Event Controller, the generated token `f44b3179-91aa-44f5-a6f7-202265e10475` will be used.

A more detailed description of Splunk HTTP Event Controller setup is available in the [official Splunk documentation](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### Fluentd configuration

Fluentd is configured in the `td-agent.conf` file:

* Incoming webhook processing is configured in the `source` directive:
    * All HTTP and HTTPS traffic is sent to 9880 Fluentd port
    * TLS certificate for HTTPS connection is located within the file `/etc/pki/ca.pem`
* Forwarding logs to Splunk and log output are configured in the `match` directive:
    * All event logs are copied from Fluentd and forwarded to Splunk HTTP Event Controller via the output plugin [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)
    * Fluentd logs are additionally printed on the command line in JSON format (19-22 code lines). The setting is used to verify that events are logged via Fluentd

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # certificates for HTTPS connection
    ca_path /etc/pki/ca.pem
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # output plugin fluent-plugin-splunk-hec to forward logs to Splunk API via HTTP Event Controller
      hec_host 109.111.35.11 # Splunk host
      hec_port 8088 # Splunk API port
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controller token
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
    To check that Fluentd logs are created and forwarded to Splunk, the PUT or POST request can be sent to Fluentd.

    **Request example:**
    ```curl
    curl -X POST 'https://fluentd‑example‑domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd logs:**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunk logs:**
    ![!Logs in Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Configuration of webhook integration

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/add-webhook-integration.png)

## Example testing

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd will log the event as follows:

![!Log about new user in Splunk from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

The following entry will be displayed in Splunk events:

![!New user card in Splunk from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)
