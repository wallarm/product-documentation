# Splunk Enterprise via Logstash

## Example overview

--8<-- "../include/integrations/webhook-examples/overview.md"

In the provided example, events are sent via webhooks to the Logstash log collector and forwarded to the Splunk SIEM system.

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## Used resources

* [Splunk Enterprise](#splunk-enterprise-configuration) with WEB URL `https://109.111.35.11:8000` and API URL `https://109.111.35.11:8088`
* [Logstash 7.7.0](#logstash-configuration) installed on Debian 10.4 (Buster) and available on `https://logstash.example.domain.com`
* Administrator access to Wallarm Console in [EU cloud](https://my.wallarm.com) to [configure the webhook integration](#configuration-of-webhook-integration)

Since the links to the Splunk Enterprise and Logstash services are cited as examples, they do not respond.

### Splunk Enterprise configuration

Logstash logs are sent to Splunk HTTP Event Controller with the name `Wallarm Logstash logs` and other default settings:

![!HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

To access the HTTP Event Controller, generated token `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb` will be used.

A more detailed description of Splunk HTTP Event Controller setup is available in the [official Splunk documentation](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### Logstash configuration

Logstash is configured in the `logstash-sample.conf` file:

* Incoming webhook processing is configured in the `input` section:
    * Traffic is sent to port 5044
    * Logstash is configured to accept only HTTPS connections
    * Logstash TLS certificate signed by a publicly trusted CA is located within the file `/etc/server.crt`
    * Private key for TLS certificate is located within the file `/etc/server.key`
* Forwarding logs to Splunk and log output are configured in the `output` section:
    * Logs are forwarded from Logstash to Splunk in the JSON format
    * All event logs are forwarded from Logstash to Splunk API endpoint `https://109.111.35.11:8088/services/collector/raw` via POST requests. To authorize requests, the HTTPS Event Collector token is used
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
  http { # output plugin to forward logs from Logstash via HTTP/HTTPS protocol
    format => "json" # format of forwarded logs
    http_method => "post" # HTTP method used to forward logs
    url => "https://109.111.35.11:8088/services/collector/raw" # ednpoint to forward logs to
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # HTTP headers to authorize requests
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

A more detailed description of configuration files is available in the [official Logstash documentation](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "Testing Logstash configuration"
    To check that Logstash logs are created and forwarded to Splunk, the POST request can be sent to Logstash.

    **Request example:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash logs:**
    ![!Logstash logs](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunk event:**
    ![!Splunk events](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Configuration of webhook integration

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![!Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/add-webhook-integration.png)

## Example testing

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash will log the event as follows:

![!Log about new user in Splunk from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

The following entry will be displayed in Splunk events:

![!New user card in Splunk from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)
