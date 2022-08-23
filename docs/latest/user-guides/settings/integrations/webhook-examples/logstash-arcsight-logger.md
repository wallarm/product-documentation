# Micro Focus ArcSight Logger via Logstash

These instructions provide you with the example integration of Wallarm with the Logstash data collector to further forward events to the ArcSight Logger system.

--8<-- "../include/integrations/webhook-examples/overview.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "Integration with the Enterprise version of ArcSight ESM"
    To configure forwarding logs from Logstash to the Enterprise version of ArcSight ESM, it is recommended to configure the Syslog Connector on the ArcSight side and then forward logs from Logstash to the connector port. To get a more detailed description of the connectors, please download the **SmartConnector User Guide** from the [official ArcSight SmartConnector documentation](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## Used resources

* [ArcSight Logger 7.1](#arcsight-logger-configuration) with the WEB URL `https://192.168.1.73:443` installed on CentOS 7.8
* [Logstash 7.7.0](#logstash-configuration) installed on Debian 10.4 (Buster) and available on `https://logstash.example.domain.com`
* Administrator access to Wallarm Console in [EU cloud](https://my.wallarm.com) to [configure the Logstash integration](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

Since the links to the ArcSight Logger and Logstash services are cited as examples, they do not respond.

### ArcSight Logger configuration

ArcSight Logger has logs receiver `Wallarm Logstash logs` configured as follows:

* Logs are received via UDP (`Type = UDP Receiver`)
* Listening port is `514`
* Events are parsed with the syslog parser
* Other default settings

![!Configuration of receiver in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

To get a more detailed description of the receiver configuration, please download the **Logger Installation Guide** of an appropriate version from the [official ArcSight Logger documentation](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### Logstash configuration

Since Wallarm sends logs to the Logstash intermediate data collector via webhooks, the Logstash configuration should meet the following requirements:

* Accept the POST or PUT requests
* Accept HTTPS requests
* Have public URL
* Forward logs to ArcSight Logger, this example uses the `syslog` plugin to forward logs

Logstash is configured in the `logstash-sample.conf` file:

* Incoming webhook processing is configured in the `input` section:
    * Traffic is sent to port 5044
    * Logstash is configured to accept only HTTPS connections
    * Logstash TLS certificate signed by a publicly trusted CA is located within the file `/etc/server.crt`
    * Private key for TLS certificate is located within the file `/etc/server.key`
* Forwarding logs to ArcSight Logger and log output are configured in the `output` section:
    * All event logs are forwarded from Logstash to ArcSight Logger at the IP address `https://192.168.1.73:514`
    * Logs are forwarded from Logstash to ArcSight Logger in the JSON format according to the [Syslog](https://en.wikipedia.org/wiki/Syslog) standard
    * Connection with ArcSight Logger is established via UDP
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
    host => "192.168.1.73" # IP address to forward logs to
    port => "514" # port to forward logs to
    protocol => "udp" # connection protocol
    codec => json # format of forwarded logs
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

A more detailed description of the configuration files is available in the [official Logstash documentation](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "Testing Logstash configuration"
    To check that Logstash logs are created and forwarded to ArcSight Logger, the POST request can be sent to Logstash.

    **Request example:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash logs:**
    ![!Logstash logs](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **Event in ArcSight Logger:**
    ![!ArcSight Logger event](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Configuration of Logstash integration

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![!Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[More details on the Logstash integration configuration](../logstash.md)

## Example testing

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash will log the event as follows:

![!Log about new user in ArcSight Logger from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

The following entry will be displayed in ArcSight Logger events:

![!New user card in ArcSight Logger from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)
