# Fluentd/Logstash üzerinden Datadog

Wallarm’ı, tespit edilen olaylara ilişkin bildirimleri Fluentd veya Logstash ara veri toplayıcısı üzerinden Datadog’a gönderecek şekilde yapılandırabilirsiniz.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Veri toplayıcı üzerinden Wallarm’dan Datadog’a bildirim gönderme](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Datadog ile yerel entegrasyon"
    Wallarm ayrıca [Datadog API aracılığıyla Datadog ile yerel entegrasyonu](../datadog.md) destekler. Yerel entegrasyon, ara veri toplayıcının kullanılmasını gerektirmez.

## Kullanılan kaynaklar

* Genel bir URL üzerinden erişilebilen Fluentd veya Logstash servisi
* Genel bir URL üzerinden erişilebilen Datadog servisi
* [Fluentd/Logstash entegrasyonunu yapılandırmak](#setting-up-integration-with-fluentd-or-logstash) için [AB bulutu](https://my.wallarm.com) üzerinde Wallarm Console’a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

## Gereksinimler

Wallarm, günlükleri webhook’lar aracılığıyla ara veri toplayıcıya gönderdiğinden, Fluentd veya Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Genel bir URL’ye sahip olmalıdır
* Günlükleri, `datadog_logs` Logstash eklentisi veya `fluent-plugin-datadog` Fluentd eklentisi aracılığıyla Datadog’a iletmelidir

=== "Logstash yapılandırma örneği"
    1. Günlükleri Datadog’a iletmek için [`datadog_logs` eklentisini yükleyin](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it).
    1. Gelen istekleri okumak ve günlükleri Datadog’a iletmek için Logstash’i yapılandırın.

    Örnek `logstash-sample.conf` yapılandırma dosyası:

    ```bash linenums="1"
    input {
      http { # HTTP ve HTTPS trafiği için input eklentisi
        port => 5044 # Gelen istekler için port
        ssl => true # HTTPS trafiğinin işlenmesi
        ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
        ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # Wallarm günlüklerinin daha sonra filtrelenebilmesi için Datadog günlük kaydına source alanını ekleyen mutate filtresi
        }
      }
    }
    output {
      stdout {} # Logstash günlüklerini komut satırında yazdıran output eklentisi
      datadog_logs { # Logstash günlüklerini Datadog’a ileten output eklentisi
          api_key => "XXXX" # Datadog’daki organizasyon için üretilen API anahtarı
          host => "http-intake.logs.datadoghq.eu" # Datadog uç noktası (kayıt bölgesine bağlıdır)
      }
    }
    ```

    * [Logstash yapılandırma dosyası yapısı hakkında dokümantasyon](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [`datadog_logs` eklentisi hakkında dokümantasyon](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentd yapılandırma örneği"
    1. Günlükleri Datadog’a iletmek için [`fluent-plugin-datadog` eklentisini yükleyin](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements).
    1. Gelen istekleri okumak ve günlükleri Datadog’a iletmek için Fluentd’i yapılandırın.

    Örnek `td-agent.conf` yapılandırma dosyası:

    ```bash linenums="1"
    <source>
      @type http # HTTP ve HTTPS trafiği için input eklentisi
      port 9880 # Gelen istekler için port
      <transport tls> # bağlantıların işlenmesi için yapılandırma
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # Fluentd’den Datadog’a günlük ileten output eklentisi
      @id awesome_agent
      api_key XXXX # Datadog’daki organizasyon için üretilen API anahtarı
      host 'http-intake.logs.datadoghq.eu' # Datadog uç noktası (kayıt bölgesine bağlıdır)
    
      # İsteğe bağlı
      include_tag_key true
      tag_key 'tag'
    
      # İsteğe bağlı etiketler
      dd_source 'wallarm' # Wallarm günlüklerinin daha sonra filtrelenebilmesi için Datadog günlük kaydına source alanını ekleme
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

    * [Fluentd yapılandırma dosyası yapısı hakkında dokümantasyon](https://docs.fluentd.org/configuration/config-file)
    * [`fluent-plugin-datadog` eklentisi hakkında dokümantasyon](https://docs.datadoghq.com/integrations/fluentd)

## Fluentd veya Logstash ile entegrasyonun yapılandırılması

1. Wallarm Console → **Integrations** → **Fluentd**/**Logstash** içinde Datadog entegrasyonu kurulumuna gidin.
1. Entegrasyon adını girin.
1. Hedef Fluentd veya Logstash URL’sini belirtin (Webhook URL).
1. Gerekirse gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Belirtilen URL’ye bildirim gönderimini tetikleyecek olay türlerini seçin. Olaylar seçilmezse bildirimler gönderilmez.
1. [Entegrasyonu test edin](#testing-integration) ve ayarların doğru olduğundan emin olun.
1. **Add integration**’a tıklayın.

Fluentd entegrasyon örneği:

![Fluentd ile entegrasyon ekleme](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## Entegrasyonun test edilmesi

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

Test Datadog günlüğü:

![Test Datadog günlüğü](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

Diğer kayıtlar arasında Wallarm günlüklerini bulmak için Datadog Logs servisinde `source:wallarm_cloud` arama etiketini kullanabilirsiniz.