[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstash üzerinden Splunk Enterprise

Bu talimatlar, Wallarm'ın Logstash veri koleksiyoncusu ile entegrasyonuna Splunk SIEM sistemine daha fazla olay yönlendirmesi için örnek sağlar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## Kullanılan kaynaklar

* WEB URL'ye sahip [Splunk Enterprise](#splunk-enterprise-configuration) `https://109.111.35.11:8000` ve API URL'si `https://109.111.35.11:8088`
* Debian 11.x (bullseye) üzerinde kurulu [Logstash 7.7.0](#logstash-configuration) ve `https://logstash.example.domain.com` adresinde mevcut
* Wallarm Console'a yönetici erişimi [EU cloud](https://my.wallarm.com) içinde [Logstash entegrasyonunu yapılandırmak için](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

Splunk Enterprise ve Logstash hizmetlerine verilen bağlantılar örnek olarak belirtildiği için yanıt vermiyorlar.

### Splunk Enterprise yapılandırması

Logstash kayıtları `Wallarm Logstash kayıtları` adıyla ve diğer varsayılan ayarlarla Splunk HTTP Event Controller'a gönderilir:

![HTTP Olayı Toplayıcısı Yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTP Event Controller'a erişmek için oluşturulan `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb` jetonu kullanılacaktır.

Splunk HTTP Olayı Toplayıcısının kurulumuna dair daha ayrıntılı bir açıklama [resmi Splunk belgelerinde](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) mevcuttur.

### Logstash yapılandırması

Wallarm, kayıtları web aracılığıyla Logstash ara veri toplayıcısına gönderdiği için, Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul et
* HTTPS isteklerini kabul et
* Halka açık URL'ye sahip ol
* Kayıtları Splunk Enterprise'a ilet, bu örnekte kayıtları iletmek için `http` eklentisi kullanılıyor

Logstash `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme, `input` bölümünde yapılandırılmıştır:
    * Trafik, 5044 portuna gönderilir
    * Logstash yalnızca HTTPS bağlantılarını kabul etmek üzere yapılandırılmıştır
    * Logstash TLS sertifikası, bir genel olarak güvenilen CA tarafından imzalanmış olup `/etc/server.crt` dosyası içinde bulunmaktadır
    * TLS sertifikası için özel anahtar `/etc/server.key` dosyası içinde bulunmaktadır
* Splunk'a kayıtları iletmek ve log çıktısı, `output` bölümünde yapılandırılmıştır:
    * Kayıtlar Logstash'dan Splunk'a JSON formatında iletilecektir
    * Tüm olay kayıtları Logstash'dan Splunk API uç noktası olan `https://109.111.35.11:8088/services/collector/raw`'a POST istekleri aracılığıyla yönlendirilir. İstekleri yetkilendirmek için HTTPS Event Collector jetonu kullanılır
    * Logstash kayıtları ek olarak komut satırına yazdırılır (15. kod satırı). Bu ayar, olayların Logstash aracılığıyla kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafik için giriş eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafik işleme
    ssl_certificate => "/etc/server.crt" # Logstash TLS belgesi
    ssl_key => "/etc/server.key" # TLS belgesi için özel anahtar
  }
}
output {
  http { # Kayıtları Logstash'tan HTTP/HTTPS protokolü üzerinden iletme eklentisi
    format => "json" # iletilebilecek kayıtların formatı
    http_method => "post" # Kayıtları iletme işlemi için kullanılan HTTP metodu
    url => "https://109.111.35.11:8088/services/collector/raw" # Iletilecek kayıtlar için hedef
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # İstekleri yetkilendiren HTTP başlıkları
  }
  stdout {} # Logstash kayıtlarını komut satırına yazdırmak için çıktı eklentisi
}
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Logstash belgelerinde](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! bilgi "Logstash yapılandırmasını test etme"
    Logstash loglarının oluşturulduğunu ve Splunk'a yönlendirildiğini kontrol etmek için, Logstash'a POST isteği gönderilebilir.

    **Örnek istek:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
  ```

    **Logstash logları:**
    ![Logstash logları](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunk olayı:**
    ![Splunk olayları](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Logstash entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Webhook entegrasyonu ile Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonu yapılandırmasına dair daha fazla ayrıntı](../logstash.md)

## Örnek testi

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash olayı aşağıdaki gibi kaydedecek:

![Logstash'tan Splunk'ta yeni kullanıcı hakkındaki log kayıdı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Aşağıdaki giriş Splunk olaylarında görüntülenecektir:

![Logstash'tan Splunk'ta yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## Olayların bir pano içinde düzenlenmesi

--8<-- "../include/integrations/application-for-splunk.md"