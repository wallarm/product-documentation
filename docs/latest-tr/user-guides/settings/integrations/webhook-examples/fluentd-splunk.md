[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk Enterprise üzerinden Fluentd

Bu talimatlar, Wallarm ile Fluentd veri toplayıcısının örnek entegrasyonu aracılığıyla olayların Splunk SIEM sistemine iletilmesini sağlamaktadır.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## Kullanılan kaynaklar

* WEB URL'si `https://109.111.35.11:8000` ve API URL'si `https://109.111.35.11:8088` ile [Splunk Enterprise](#splunk-enterprise-configuration)
* Debian 11.x (bullseye) üzerinde kurulu ve `https://fluentd-example-domain.com` adresinde ulaşılabilen [Fluentd](#fluentd-configuration)
* [EU cloud](https://my.wallarm.com) üzerindeki Wallarm Console'a yönetici erişimi ile [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

Splunk Enterprise ve Fluentd servislerine örnek olarak verilen bağlantılar, gerçek yanıt vermemektedir.

### Splunk Enterprise yapılandırması

Fluentd logları, `Wallarm Fluentd logs` adıyla ve diğer varsayılan ayarlarla Splunk HTTP Event Controller’a gönderilir:

![HTTP Event Collector Yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTP Event Controller’a erişmek için oluşturulan `f44b3179-91aa-44f5-a6f7-202265e10475` token'ı kullanılacaktır.

Splunk HTTP Event Controller kurulumu hakkında daha detaylı bilgi [resmi Splunk dokümantasyonunda](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) mevcuttur.

### Fluentd yapılandırması

Wallarm, webhooks aracılığıyla logları Fluentd ara veri toplayıcısına gönderdiğinden, Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel URL’ye sahip olmak
* Logları Splunk Enterprise’a iletmek; bu örnekte logları iletmek için `splunk_hec` eklentisi kullanılmaktadır

Fluentd, `td-agent.conf` dosyasında yapılandırılır:

* Gelen webhook işleme, `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 portuna yönlendirilir
    * Fluentd, yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyasında bulunur
    * TLS sertifikası için özel anahtar `/etc/ssl/private/fluentd.key` dosyasında bulunur
* Logların Splunk’a iletilmesi ve log çıktısının alınması `match` yönergesinde yapılandırılmıştır:
    * Tüm olay logları Fluentd tarafından kopyalanır ve Splunk HTTP Event Controller üzerinden [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec) çıktı eklentisi ile iletilir
    * Fluentd logları, ayrıca komut satırında JSON formatında yazdırılır (19-22 kod satırı). Bu ayar, olayların Fluentd aracılığıyla loglandığını doğrulamak içindir

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için input eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantı işlemleri için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # logları Splunk API'sine HTTP Event Controller aracılığıyla iletmek için fluent-plugin-splunk-hec çıktı eklentisi
      hec_host 109.111.35.11 # Splunk ana makinesi
      hec_port 8088 # Splunk API portu
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controller token'ı
    <format>
      @type json # iletilen logların formatı
    </format>
  </store>
  <store>
     @type stdout # komut satırında Fluentd loglarını yazdırmak için çıktı eklentisi
     output_type json # komut satırında yazdırılan logların formatı
  </store>
</match>
```

Yapılandırma dosyaları hakkında daha detaylı bilgi [resmi Fluentd dokümantasyonunda](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd yapılandırmasını test etme"
    Fluentd loglarının oluşturulduğunu ve Splunk’a iletildiğini doğrulamak için, PUT veya POST isteği Fluentd’e gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd logları:**
    ![Fluentd Logları](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunk logları:**
    ![Splunk Logları](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentd entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd entegrasyonu ile webhook](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyonunun yapılandırılması hakkında daha detaylı bilgi](../fluentd.md)

## Örnek test etme

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd, olayı aşağıdaki gibi loglayacaktır:

![Splunk’te Fluentd’den yeni kullanıcı logu](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

Aşağıdaki giriş, Splunk olayları arasında görüntülenecektir:

![Splunk’te Fluentd’den yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Splunk Enterprise’da olayların panoda düzenli şekilde görüntülenmesi

--8<-- "../include/integrations/application-for-splunk.md"