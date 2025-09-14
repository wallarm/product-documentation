# Logstash aracılığıyla Micro Focus ArcSight Logger

Bu talimatlar, olayları ArcSight Logger sistemine iletmek için Wallarm'ın Logstash veri toplayıcıyla örnek entegrasyonunu sunar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "ArcSight ESM'in Enterprise sürümüyle entegrasyon"
    Logstash'ten ArcSight ESM'in Enterprise sürümüne günlük iletimini yapılandırmak için, ArcSight tarafında Syslog Connector yapılandırılması ve ardından günlüklerin Logstash'ten konektör portuna iletilmesi önerilir. Konektörlerin daha ayrıntılı açıklaması için, lütfen [resmi ArcSight SmartConnector dokümantasyonundan](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs) **SmartConnector User Guide** belgesini indirin.

## Kullanılan kaynaklar

* CentOS 7.8 üzerine kurulu, WEB URL'si `https://192.168.1.73:443` olan [ArcSight Logger 7.1](#arcsight-logger-configuration)
* Debian 11.x (bullseye) üzerine kurulu ve `https://logstash.example.domain.com` adresinden erişilebilir [Logstash 7.7.0](#logstash-configuration)
* [EU cloud](https://my.wallarm.com) içindeki Wallarm Console'a [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration) için yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

ArcSight Logger ve Logstash servislerine ait bağlantılar örnek amaçlı verildiğinden yanıt vermezler.

### ArcSight Logger yapılandırması

ArcSight Logger'da `Wallarm Logstash logs` adlı günlük alıcısı aşağıdaki şekilde yapılandırılmıştır:

* Günlükler UDP üzerinden alınır (`Type = UDP Receiver`)
* Dinleme portu `514`'tür
* Olaylar syslog ayrıştırıcısıyla ayrıştırılır
* Diğer varsayılan ayarlar

![ArcSight Logger'da alıcının yapılandırılması](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

Alıcı yapılandırmasına ilişkin daha ayrıntılı açıklama için, uygun sürümün **Logger Installation Guide** belgesini [resmi ArcSight Logger dokümantasyonundan](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) indirin.

### Logstash yapılandırması

Wallarm günlükleri webhooks aracılığıyla Logstash ara veri toplayıcısına gönderdiğinden, Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Genel erişilebilir bir URL'ye sahip olmalıdır
* Günlükleri ArcSight Logger'a iletmelidir; bu örnekte iletim için `syslog` eklentisi kullanılır

Logstash, `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işlemesi `input` bölümünde yapılandırılmıştır:
    * Trafik 5044 portuna yönlendirilir
    * Logstash yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Logstash TLS sertifikası `/etc/server.crt` dosyasında bulunur
    * TLS sertifikasına ait özel anahtar `/etc/server.key` dosyasında bulunur
* Günlüklerin ArcSight Logger'a iletilmesi ve günlük çıktısı `output` bölümünde yapılandırılmıştır:
    * Tüm olay günlükleri Logstash'ten ArcSight Logger'a `https://192.168.1.73:514` IP adresine iletilir
    * Günlükler Logstash'ten ArcSight Logger'a [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına göre JSON formatında iletilir
    * ArcSight Logger ile bağlantı UDP üzerinden kurulur
    * Logstash günlükleri ayrıca komut satırına yazdırılır (kodun 15. satırı). Bu ayar, olayların Logstash üzerinden günlüğe kaydedildiğini doğrulamak için kullanılır

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
  syslog { # Logstash'ten Syslog üzerinden günlük iletimi için output eklentisi
    host => "192.168.1.73" # günlüklerin iletileceği IP adresi
    port => "514" # günlüklerin iletileceği port
    protocol => "udp" # bağlantı protokolü
    codec => json # iletilen günlüklerin biçimi
  }
  stdout {} # Logstash günlüklerini komut satırına yazdırmak için output eklentisi
}
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Logstash dokümantasyonunda](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! info "Logstash yapılandırmasının test edilmesi"
    Logstash günlüklerinin oluşturulduğunu ve ArcSight Logger'a iletildiğini kontrol etmek için Logstash'e bir POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash günlükleri:**
    ![Logstash günlükleri](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Logger'daki olay:**
    ![ArcSight Logger olayı](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstash entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Logstash ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonunun yapılandırılması hakkında daha fazla bilgi](../logstash.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash olayı aşağıdaki şekilde günlüğe kaydedecektir:

![Logstash'ten ArcSight Logger'a yeni kullanıcıya ilişkin günlük](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

ArcSight Logger olaylarında aşağıdaki kayıt görüntülenecektir:

![Logstash'ten ArcSight Logger'a yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)