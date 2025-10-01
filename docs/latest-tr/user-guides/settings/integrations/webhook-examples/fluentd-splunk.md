[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Fluentd aracılığıyla Splunk Enterprise

Bu talimatlar, Wallarm'ın Fluentd veri toplayıcı ile örnek entegrasyonunu sağlayarak olayların Splunk SIEM sistemine iletilmesini gösterir.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## Kullanılan kaynaklar

* [Splunk Enterprise](#splunk-enterprise-configuration) WEB URL `https://109.111.35.11:8000` ve API URL `https://109.111.35.11:8088` ile
* Debian 11.x (bullseye) üzerine kurulu ve `https://fluentd-example-domain.com` adresinde kullanılabilir [Fluentd](#fluentd-configuration)
* [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration) için [EU cloud](https://my.wallarm.com) içinde Wallarm Console'a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Splunk Enterprise ve Fluentd hizmetlerine yönelik bağlantılar örnek olarak verildiğinden, yanıt vermeyecektir.

### Splunk Enterprise yapılandırması {#splunk-enterprise-configuration}

Fluentd günlükleri, ad olarak `Wallarm Fluentd logs` ve diğer varsayılan ayarlarla Splunk HTTP Event Controller'a gönderilir:

![HTTP Event Collector yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTP Event Controller'a erişmek için oluşturulan belirteç `f44b3179-91aa-44f5-a6f7-202265e10475` kullanılacaktır.

Splunk HTTP Event Controller kurulumu hakkında daha ayrıntılı açıklama [resmi Splunk dokümantasyonunda](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) mevcuttur.

### Fluentd yapılandırması {#fluentd-configuration}

Wallarm, günlükleri webhooks üzerinden ara veri toplayıcı Fluentd'e gönderdiğinden, Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmesi
* HTTPS isteklerini kabul etmesi
* Genel bir URL'ye sahip olması
* Günlükleri Splunk Enterprise'a iletmesi; bu örnek, günlükleri iletmek için `splunk_hec` eklentisini kullanır

Fluentd, `td-agent.conf` dosyasında yapılandırılır:

* Gelen webhook işlemesi `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 numaralı bağlantı noktasına gönderilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyasında bulunur
    * TLS sertifikasına ait özel anahtar `/etc/ssl/private/fluentd.key` dosyasında bulunur
* Günlüklerin Splunk'a iletilmesi ve günlük çıktısı `match` yönergesinde yapılandırılmıştır:
    * Tüm olay günlükleri Fluentd'den kopyalanır ve [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec) çıktı eklentisi aracılığıyla Splunk HTTP Event Controller'a iletililir
    * Fluentd günlükleri ayrıca komut satırında JSON formatında yazdırılır (19‑22. satırlar). Bu ayar, olayların Fluentd üzerinden günlüğe kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için giriş eklentisi
  port 9880 # gelen istekler için bağlantı noktası
  <transport tls> # bağlantıların işlenmesi için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # günlükleri HTTP Event Controller üzerinden Splunk API'ye iletmek için çıkış eklentisi fluent-plugin-splunk-hec
      hec_host 109.111.35.11 # Splunk ana makinesi
      hec_port 8088 # Splunk API bağlantı noktası
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controller belirteci
    <format>
      @type json # iletilecek günlüklerin biçimi
    </format>
  </store>
  <store>
     @type stdout # Fluentd günlüklerini komut satırına yazdıran çıkış eklentisi
     output_type json # komut satırına yazdırılan günlüklerin biçimi
  </store>
</match>
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Fluentd dokümantasyonunda](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd yapılandırmasını test etme"
    Fluentd günlüklerinin oluşturulup Splunk'a iletildiğini kontrol etmek için Fluentd'e PUT veya POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd günlükleri:**
    ![Fluentd'deki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunk günlükleri:**
    ![Splunk'taki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentd entegrasyonunun yapılandırılması {#configuration-of-fluentd-integration}

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd ile webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyonunun yapılandırması hakkında daha fazla bilgi](../fluentd.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd olayı aşağıdaki şekilde günlüğe kaydedecektir:

![Fluentd'den Splunk'ta yeni kullanıcıya ait günlük](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

Splunk olaylarında aşağıdaki kayıt görüntülenecektir:

![Fluentd'den Splunk'ta yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Splunk Enterprise'de olayları bir kontrol panelinde düzenleme

--8<-- "../include/integrations/application-for-splunk.md"