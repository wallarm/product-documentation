# Datadog via Fluentd/Logstash

Wallarm'ı, Fluentd veya Logstash ara veri toplayıcısı aracılığıyla tespit edilen olayların bildirimlerini Datadog'a gönderecek şekilde yapılandırabilirsiniz.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Wallarm'dan veri toplayıcı aracılığıyla Datadog'a bildirim gönderme](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Native integration with Datadog"
    Wallarm ayrıca, Datadog API aracılığıyla [native integration with Datadog](../datadog.md) desteği sunmaktadır. Yerel entegrasyon, ara veri toplayıcısının kullanılmasını gerektirmez.

## Used resources

* Genel URL'de bulunan Fluentd veya Logstash servisi
* Genel URL'de bulunan Datadog servisi
* Wallarm Console'da [EU cloud](https://my.wallarm.com) üzerinde yönetici erişimi ile [Fluentd/Logstash integration](#setting-up-integration-with-fluentd-or-logstash) yapılandırması

--8<-- "../include/cloud-ip-by-request.md"

## Requirements

Wallarm, webhooks aracılığıyla ara veri toplayıcısına günlük gönderdiğinden, Fluentd veya Logstash yapılandırmasının aşağıdaki gereksinimleri karşılaması gerekir:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel bir URL'ye sahip olmak
* Günlükleri Datadog'a `datadog_logs` Logstash eklentisi veya `fluent-plugin-datadog` Fluentd eklentisi aracılığıyla iletmek

=== "Logstash configuration example"
    1. Datadog'a günlük iletmek için [datadog_logs eklentisini](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it) yükleyin.
    1. Gelen istekleri okuyacak ve günlükleri Datadog'a yönlendirecek şekilde Logstash'ı yapılandırın.

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
    1. Datadog'a günlük iletmek için [fluent-plugin-datadog eklentisini](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements) yükleyin.
    1. Gelen istekleri okuyacak ve günlükleri Datadog'a yönlendirecek şekilde Fluentd'i yapılandırın.

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

1. Wallarm Console'da **Integrations** → **Fluentd**/**Logstash** bölümüne giderek Datadog entegrasyon kurulumuna devam edin.
1. Entegrasyon adını girin.
1. Hedef Fluentd veya Logstash URL'sini (Webhook URL) belirtin.
1. Gerekirse, gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Belirtilen URL'ye bildirim gönderimini tetikleyecek olay türlerini seçin. Olaylar seçilmezse bildirim gönderilmeyecektir.
1. [Entegrasyonu test edin](#testing-integration) ve ayarların doğru olduğundan emin olun.
1. **Add integration** butonuna tıklayın.

Fluentd integration example:

![Fluentd ile entegrasyon ekleme](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

Fluentd veya Logstash ara veri toplayıcısındaki test günlüğü:

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

Test Datadog log:

![Test Datadog log](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

Diğer kayıtlar arasında Wallarm günlüklerini bulmak için Datadog Logs hizmetinde `source:wallarm_cloud` arama etiketini kullanabilirsiniz.