# Fluentd aracılığıyla Micro Focus ArcSight Logger

Bu talimatlar, olayları ArcSight Logger sistemine iletmek üzere Wallarm’ın Fluentd veri toplayıcı ile örnek entegrasyonunu sağlar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "ArcSight ESM’in Enterprise sürümüyle entegrasyon"
    Fluentd’ten ArcSight ESM’in Enterprise sürümüne günlük yönlendirmesini yapılandırmak için, ArcSight tarafında Syslog Connector’ı yapılandırmanız ve ardından günlükleri Fluentd’ten konektörün portuna yönlendirmeniz önerilir. Konektörlere ilişkin daha ayrıntılı bir açıklama için lütfen [resmi ArcSight SmartConnector dokümantasyonundan](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs) **SmartConnector User Guide**’ı indirin.

## Kullanılan kaynaklar

* CentOS 7.8 üzerinde kurulu, WEB URL’si `https://192.168.1.73:443` olan [ArcSight Logger 7.1](#arcsight-logger-configuration)
* Debian 11.x (bullseye) üzerinde kurulu ve `https://fluentd-example-domain.com` üzerinden erişilebilen [Fluentd](#fluentd-configuration)
* [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration) için [AB bulutu](https://my.wallarm.com) üzerinde Wallarm Console’a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

ArcSight Logger ve Fluentd hizmetlerine ait bağlantılar örnek olarak verilmiştir; yanıt vermezler.

### ArcSight Logger yapılandırması

ArcSight Logger’da şu şekilde yapılandırılmış `Wallarm Fluentd logs` adlı bir günlük alıcısı bulunmaktadır:

* Günlükler UDP üzerinden alınır (`Type = UDP Receiver`)
* Dinleme portu `514`
* Olaylar syslog ayrıştırıcısı ile ayrıştırılır
* Diğer varsayılan ayarlar

![ArcSight Logger'da alıcı yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

Alıcı yapılandırmasının daha ayrıntılı bir açıklaması için, uygun sürüme ait **Logger Installation Guide**’ı [resmi ArcSight Logger dokümantasyonundan](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) indirin.

### Fluentd yapılandırması

Wallarm, günlükleri webhook’lar aracılığıyla Fluentd ara veri toplayıcısına gönderdiğinden, Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Genel bir URL’ye sahip olmalıdır
* Günlükleri ArcSight Logger’a iletmelidir; bu örnek, günlükleri iletmek için `remote_syslog` eklentisini kullanır

Fluentd, `td-agent.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme, `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 numaralı porta gönderilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilir bir CA tarafından imzalanmış Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyasında bulunur
    * TLS sertifikasının özel anahtarı `/etc/ssl/private/fluentd.key` dosyasında bulunur
* ArcSight Logger’a günlük yönlendirme ve günlük çıktısı, `match` yönergesinde yapılandırılmıştır:
    * Tüm olay günlükleri Fluentd’ten kopyalanır ve `https://192.168.1.73:514` IP adresindeki ArcSight Logger’a iletilir
    * Günlükler Fluentd’ten ArcSight Logger’a [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun olarak JSON formatında iletilir
    * ArcSight Logger ile bağlantı UDP üzerinden kurulur
    * Fluentd günlükleri ayrıca komut satırında JSON formatında yazdırılır (19-22. kod satırları). Bu ayar, olayların Fluentd üzerinden günlüğe kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için input eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantıların yönetimi için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Fluentd'ten Syslog aracılığıyla günlük iletimi için output eklentisi
      host 192.168.1.73 # günlüklerin iletileceği IP adresi
      port 514 # günlüklerin iletileceği port
      protocol udp # bağlantı protokolü
    <format>
      @type json # iletilen günlüklerin formatı
    </format>
  </store>
  <store>
     @type stdout # Fluentd günlüklerini komut satırına yazdırmak için output eklentisi
     output_type json # komut satırına yazdırılan günlüklerin formatı
  </store>
</match>
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Fluentd dokümantasyonunda](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd yapılandırmasını test etme"
    Fluentd günlüklerinin oluşturulup ArcSight Logger’a iletildiğini kontrol etmek için Fluentd’e PUT veya POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd günlükleri:**
    ![Fluentd'de günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **ArcSight Logger’daki olay:**
    ![ArcSight Logger'da günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Fluentd entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyonunun yapılandırılması hakkında daha fazla bilgi](../fluentd.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd olayı aşağıdaki gibi günlüğe kaydedecektir:

![Yeni kullanıcıya ilişkin Fluentd günlüğü](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

ArcSight Logger olaylarında aşağıdaki kayıt görüntülenecektir:

![ArcSight Logger'daki olaylar](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)