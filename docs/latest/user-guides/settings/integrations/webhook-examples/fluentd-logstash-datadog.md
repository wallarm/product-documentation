# Datadog via Fluentd/Logstash

You can set up Wallarm to send notifications of detected events to Datadog through the Fluentd or Logstash intermediate data collector.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Sending notifications from Wallarm to Datadog via data collector](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Native integration with Datadog"
    Wallarm also supports the [native integration with Datadog via Datadog API](../datadog.md). The native integration does not require the intermediate data collector to be used.

## Used resources

* The Fluentd or Logstash service available on the public URL
* The Datadog service available on the public URL
* Administrator access to Wallarm Console in [EU cloud](https://my.wallarm.com) to [configure the Fluentd/Logstash integration](#setting-up-integration-with-fluentd-or-logstash)

--8<-- "../include/cloud-ip-by-request.md"

## Requirements

Since Wallarm sends logs to the intermediate data collector via webhooks, the configuration of Fluentd or Logstash should meet the following requirements:

* Accept the POST or PUT requests
* Accept HTTPS requests
* Have public URL
* Forward logs to Datadog via the `datadog_logs` Logstash plugin or the `fluent-plugin-datadog` Fluentd plugin

=== "Logstash configuration example"
    1. [Install the `datadog_logs` plugin](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it) to forward logs to Datadog.
    1. Configure Logstash to read incoming requests and forward logs to Datadog.

    The `logstash-sample.conf` configuration file example:

    ```bash linenums="1"
    input {
      http { # input plugin for HTTP and HTTPS traffic
        port => 5044 # port for incoming requests
        ssl => true # HTTPS traffic processing
        ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
        ssl_key => "/etc/server.key" # private key for TLS certificate
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # mutate filter adding the source field to the Datadog log record for further filtration of Wallarm logs
        }
      }
    }
    output {
      stdout {} # output plugin to print Logstash logs on the command line
      datadog_logs { # output plugin to forward the Logstash logs to Datadog
          api_key => "XXXX" # API key generated for the organization in Datadog
          host => "http-intake.logs.datadoghq.eu" # Datadog endpoint (depends on the registration region)
      }
    }
    ```

    * [Documentation on the Logstash configuration file structure](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [Documentation on the `datadog_logs` plugin](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentd configuration example"
    1. [Install the `fluent-plugin-datadog` plugin](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements) to forward logs to Datadog.
    1. Configure Fluentd to read incoming requests and forward logs to Datadog.

    The `td-agent.conf` configuration file example:

    ```bash linenums="1"
    <source>
      @type http # input plugin for HTTP and HTTPS traffic
      port 9880 # port for incoming requests
      <transport tls> # configuration for connections handling
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # output plugin to forward logs from Fluentd to Datadog
      @id awesome_agent
      api_key XXXX # API key generated for the organization in Datadog
      host 'http-intake.logs.datadoghq.eu' # Datadog endpoint (depends on the registration region)
    
      # Optional
      include_tag_key true
      tag_key 'tag'
    
      # Optional tags
      dd_source 'wallarm' # adding the source field to the Datadog log record for further filtration of Wallarm logs
      dd_tags 'integration:fluentd'
    
      <buffer>
              @type memory
              flush_thread_count 4
              flush_interval 3s
              chunk_limit_size 5m
              chunk_limit_records 500
      </buffer>
    </match>
    ```

    * [Documentation on the Fluentd configuration file structure](https://docs.fluentd.org/configuration/config-file)
    * [Documentation on the `fluent-plugin-datadog` plugin](https://docs.datadoghq.com/integrations/fluentd)

## Setting up integration with Fluentd or Logstash

1. Proceed to the Datadog integration setup in Wallarm Console → **Integrations** → **Fluentd**/**Logstash**.
1. Input the integration name.
1. Specify target Fluentd or Logstash URL (Webhook URL).
1. If required, configure advanced settings:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Choose event types to trigger sending notifications to the specified URL. If the events are not chosen, then notifications will not be sent.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

Fluentd integration example:

![Adding integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

The test log in the Fluentd or Logstash intermediate data collector:

```json
[
    {
        summary:"[Test message] [Test partner(US)] New vulnerability detected",
        description:"Notification type: vuln

                    New vulnerability was detected in your system.

                    ID: 
                    Title: Test
                    Domain: example.com
                    Path: 
                    Method: 
                    Discovered by: 
                    Parameter: 
                    Type: Info
                    Threat: Medium

                    More details: https://us1.my.wallarm.com/object/555


                    Client: TestCompany
                    Cloud: US
                    ",
        details:{
            client_name:"TestCompany",
            cloud:"US",
            notification_type:"vuln",
            vuln_link:"https://us1.my.wallarm.com/object/555",
            vuln:{
                domain:"example.com",
                id:null,
                method:null,
                parameter:null,
                path:null,
                title:"Test",
                discovered_by:null,
                threat:"Medium",
                type:"Info"
            }
        }
    }
]
```

The test Datadog log:

![The test Datadog log](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

To find the Wallarm logs among other records, you can use the `source:wallarm_cloud` search tag in the Datadog Logs service.
