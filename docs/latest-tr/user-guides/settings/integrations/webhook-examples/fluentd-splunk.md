[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Fluentd Aracılığıyla Splunk Enterprise

Bu talimatlar, olayları Splunk SIEM sistemine aktarmak üzere Fluentd veri toplayıcısı ile Wallarm'ın örnek entegrasyonunu sağlar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## Kullanılan kaynaklar

* WEB URL `https://109.111.35.11:8000` ve API URL `https://109.111.35.11:8088` olan [Splunk Enterprise](#splunk-enterprise-konfigürasyonu)
* Debian 11.x (bullseye) üzerinde kurulu [Fluentd](#fluentd-konfigürasyonu) ve `https://fluentd-example-domain.com` adresinde mevcut
* Wallarm Konsolunda yönetici erişimi [Avrupa bulutu içinde](https://my.wallarm.com) [Fluentd entegrasyonunu yapılandırmak](#fluentd-entegrasyonunun-yapılandırılması) için

--8<-- "../include/cloud-ip-by-request.md"

Splunk Enterprise ve Fluentd hizmetlerine yönlendiren bağlantılar örnek olarak aktarıldığından, herhangi bir yanıt vermezler.

### Splunk Enterprise Konfigürasyonu

Fluentd günlükleri diğer varsayılan ayarlarla birlikte `Wallarm Fluentd günlükleri` adı ile Splunk HTTP Olay Denetleyicisine gönderilir:

![HTTP Olay Toplayıcı Yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTP Olay Denetleyicisine erişmek için üretilen `f44b3179-91aa-44f5-a6f7-202265e10475` belirteci kullanılacaktır.

Splunk HTTP Olay Denetleyicisi kurulumunun daha ayrıntılı bir açıklaması [resmi Splunk belgelerinde](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) mevcuttur.

### Fluentd Konfigürasyonu

Wallarm, günlükleri Fluentd ara veri toplayıcısına web kancaları aracılığıyla gönderdikçe, Fluentd konfigürasyonu aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul eder
* HTTPS isteklerini kabul eder
* Kamuya açık URL'ye sahip olması
* Günlükleri Splunk Enterprise'a yönlendirebilir, bu örnekte günlükleri yönlendirmek için `splunk_hec` eklentisi kullanır

Fluentd, `td-agent.conf` dosyasında yapılandırılmıştır:

* Gelen web kancası işleme, `source` yönergesinde yapılandırılmıştır:
    * Trafik, 9880 portuna gönderilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul etmek üzere yapılandırılmıştır
    * Fluentd TLS sertifikası, kamuoyu tarafından güvenilen bir CA tarafından imzalanmış olup `/etc/ssl/certs/fluentd.crt` dosyasında bulunur
    * TLS sertifikasının özel anahtarı `/etc/ssl/private/fluentd.key` dosyasında bulunur
* Splunk'a günlüğü yönlendirme ve günlük çıktısı, `match` yönergesinde yapılandırılmıştır:
    * Tüm olay günlükleri Fluentd'den kopyalanır ve çıktı eklentisi [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec) aracılığıyla Splunk HTTP Olay Denetleyicisine yönlendirilir
    * Fluentd günlükleri ek olarak JSON formatında komut satırına yazdırılır (19-22 kod satırları). Ayar, olayların Fluentd aracılığıyla günlüğe kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için giriş eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantı işleme yapılandırması
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # günlükleri Splunk API'ye HTTP Olay denetleyicisi üzerinden iletmek için çıkış eklentisi fluent-plugin-splunk-hec
      hec_host 109.111.35.11 # Splunk sunucusu
      hec_port 8088 # Splunk API portu
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Olay Denetleyicisi belirteci
    <format>
      @type json # yönlendirilen günlüklerin formatı
    </format>
  </store>
  <store>
     @type stdout # Fluentd günlüklerini komut satırına yazdırmak için çıkış eklentisi
     output_type json # komut satırına yazdırılan günlüklerin formatı
  </store>
</match>
```

Yapılandırma dosyalarının daha ayrıntılı bir açıklaması [resmi Fluentd belgelerinde](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd konfigürasyonunu test etme"
    Fluentd günlüklerinin oluşturulduğunu ve Splunk'a yönlendirildiğini kontrol etmek için, Fluentd'ye bir PUT veya POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd günlükleri:**
    ![Fluentd'deki Günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunk günlükleri:**
    ![Splunk'taki Günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentd Entegrasyonunun Yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd ile Webhook Entegrasyonu](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyon konfigürasyonu hakkında daha fazla bilgi](../fluentd.md)

## Örnek Testleri

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd, olayı aşağıdaki gibi kaydeder:

![Fluentd'den Splunk'a yeni kullanıcı hakkındaki günlük](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

Splunk olaylarında aşağıdaki giriş görüntülenir:

![Fluentd'den Splunk'a yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Splunk Enterprise'daki Olayları Bir Gösterge Tablosu Olarak Düzenleme

--8<-- "../include/integrations/application-for-splunk.md"