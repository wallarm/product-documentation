# Fluentd aracılığıyla IBM QRadar

Bu talimatlar, Wallarm’ın Fluentd veri toplayıcı ile entegrasyonuna örnek sağlar ve olayların QRadar SIEM sistemine iletilmesini mümkün kılar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## Kullanılan kaynaklar

* Debian 11.x (bullseye) üzerine kurulu ve `https://fluentd-example-domain.com` adresinden erişilebilen [Fluentd](#fluentd-configuration)
* Linux Red Hat üzerine kurulu ve IP adresi `https://109.111.35.11:514` ile erişilebilen [QRadar V7.3.3](#qradar-configuration-optional)
* [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration) için [EU cloud](https://my.wallarm.com) üzerindeki Wallarm Console’a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Fluentd ve QRadar hizmetlerine verilen bağlantılar örnek amaçlıdır, bu nedenle yanıt vermezler.

### Fluentd yapılandırması {#fluentd-configuration}

Wallarm günlükleri webhooks aracılığıyla ara veri toplayıcı Fluentd’e gönderdiğinden, Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmesi
* HTTPS isteklerini kabul etmesi
* Genel olarak erişilebilir bir URL’ye sahip olması
* Günlükleri IBM QRadar’a iletmesi; bu örnekte iletim için `remote_syslog` eklentisi kullanılır

Fluentd, `td-agent.conf` dosyasında yapılandırılır:

* Gelen webhook işlemesi `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 portuna gönderilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyasında bulunur
    * TLS sertifikasının özel anahtarı `/etc/ssl/private/fluentd.key` dosyasında bulunur
* Günlüklerin QRadar’a iletilmesi ve günlük çıktısı `match` yönergesinde yapılandırılmıştır:
    * Tüm olay günlükleri Fluentd’den kopyalanır ve `https://109.111.35.11:514` IP adresindeki QRadar’a iletilir
    * Günlükler, [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun olarak Fluentd’den QRadar’a JSON biçiminde iletilir
    * QRadar ile bağlantı TCP üzerinden kurulur
    * Fluentd günlükleri ayrıca komut satırında JSON biçiminde yazdırılır (19-22. kod satırları). Bu ayar, olayların Fluentd üzerinden kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için giriş eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantıların ele alınması için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Fluentd'den Syslog aracılığıyla günlük iletimi için çıkış eklentisi
      host 109.111.35.11 # günlüklerin iletileceği IP adresi
      port 514 # günlüklerin iletileceği port
      protocol tcp # bağlantı protokolü
    <format>
      @type json # iletilen günlüklerin biçimi
    </format>
  </store>
  <store>
     @type stdout # Fluentd günlüklerini komut satırına yazdırmak için çıkış eklentisi
     output_type json # komut satırına yazdırılan günlüklerin biçimi
  </store>
</match>
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Fluentd dokümantasyonunda](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd yapılandırmasının test edilmesi"
    Fluentd günlüklerinin oluşturulduğunu ve QRadar’a iletildiğini kontrol etmek için Fluentd’e PUT veya POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd günlükleri:**
    ![Fluentd'deki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadar günlükleri:**
    ![QRadar'daki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadar günlük yükü:**
    ![QRadar'daki günlükler](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadar yapılandırması (isteğe bağlı) {#qradar-configuration-optional}

QRadar’da günlük kaynağı yapılandırılır. Bu, QRadar’daki tüm günlükler listesinde Fluentd günlüklerini kolayca bulmaya yardımcı olur ve ayrıca ileri seviye günlük filtrelemesi için de kullanılabilir. Günlük kaynağı şu şekilde yapılandırılır:

* **Günlük Kaynağı Adı**: `Fluentd`
* **Günlük Kaynağı Açıklaması**: `Fluentd'den günlükler`
* **Günlük Kaynağı Türü**: Syslog standardı ile kullanılan gelen günlük ayrıştırıcı türü `Universal LEEF`
* **Protokol Yapılandırması**: günlük iletimi standardı `Syslog`
* **Günlük Kaynağı Tanımlayıcısı**: Fluentd IP adresi
* Diğer varsayılan ayarlar

QRadar günlük kaynağı kurulumuna ilişkin daha ayrıntılı açıklama [resmi IBM dokümantasyonunda](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf) mevcuttur.

![Fluentd için QRadar günlük kaynağı kurulumu](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Fluentd entegrasyonunun yapılandırılması {#configuration-of-fluentd-integration}

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyonunun yapılandırması hakkında daha fazla bilgi](../fluentd.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd olayı aşağıdaki gibi kaydedecektir:

![Fluentd'den QRadar'da yeni kullanıcıya ilişkin günlük](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

QRadar günlük yükünde aşağıdaki veriler JSON biçiminde görüntülenecektir:

![Fluentd'den QRadar'da yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)