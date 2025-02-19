```markdown
# Micro Focus ArcSight Logger Logstash üzerinden

Bu talimatlar, Wallarm ile Logstash veri toplayıcısının ArcSight Logger sistemine olay iletmek üzere örnek entegrasyonunu size sunmaktadır.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "ArcSight ESM Enterprise sürümü ile entegrasyon"
    Logstash'den ArcSight ESM Enterprise sürümüne günlük iletimini yapılandırmak için, ArcSight tarafında Syslog Connector'ün yapılandırılması ve ardından Logstash'den bu connector portuna günlüklerin iletilmesi önerilir. Bağlayıcıların daha ayrıntılı tanımını almak için lütfen [official ArcSight SmartConnector documentation](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs) adresinden **SmartConnector User Guide**'ı indirin.

## Kullanılan kaynaklar

* CentOS 7.8 üzerinde kurulu WEB URL `https://192.168.1.73:443` ile [ArcSight Logger 7.1](#arcsight-logger-configuration)
* Debian 11.x (bullseye) üzerinde kurulu ve `https://logstash.example.domain.com` adresinde erişilebilir [Logstash 7.7.0](#logstash-configuration)
* [EU cloud](https://my.wallarm.com)'daki Wallarm Console'a yönetici erişimi ile [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

ArcSight Logger ve Logstash servislerine ait bağlantılar örnek olarak alındığından, bu bağlantılar yanıt vermemektedir.

### ArcSight Logger yapılandırması

ArcSight Logger, `Wallarm Logstash logs` adlı günlük alıcısını aşağıdaki şekilde yapılandırmıştır:

* Günlükler UDP üzerinden alınmaktadır (`Type = UDP Receiver`)
* Dinleme portu `514`
* Olaylar syslog ayrıştırıcısı ile ayrıştırılmaktadır
* Diğer varsayılan ayarlar

![Configuration of receiver in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

Alıcının yapılandırması hakkında daha ayrıntılı bilgi için, lütfen [official ArcSight Logger documentation](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) adresinden uygun sürüme ait **Logger Installation Guide**'ı indirin.

### Logstash yapılandırması

Wallarm, günlükleri webhooks aracılığıyla Logstash ara veri toplayıcısına gönderdiğinden, Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Genel bir URL'ye sahip olmalıdır
* Günlükleri ArcSight Logger'a iletmelidir; bu örnekte günlüklerin iletimi için `syslog` eklentisi kullanılmaktadır

Logstash, `logstash-sample.conf` dosyasında aşağıdaki şekilde yapılandırılmıştır:

* Gelen webhook işleme `input` bölümünde yapılandırılmıştır:
    * Trafik port 5044'e gönderilir
    * Logstash, yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen CA tarafından imzalanmış Logstash TLS sertifikası `/etc/server.crt` dosyasında bulunmaktadır
    * TLS sertifikası için özel anahtar `/etc/server.key` dosyasında bulunmaktadır
* Günlüklerin ArcSight Logger'a iletilmesi ve günlük çıktısı `output` bölümünde yapılandırılmıştır:
    * Tüm olay günlükleri, Logstash'ten `https://192.168.1.73:514` IP adresindeki ArcSight Logger'a iletilir
    * Günlükler, [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun olarak JSON formatında Logstash'ten ArcSight Logger'a iletilir
    * ArcSight Logger ile bağlantı UDP üzerinden kurulmaktadır
    * Logstash günlükleri ayrıca komut satırında (15. kod satırı) yazdırılmaktadır. Bu ayar, olayların Logstash aracılığıyla kaydedildiğini doğrulamak amacıyla kullanılmaktadır

```bash linenums="1"
input {
  http { # input plugin for HTTP and HTTPS traffic
    port => 5044 # port for incoming requests
    ssl => true # HTTPS traffic processing
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  syslog { # output plugin to forward logs from Logstash via Syslog
    host => "192.168.1.73" # IP address to forward logs to
    port => "514" # port to forward logs to
    protocol => "udp" # connection protocol
    codec => json # format of forwarded logs
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [official Logstash documentation](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) adresinde bulunmaktadır.

!!! info "Logstash yapılandırmasını test etme"
    Logstash günlüklerinin oluşturulduğunu ve ArcSight Logger'a iletildiğini doğrulamak için, Logstash'e POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash günlükleri:**
    ![Logstash logs](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Logger'daki Olay:**
    ![ArcSight Logger event](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstash entegrasyonu yapılandırması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonu yapılandırması hakkında daha fazla detay](../logstash.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash, olayı aşağıdaki şekilde kaydedecektir:

![Log about new user in ArcSight Logger from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

ArcSight Logger olaylarında aşağıdaki giriş görüntülenecektir:

![New user card in ArcSight Logger from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)
```