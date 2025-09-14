# Logstash aracılığıyla IBM QRadar

Bu talimatlar, Wallarm'ın Logstash veri toplayıcısı ile entegrasyonunun bir örneğini sunar; olaylar daha sonra QRadar SIEM sistemine iletilir.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## Kullanılan kaynaklar

* [Logstash 7.7.0](#logstash-configuration) Debian 11.x (bullseye) üzerine kuruludur ve `https://logstash.example.domain.com` adresinden erişilebilir
* [QRadar V7.3.3](#qradar-configuration-optional) Linux Red Hat üzerinde kuruludur ve `https://109.111.35.11:514` IP adresiyle erişilebilir
* [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration) için [EU cloud](https://my.wallarm.com) içindeki Wallarm Console'a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Logstash ve QRadar servislerine ait bağlantılar örnek olarak verildiğinden yanıt vermezler.

### Logstash yapılandırması

Wallarm günlükleri webhooks aracılığıyla ara veri toplayıcı olan Logstash'e gönderdiğinden, Logstash yapılandırmasının aşağıdaki gereksinimleri karşılaması gerekir:

* POST veya PUT isteklerini kabul etsin
* HTTPS isteklerini kabul etsin
* Genel erişilebilir bir URL'ye sahip olsun
* Günlükleri IBM QRadar'a iletsin; bu örnekte iletim için `syslog` eklentisi kullanılır

Logstash, `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme `input` bölümünde yapılandırılır:
    * Trafik 5044 numaralı porta gönderilir
    * Logstash yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Logstash TLS sertifikası `/etc/server.crt` dosyasındadır
    * TLS sertifikasının özel anahtarı `/etc/server.key` dosyasındadır
* QRadar'a günlük iletimi ve günlük çıktısı `output` bölümünde yapılandırılır:
    * Tüm olay günlükleri Logstash'tan QRadar'a `https://109.111.35.11:514` IP adresine iletilir
    * Günlükler [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun olarak JSON biçiminde Logstash'tan QRadar'a iletilir
    * QRadar ile bağlantı TCP üzerinden kurulur
    * Ayrıca Logstash günlükleri komut satırına yazdırılır (kodun 15. satırı). Bu ayar, olayların Logstash üzerinden günlüğe kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafiği için input eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafiği işleme
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  syslog { # Logstash'tan Syslog ile günlük iletimi için output eklentisi
    host => "109.111.35.11" # günlüklerin iletileceği IP adresi
    port => "514" # günlüklerin iletileceği port
    protocol => "tcp" # bağlantı protokolü
    codec => json # iletilen günlüklerin biçimi
  }
  stdout {} # Logstash günlüklerini komut satırına yazdırmak için output eklentisi
}
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Logstash belgelerinde](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! info "Logstash yapılandırmasını test etme"
    Logstash günlüklerinin oluşturulup QRadar'a iletildiğini doğrulamak için Logstash'e POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash günlükleri:**
    ![Logstash'taki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadar günlükleri:**
    ![QRadar'daki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadar günlük yükü:**
    ![QRadar'daki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadar yapılandırması (isteğe bağlı)

QRadar'da günlük kaynağı yapılandırılır. Bu, QRadar'daki tüm günlükler arasında Logstash günlüklerini kolayca bulmaya yardımcı olur ve ayrıca ileride günlük filtreleme için de kullanılabilir. Günlük kaynağı şu şekilde yapılandırılır:

* **Günlük Kaynağı Adı**: `Logstash`
* **Günlük Kaynağı Açıklaması**: `Logstash'tan günlükler`
* **Günlük Kaynağı Türü**: Syslog standardı ile kullanılan gelen günlük ayrıştırıcısı türü `Universal LEEF`
* **Protokol Yapılandırması**: günlük iletim standardı `Syslog`
* **Günlük Kaynağı Tanımlayıcısı**: Logstash IP adresi
* Diğer varsayılan ayarlar

QRadar günlük kaynağı kurulumunun daha ayrıntılı açıklaması [resmi IBM belgelerinde](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf) mevcuttur.

![Logstash için QRadar günlük kaynağı kurulumu](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Logstash ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonunun yapılandırması hakkında daha fazla ayrıntı](../logstash.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash olayı aşağıdaki gibi günlüğe kaydedecektir:

![Logstash'tan QRadar'da yeni kullanıcıyla ilgili günlük](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

QRadar günlük yükünde aşağıdaki JSON biçimli veriler görüntülenecektir:

![Logstash'tan QRadar'da yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)