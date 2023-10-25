Maintain the politeness tone of the language.Make sure that the resulting file has exactly the same URLs as the original file:
../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png
#logstash-configuration
#qradar-configuration-optional
https://my.wallarm.com
#configuration-of-logstash-integration
https://en.wikipedia.org/wiki/Syslog
https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html
https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf
../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png
../../../../images/user-guides/settings/integrations/add-logstash-integration.png
../logstash.md
../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png
../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png

# IBM QRadar via Logstash

Bu talimatlar, Wallarm'ın Logstash veri toplayıcısıyla örnek entegrasyonunu ve daha sonra olayları QRadar SIEM sistemine yönlendirmeyi sağlar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## Kullanılan kaynaklar

* Debian 11.x (bullseye) üzerinde yüklü [Logstash 7.7.0](#logstash-configuration) ve `https://logstash.example.domain.com` adresinde bulunabilir
* Linux Red Hat üzerinde yüklü [QRadar V7.3.3](#qradar-configuration-optional) ve IP adresi `https://109.111.35.11:514` ile mevcuttur
* [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration) için Wallarm Konsoluna [EU bulutta](https://my.wallarm.com) yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Logstash ve QRadar hizmetlerine yönlendiren bağlantılar örnek olarak verildiği için yanıt vermezler.

### Logstash yapılandırması

Wallarm, Logstash ara veri toplayıcısına web kancaları aracılığıyla günlükleri gönderir, bu nedenle Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Kamuya açık URL'ye sahip olmak
* IBM Qradar'a günlükleri iletme, bu örnek `syslog` eklentisini günlükleri yönlendirmek için kullanır

Logstash `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme `input` bölümünde yapılandırılmıştır:
    * Trafik 5044 portuna gönderilir
    * Logstash, yalnızca HTTPS bağlantılarını kabul etmek üzere yapılandırılmıştır
    * Logstash TLS sertifikası, genel olarak güvenilen bir CA tarafından imzalanmış ve `/etc/server.crt` dosyasında bulunur
    * TLS sertifikası için özel anahtar `/etc/server.key` dosyasında bulunur
* QRadar'a günlükleri iletmek ve günlük çıktısı `output` bölümünde yapılandırılmıştır:
    * Tüm olay günlükleri, Logstash'ten QRadar'a IP adresi `https://109.111.35.11:514` olan yerde iletildi
    * Günlükler, [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına göre JSON formatında Logstash'ten QRadar'a iletildi
    * QRadar ile bağlantı TCP üzerinden kurulur
    * Logstash günlükleri ek olarak komut satırında basılır (15. kod satırı). Ayar, olayların Logstash üzerinden kaydedilip kaydedilmediğini doğrulamak için kullanılır

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafiği için input eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafik işleme
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  syslog { # Logstash üzerinden Syslog aracılığıyla günlükleri iletmek için çıktı eklentisi
    host => "109.111.35.11" # günlükleri iletmek için IP adresi
    port => "514" # günlükleri iletmek için port
    protocol => "tcp" # bağlantı protokolü
    codec => json # iletilecek günlüklerin biçimi
  }
  stdout {} # Komut satırında Logstash günlüklerini yazdırmak için çıktı eklentisi
}
```

Yapılandırma dosyalarının daha ayrıntılı bir açıklaması [resmi Logstash belgelerinde](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! info "Logstash yapılandırmasını test etme"
    Logstash günlüklerinin oluşturulduğunu ve QRadar'a yönlendirildiğini kontrol etmek için, Logstash'a POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash günlükleri:**
    ![Logstash'ta günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadar günlükleri:**
    ![QRadar'da günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadar günlük yükü:**
    ![QRadar'da günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadar yapılandırması (isteğe bağlı)

QRadar'da, günlük kaynağı yapılandırılmıştır. Bu, Logstash günlüklerini QRadar'daki tüm günlükler listesinde kolayca bulmayı sağlar ve ayrıca daha fazla günlük filtrelemesi için de kullanılabilir. Günlük kaynağı aşağıdaki şekilde yapılandırılmıştır:

* **Günlük Kaynağı Adı**: `Logstash`
* **Günlük Kaynağı Tanımı**: `Logstash'tan gelen günlükler`
* **Günlük Kaynağı Türü**: Syslog standardı ile kullanılan gelen günlüklerin çözümleyicisi `Universal LEEF`
* **Protokol Yapılandırması**: günlüklerin iletilme standardı `Syslog`
* **Günlük Kaynağı Tanımlayıcısı**: Logstash IP adresi
* Diğer varsayılan ayarlar

QRadar günlük kaynağı kurulumunun daha ayrıntılı bir açıklaması [resmi IBM belgelerinde](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf) bulunabilir.

![Logstash için QRadar günlük kaynağı kurulumu](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Webhook'la Logstash entegrasyonu](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonu yapılandırması hakkında daha fazla ayrıntı](../logstash.md)

## Örnek testi

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash, olayı aşağıdaki şekilde kaydeder:

![Logstash'tan QRadar'da yeni kullanıcı hakkında günlük](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

Aşağıdaki veriler QRadar günlük yükünde JSON formatında görüntülenecektir:

![Logstash'tan QRadar'da yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)
