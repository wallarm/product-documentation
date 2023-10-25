# Fluentd/Logstash Aracılığıyla Datadog

Wallarm, Fluentd veya Logstash ara veri toplayıcısı aracılığıyla Datadog'a algılanan olayların bildirimlerini göndermek için kurulabilir.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Wallarm'dan Datadog'a veri toplayıcı aracılığıyla bildirim gönderme](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Datadog ile Yerel Entegrasyon"
    Wallarm, ayrıca [Datadog API aracılığıyla yerel Datadog entegrasyonunu](../datadog.md) destekler. Yerel entegrasyonun ara veri toplayıcısının kullanılmasını gerektirmez.

## Kullanılan Kaynaklar

* Halka açık URL üzerinde mevcut olan Fluentd veya Logstash hizmeti
* Halka açık URL üzerinde mevcut olan Datadog hizmeti
* [Fluentd/Logstash entegrasyonunu ayarlamak](#setting-up-integration-with-fluentd-or-logstash) için [AV bulutundaki](https://my.wallarm.com) Wallarm Konsoluna yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

## Gereklilikler

Wallarm, Fluentd veya Logstash'ın konfigürasyonu aşağıdaki gereklilikleri karşılamalıdır çünkü Wallarm, web kancaları aracılığıyla ara veri toplayıcısına günlükleri gönderir:

* POST veya PUT isteklerini kabul eder
* HTTPS isteklerini kabul eder
* Halka açık bir URL'ye sahiptir
* Günlükleri `datadog_logs` Logstash eklentisi veya `fluent-plugin-datadog` Fluentd eklentisi aracılığıyla Datadog'a iletir

=== "Logstash yapılandırma örneği"
    1. Günlükleri Datadog'a iletmek için [`datadog_logs` eklentisini kurun](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it). 
    1. Logstash'ı, gelen istekleri okuması ve günlükleri Datadog'a iletmesi için yapılandırın.

    `logstash-sample.conf` yapılandırma dosyası örneği:

    ```bash linenums="1"
    input {
      http { # HTTP ve HTTPS trafiği için giriş eklentisi
        port => 5044 # gelen istekler için port
        ssl => true # HTTPS trafiği işleme
        ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
        ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # Wallarm günlüklerinin ileride filtrelenmesi için Datadog günlük kaydına kaynak alanı ekleyen mutate filtresi
        }
      }
    }
    output {
      stdout {} # Logstash günlüklerini komut satırında yazdırmak için çıktı eklentisi
      datadog_logs { # Logstash günlüklerini Datadog'a iletmek için çıktı eklentisi
          api_key => "XXXX" # Datadog'daki kuruluş için üretilen API anahtarı
          host => "http-intake.logs.datadoghq.eu" # Datadog endpoints (kayıt bölgesine bağlıdır)
      }
    }
    ```

    * [Logstash yapılandırma dosyası yapısı üzerine belgeler](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [`datadog_logs` eklentisi üzerine belgeler](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentd yapılandırma örneği"
    1. Günlükleri Datadog'a iletmek için [`fluent-plugin-datadog` eklentisini yükleyin](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements).
    1. Fluentd'yi, gelen istekleri okumasını ve günlükleri Datadog'a iletmesini sağlayacak şekilde yapılandırın.

    `td-agent.conf` yapılandırma dosyası örneği:

    ```bash linenums="1"
    <source>
      @type http # HTTP ve HTTPS trafiği için giriş eklentisi
      port 9880 # gelen istekler için port
      <transport tls> # bağlantıları işleme konfigürasyonu
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # Fluentd'den Datadog'a günlükleri iletmek için çıktı eklentisi
      @id awesome_agent
      api_key XXXX # Datadog'daki kuruluş için üretilen API anahtarı
      host 'http-intake.logs.datadoghq.eu' # Datadog endpoint (kayıt bölgesine bağlıdır)
    
      # İsteğe Bağlı
      include_tag_key true
      tag_key 'tag'
    
      # İsteğe Bağlı etiketler
      dd_source 'wallarm' # Wallarm günlüklerinin ileride filtrelenmesi için Datadog günlük kaydına kaynak alanı eklemek*
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

    * [Fluentd yapılandırma dosyası yapısı üzerine belgeler](https://docs.fluentd.org/configuration/config-file)
    * [`fluent-plugin-datadog` eklentisi üzerine belgeler](https://docs.datadoghq.com/integrations/fluentd)

## Fluentd veya Logstash ile Entegrasyon Kurma

1. Wallarm Konsolunda Datadog entegrasyon kurulumuna gidin → **Entegrasyonlar** → **Fluentd**/**Logstash**.
1. Entegrasyon adını girin.
1. Hedef Fluentd veya Logstash URL'sini (Webhook URL) belirtin.
1. Gerekirse, gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Belirtilen URL'ye bildirim göndermeyi tetikleyecek olay türlerini seçin. Olaylar seçilmezse, bildirimler gönderilmez.
1. [Entegrasyonu test edin](#testing-integration) ve ayarların doğru olduğundan emin olun.
1. **Entegrasyon ekle**'ye tıklayın. 

Fluentd entegrasyon örneği:

![Fluentd ile entegrasyon ekleme](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## Entegrasyonu Test Etme

--8<-- "../include/integrations/test-integration-advanced-data.md"

Fluentd veya Logstash ara veri toplayıcısındaki test günlüğü:

```json
[
    {
        summary:"[Test mesajı] [Test iş ortağı(ABD)] Yeni zafiyet tespit edildi",
        description:"Bildirim türü: vuln

                    Sisteminizde yeni bir zafiyet tespit edildi.

                    ID: 
                    Başlık: Test
                    Domain: example.com
                    Yol: 
                    Yöntem: 
                    Tespit Eden: 
                    Parametre: 
                    Tür: Bilgi
                    Tehlike: Orta

                    Daha fazla detay: https://us1.my.wallarm.com/object/555


                    Müşteri: TestŞirketi
                    Bulut: ABD
                    ",
        details:{
            client_name:"TestŞirketi",
            cloud:"ABD",
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
                threat:"Orta",
                type:"Bilgi"
            }
        }
    }
]
```

Test Datadog günlüğü:

![Test Datadog günlüğü](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

Diğer kayıtlar arasında Wallarm günlüklerini bulmak için, Datadog Logs hizmetinde `source:wallarm_cloud` arama etiketini kullanabilirsiniz.
