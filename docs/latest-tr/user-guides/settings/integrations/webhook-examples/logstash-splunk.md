[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstash üzerinden Splunk Enterprise

Bu talimatlar, Wallarm’ın Logstash veri toplayıcı ile entegrasyonuna ilişkin bir örnek sunar; olayların Splunk SIEM sistemine iletilmesini sağlar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## Kullanılan kaynaklar

* [Splunk Enterprise](#splunk-enterprise-configuration) WEB URL `https://109.111.35.11:8000` ve API URL `https://109.111.35.11:8088` ile
* Debian 11.x (bullseye) üzerine kurulu ve `https://logstash.example.domain.com` üzerinden erişilebilen [Logstash 7.7.0](#logstash-configuration)
* [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration) için [EU cloud](https://my.wallarm.com) içindeki Wallarm Console’a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Splunk Enterprise ve Logstash servislerine ait bağlantılar örnek olarak verildiğinden yanıt vermezler.

### Splunk Enterprise yapılandırması {#splunk-enterprise-configuration}

Logstash günlükleri, `Wallarm Logstash logs` adı ve diğer varsayılan ayarlarla Splunk HTTP Event Controller’a gönderilir:

![HTTP Event Collector yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTP Event Controller’a erişmek için oluşturulan `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb` jetonu kullanılacaktır.

Splunk HTTP Event Controller kurulumunun daha ayrıntılı açıklaması [resmi Splunk dokümantasyonunda](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) mevcuttur.

### Logstash yapılandırması {#logstash-configuration}

Wallarm, günlükleri webhooks üzerinden ara veri toplayıcı olan Logstash’e gönderdiğinden Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel bir URL’ye sahip olmak
* Günlükleri Splunk Enterprise’a iletmek; bu örnekte günlükleri iletmek için `http` eklentisi kullanılmaktadır

Logstash, `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme `input` bölümünde yapılandırılmıştır:
    * Trafik 5044 portuna gönderilir
    * Logstash sadece HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Logstash TLS sertifikası `/etc/server.crt` dosyasında bulunmaktadır
    * TLS sertifikasının özel anahtarı `/etc/server.key` dosyasında bulunmaktadır
* Splunk’a iletim ve günlük çıktılaması `output` bölümünde yapılandırılmıştır:
    * Günlükler Logstash’ten Splunk’a JSON formatında iletilir
    * Tüm olay günlükleri Logstash’ten Splunk API uç noktası `https://109.111.35.11:8088/services/collector/raw` adresine POST istekleriyle iletilir. İstekleri yetkilendirmek için HTTPS Event Collector jetonu kullanılır
    * Logstash günlükleri ayrıca komut satırına yazdırılır (15. kod satırı). Bu ayar, olayların Logstash üzerinden günlüğe yazıldığını doğrulamak için kullanılır

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafiği için input eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafiğinin işlenmesi
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  http { # Logstash'ten HTTP/HTTPS protokolü ile günlükleri iletmek için output eklentisi
    format => "json" # iletilen günlüklerin formatı
    http_method => "post" # günlükleri iletmek için kullanılan HTTP yöntemi
    url => "https://109.111.35.11:8088/services/collector/raw" # günlüklerin iletileceği uç nokta
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # istekleri yetkilendirmek için HTTP başlıkları
  }
  stdout {} # Logstash günlüklerini komut satırına yazdırmak için output eklentisi
}
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Logstash dokümantasyonunda](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! info "Logstash yapılandırmasını test etme"
    Logstash günlüklerinin oluşturulup Splunk’a iletildiğini kontrol etmek için Logstash’e POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash günlükleri:**
    ![Logstash günlükleri](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunk olayı:**
    ![Splunk olayları](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Logstash entegrasyonunun yapılandırılması {#configuration-of-logstash-integration}

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Logstash ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonunun yapılandırması hakkında daha fazla bilgi](../logstash.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash olayı aşağıdaki gibi günlüğe yazacaktır:

![Logstash'tan Splunk'ta yeni kullanıcıya ilişkin günlük](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Splunk olaylarında aşağıdaki kayıt görüntülenecektir:

![Logstash'tan Splunk'ta yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## Olayları bir panoda düzenleme

--8<-- "../include/integrations/application-for-splunk.md"