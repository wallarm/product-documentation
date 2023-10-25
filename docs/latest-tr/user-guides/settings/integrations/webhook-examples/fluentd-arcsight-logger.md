# Micro Focus ArcSight Logger Fluentd üzerinden

Bu talimatlar, Wallarm'ın Fluentd veri toplayıcısıyla entegrasyon örneklerini ve daha sonra olayları ArcSight Logger sistemine yönlendirmeyi sağlar.

--8<-- "../include-tr/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! bilgi "ArcSight ESM'nin Kurumsal sürümü ile entegrasyon"
    Fluentd'den ArcSight ESM'nin Kurumsal sürümüne kayıtları yönlendirmek için, ArcSight tarafında Syslog Connector'u yapılandırmak ve daha sonra Fluentd'den kayıtları konektör bağlantı noktasına yönlendirmek önerilir. Konektörlerin daha ayrıntılı bir açıklamasını almak için, lütfen [resmi ArcSight SmartConnector belgeleri](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs) adresinden **SmartConnector Kullanıcı Kılavuzu** indirin.

## Kullanılan kaynaklar

* WEB URL'si olan [ArcSight Logger 7.1](#arcsight-logger-configuration) `https://192.168.1.73:443` CentOS 7.8 üzerinde yüklüdür
* [Fluentd](#fluentd-configuration) Debian 11.x (bullseye) üzerinde yüklü ve `https://fluentd-example-domain.com` adresinde kullanılabilir
* Wallarm Konsoluna yönetici erişimi [EU bulutta](https://my.wallarm.com) [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration) için

--8<-- "../include-tr/cloud-ip-by-request.md"

ArcSight Logger ve Fluentd servislerine olan bağlantılar örnek olarak alıntılandığından, yanıt vermezler.

### ArcSight Logger yapılandırması

ArcSight Logger, aşağıdaki şekilde yapılandırılmış `Wallarm Fluentd logları` alıcısına sahiptir:

* Loglar UDP üzerinden alınır (`Tür = UDP Alıcısı`)
* Dinleme portu `514`
* Olaylar syslog ayrıştırıcısı ile ayrıştırılır
* Diğer varsayılan ayarlar

![ArcSight Logger'daki alıcı yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

Alıcı yapılandırmasının daha ayrıntılı bir açıklamasını almak için, lütfen uygun bir sürümün **Logger Kurulum Kılavuzu**'nu [resmi ArcSight Logger belgeleri](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) adresinden indirin.

### Fluentd yapılandırması

Wallarm, Fluentd ara veri toplayıcısına web kancaları aracılığıyla log gönderdiğinden, Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul eder
* HTTPS isteklerini kabul eder
* Kamuya açık URL'ye sahip olur
* Logları ArcSight Logger'a yönlendirir, bu örnekte logları yönlendirmek için `remote_syslog` eklentisi kullanılıyor

Fluentd, `td-agent.conf` dosyasında yapılandırıldı:

* Gelen web kanca işleme `source` direktifi içinde yapılandırılır:
    * Trafik 9880 portuna gönderilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul etmeye ayarlanır
    * Genel olarak güvendiği CA tarafından imzalanmış Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyası içinde yer alır
    * TLS sertifikası için özel anahtar `/etc/ssl/private/fluentd.key` dosyası içinde bulunur
* ArcSight Logger'a logları yönlendirme ve log çıktısı `match` direktifi içinde yapılandırılır:
    * Tüm olay logları Fluentd'den kopyalanır ve ArcSight Logger'da `https://192.168.1.73:514` IP adresine yönlendirilir
    * Loglar, Fluentd'den ArcSight Logger'a [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun JSON formatında yönlendirilir
    * ArcSight Logger ile bağlantı UDP üzerinden kurulur
    * Fluentd logları ek olarak komut satırında JSON formatında basılır (19-22 kod satırları). Bu ayar, olayların Fluentd üzerinden loglandığını doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafik için giriş eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantıların işlenmesi için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Fluentd'den Syslog üzerinden logları yönlendirmek için çıkış eklentisi
      host 192.168.1.73 # Logları yönlendirmek için IP adresi
      port 514 # Logları yönlendirmek için port
      protocol udp # bağlantı protokolü
    <format>
      @type json # yönlendirilen logların formatı
    </format>
  </store>
  <store>
     @type stdout # Komut satırında Fluentd loglarını yazdırmak için çıkış eklentisi
     output_type json # komut satırında yazdırılan logların formatı
  </store>
</match>
```

Yapılandırma dosyalarının daha ayrıntılı bir açıklaması, [resmi Fluentd belgelerinde](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! bilgi "Fluentd yapılandırmasının test edilmesi"
    Fluentd loglarının oluşturulduğunu ve ArcSight Logger'a yönlendirildiğini kontrol etmek için, Fluentd'ye PUT veya POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd logları:**
    ![Fluentd'deki Loglar](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **ArcSight Logger'daki Olay:**
    ![ArcSight Logger'daki Loglar](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Fluentd entegrasyonu ayarları

--8<-- "../include-tr/integrations/webhook-examples/create-fluentd-webhook.md"

![Fluentd ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyon yapılandırması hakkında daha fazla detay](../fluentd.md)

## Örnek testi

--8<-- "../include-tr/integrations/webhook-examples/send-test-webhook.md"

Fluentd olayı şu şekilde loglar:

![Fluentd'da yeni kullanıcı hakkında log](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

Aşağıdaki giriş ArcSight Logger olaylarında görüntülenecektir:

![ArcCsiight Logger'daki Olaylar](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)
