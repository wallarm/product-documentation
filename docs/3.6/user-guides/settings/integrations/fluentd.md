# Fluentd

You can set up Wallarm to send notifications of detected events to Fluentd by creating an appropriate integration in Wallarm Console.

You can choose the following events to be sent to Fluentd:

--8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

## Notification format

Wallarm sends notifications to Fluentd via **webhooks** in the JSON format. The set of JSON objects depends on the event Wallarm notifies about.

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

The Fluentd configuration should meet the following requirements:

* Accept the POST or PUT requests
* Accept HTTPS requests
* Have public URL

Fluentd configuration example:

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
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

You will find more details in the [official Fluentd documentation](https://docs.datadoghq.com/integrations/fluentd).

## Setting up integration

1. Proceed to the Fluentd integration setup in Wallarm Console → **Integrations** → **Fluentd**.
1. Input the integration name.
1. Specify target Fluentd URL (Webhook URL).
1. If required, configure advanced settings:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Choose event types to trigger sending notifications to the specified URL. If the events are not chosen, then notifications will not be sent.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

![Fluentd integration](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

The test Fluentd log:

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

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"

## Using Fluentd as an intermediate data collector

--8<-- "../include/integrations/webhook-examples/overview.md"

For example:

![Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

To log Wallarm events using this scheme:

1. Configure data collector to read incoming webhooks and forward logs to the next system. Wallarm sends events to data collectors via webhooks.
1. Configure a SIEM system to get and read logs from the data collector.
1. Configure Wallarm to send logs to the data collector.

    Wallarm can send logs to any data collector via webhooks.

    To integrate Wallarm with Fluentd or Logstash, you can use the corresponding integration cards in the Wallarm Console UI.

    To integrate Wallarm with other data collectors, you can use the [webhook integration card](webhook.md) in the Wallarm Console UI.

We described some examples of how to configure the integration with the popular data collectors forwarding logs to the SIEM systems:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm also supports the [native integration with Datadog via Datadog API](datadog.md). The native integration does not require the intermediate data collector to be used.