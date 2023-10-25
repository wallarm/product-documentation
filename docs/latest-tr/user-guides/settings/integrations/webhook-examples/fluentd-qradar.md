# IBM QRadar via Fluentd

Bu talimatlar, Wallarm'ı Fluentd veri koleksiyoncusu ile entegre ederek olayları QRadar SIEM sistemine ileri yönlendirmek için bir örnek sunar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## Kullanılan Kaynaklar

* [Fluentd](#fluentd-configuration) Debian 11.x (bullseye) üzerinde yüklü ve `https://fluentd-example-domain.com` adresinde mevcut
* [QRadar V7.3.3](#qradar-configuration-optional) Linux Red Hat üzerinde kurulu ve IP adresi `https://109.111.35.11:514` ile mevcut
* Wallarm Konsoluna yönetici erişimi [EU cloud](https://my.wallarm.com) [Fluentd entegrasyonunu](#configuration-of-fluentd-integration) yapılandırmak için

--8<-- "../include/cloud-ip-by-request.md"

Fluentd ve QRadar hizmetlerine yapılan bağlantılar örnek olarak belirtildiği için yanıt vermezler.

### Fluentd Yapılandırma

Wallarm, Fluentd ara veri toplayıcıya web kanca aracılığıyla günlük gönderdiğinden, Fluentd yapılandırması aşağıdaki gereklilikleri karşılamalıdır:

* POST veya PUT isteklerini kabul edin
* HTTPS isteklerini kabul edin
* Genel URL'ye sahip olun
* Günlükleri IBM Qradar'a yönlendirin, bu örnek `remote_syslog` eklentisini günlükleri yönlendirmek için kullanır

Fluentd, `td-agent.conf` dosyasında yapılandırılmıştır:

* Gelen web kanca işleme `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 portuna gönderilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul etmek üzere yapılandırılmıştır
    * Fluentd TLS sertifikası, genel olarak güvenilir bir CA tarafından imzalanmıştır ve `/etc/ssl/certs/fluentd.crt` dosyasında yer alır
    * TLS sertifikası için özel anahtar `/etc/ssl/private/fluentd.key` dosyasında yer alır
* Günlükleri QRadar'a yönlendirme ve günlük çıktıları `match` yönergesinde yapılandırılmıştır:
    * Tüm olay günlükleri Fluentd'den kopyalanır ve IP adresinde QRadar'a yönlendirilir `https://109.111.35.11:514`
    * Loglar, Fluentd'den QRadar'a [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına göre JSON formatında yönlendirilir
    * QRadar ile bağlantı TCP üzerinden kurulur
    * Fluentd günlükleri ayrıca komut satırında JSON formatında yazdırılır (19-22 kod satırları). Bu ayar, olayların Fluentd aracılığıyla kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # output plugin to forward logs from Fluentd via Syslog
      host 109.111.35.11 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol tcp # connection protocol
    <format>
      @type json # format of forwarded logs
    </format>
  </store>
  <store>
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

Yapılandırma dosyalarına dair daha ayrıntılı bir açıklama, [resmi Fluentd belgelerinde](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd Yapılandırmasını Test Etme"
    Fluentd günlüklerinin oluşturulduğunu ve QRadar'a yönlendirildiğini kontrol etmek için, PUT veya POST isteği Fluentd'ye gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd günlükleri:**
    ![Fluentd'deki Günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadar günlükleri:**
    ![QRadar'daki Günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadar günlük yükü:**
    ![QRadar'daki Günlük Yükü](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadar Yapılandırması (isteğe bağlı)

QRadar'da, günlük kaynağı yapılandırılır. Bu, QRadar'daki tüm günlüklerin listesinde Fluentd günlüğünü kolayca bulmayı sağlar ve ayrıca daha ileri günlük filtrelemesi için de kullanılabilir. Günlük kaynağı şu şekilde yapılandırılır:

* **Günlük Kaynak Adı**: `Fluentd`
* **Günlük Kaynak Açıklaması**: `Fluentd'den Gelen Günlükler`
* **Günlük Kaynak Türü**: Syslog standardı ile kullanılan gelen günlükler analizörü türü `Universal LEEF`
* **Protokol Yapılandırması**: günlükleri yönlendirme standardı `Syslog`
* **Günlük Kaynak Tanımlayıcısı**: Fluentd IP adresi
* Diğer varsayılan ayarlar

QRadar günlük kaynağı kurulumuna dair daha ayrıntılı bir açıklama, [resmi IBM belgelerinde](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf) mevcuttur.

![Fluentd için QRadar günlük kaynak kurulumu](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Fluentd Entegrasyonunun Yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyonu yapılandırması hakkında daha fazla bilgi](../fluentd.md)

## Örnek Test Etme

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd, olayı şu şekilde kaydeder:

![QRadar'da Fluentd'den Yeni Kullanıcı ile ilgili Günlük](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

Aşağıdaki veriler, JSON formatında QRadar günlük yükünde görüntülenir:

![QRadar'da Fluentd'den Yeni Kullanıcı Kartı](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)