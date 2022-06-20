# Datadog

You can set up Wallarm to send notifications of detected events to Datadog through the Fluentd or Logstash intermediate data collector.

![!Sending notifications from Wallarm to Datadog](../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

You can choose the following events to be sent to Datadog:

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## Notification format

Wallarm sends notifications via **webhooks** in the JSON format. The set of JSON objects depends on the event Wallarm notifies about.

Example of the notification of the new hit detected:

```json
[
    {
        "summary": "[Wallarm] New hit detected",
        "details": {
        "client_name": "TestCompany",
        "cloud": "EU",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.example.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "SOME_value",
            "path": "/news/some_path",
            "payloads": [
                "say ni"
            ],
            "point": [
                "post"
            ],
            "probability": 0.01,
            "remote_country": "PL",
            "remote_port": 0,
            "remote_addr4": "8.8.8.8",
            "remote_addr6": "",
            "tor": "none",
            "request_time": 1603834606,
            "create_time": 1603834608,
            "response_len": 14,
            "response_status": 200,
            "response_time": 5,
            "stamps": [
                1111
            ],
            "regex": [],
            "stamps_hash": -22222,
            "regex_hash": -33333,
            "type": "sqli",
            "block_status": "monitored",
            "id": [
                "hits_production_999_202010_v_1",
                "c2dd33831a13be0d_AC9"
            ],
            "object_type": "hit",
            "anomaly": 0
            }
        }
    }
]
```

## Requirements

The configuration of the Fluentd or Logstash intermediate data collector should meet the following requirements:

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

## Setting up integration

1. Proceed to the Datadog integration setup in Wallarm Console → **Settings** → **Integrations** → **Datadog**.
1. Input the integration name.
1. Specify target Fluentd or Logstash URL (Webhook URL).
1. If required, configure advanced settings:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Choose event types to trigger sending notifications to the specified URL. If the events are not chosen, then notifications will not be sent.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

![!Datadog integration](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration.md"

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

![!The test Datadog log](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
